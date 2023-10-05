import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { WeaponXmlSubtypeSchema } from "@shadowrun/common/build/schemas/commonSchemas.js";
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  GearXmlSchema,
  StringOrNumberSchema,
  StringArrayOrStringSchema,
  NumberOrRatingSchema,
} from "../common/ParserCommonDefines.js";

const AccessoryAccuracyXmlSchema = zod.number();
export type AccessoryAccuracyXmlType = zod.infer<
  typeof AccessoryAccuracyXmlSchema
>;

const AccessoryDamageXmlSchema = zod.number();
export type AccessoryDamageXmlType = zod.infer<typeof AccessoryDamageXmlSchema>;

const ConcealXmlSchema = zod
  .object({
    xmltext: zod.number(),
    _operation: zod.union([
      zod.literal("lessthanequals"),
      zod.literal("greaterthan"),
      zod.literal("greaterthanorequals"),
    ]),
  })
  .strict();

const XmlOperationSchema = zod
  .object({
    xmltext: zod.string(),
    _operation: zod.string(),
  })
  .strict();

const XmlStringOrOperationSchema = zod.union([
  XmlOperationSchema,
  zod.string(),
]);

const XmlCategoryOrOperationSchema = zod.union([
  WeaponXmlSubtypeSchema,
  zod
    .object({
      xmltext: WeaponXmlSubtypeSchema,
      _operation: zod.string(),
    })
    .strict(),
]);
export type XmlCategoryOrOperationType = zod.infer<
  typeof XmlCategoryOrOperationSchema
>;

const RequiredWeaponDetailsXmlSubSchema = zod
  .object({
    name: zod.optional(
      zod.union([
        XmlStringOrOperationSchema,
        zod.array(XmlStringOrOperationSchema),
      ])
    ),
    ammo: zod.optional(
      zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    ),
    ammocategory: zod.optional(
      zod.union([zod.array(WeaponXmlSubtypeSchema), WeaponXmlSubtypeSchema])
    ),
    category: zod.optional(
      zod.union([
        zod.array(XmlCategoryOrOperationSchema),
        XmlCategoryOrOperationSchema,
      ])
    ),
    type: zod.optional(zod.string()),
    spec: zod.optional(StringArrayOrStringSchema),
    spec2: zod.optional(StringArrayOrStringSchema),
    conceal: zod.optional(ConcealXmlSchema),
    useskill: zod.optional(
      zod.union([
        StringArrayOrStringSchema,
        zod
          .object({
            _NOT: zod.literal(""),
            _operation: zod.literal("exists"),
          })
          .strict(),
      ])
    ),
    accessorymounts: zod.optional(
      zod.object({ mount: StringArrayOrStringSchema }).strict()
    ),
    _NOT: zod.optional(zod.literal("")),
    damage: zod.optional(XmlOperationSchema),
    mode: zod.optional(XmlOperationSchema),
  })
  .strict();

// add recursive properties
export type RequiredWeaponDetailsXmlType = zod.infer<
  typeof RequiredWeaponDetailsXmlSubSchema
> & {
  AND?:
    | RequiredWeaponDetailsXmlType
    | Array<RequiredWeaponDetailsXmlType>
    | undefined;
} & {
  OR?:
    | RequiredWeaponDetailsXmlType
    | Array<RequiredWeaponDetailsXmlType>
    | undefined;
};

const RequiredWeaponDetailsXmlSchema: zod.ZodType<RequiredWeaponDetailsXmlType> =
  RequiredWeaponDetailsXmlSubSchema.extend({
    AND: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredWeaponDetailsXmlSchema,
          zod.array(RequiredWeaponDetailsXmlSchema),
        ])
      )
    ),
    OR: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredWeaponDetailsXmlSchema,
          zod.array(RequiredWeaponDetailsXmlSchema),
        ])
      )
    ),
  }).strict();

const WeaponAccessoryDetailsOrXmlSchema = zod.union([
  RequiredWeaponDetailsXmlSchema,
  zod
    .object({
      weapondetails: RequiredWeaponDetailsXmlSchema,
    })
    .strict(),
]);

const WeaponAccessoryRequiredXmlSchema = zod.union([
  zod
    .object({
      weapondetails: zod.optional(RequiredWeaponDetailsXmlSchema),
      oneof: zod.optional(
        zod.union([
          zod
            .object({
              accessory: StringArrayOrStringSchema,
            })
            .strict(),
          zod
            .object({
              specialmodificationlimit: zod.number(),
            })
            .strict(),
        ])
      ),
    })
    .strict(),
  zod
    .object({
      OR: WeaponAccessoryDetailsOrXmlSchema,
    })
    .strict(),
]);
export type WeaponAccessoryRequiredXmlType = zod.infer<
  typeof WeaponAccessoryRequiredXmlSchema
>;

const WeaponAccessoryXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Maximum accessory rating, 0 when not applicable
    rating: zod.number(),
    // Bonus/penalty to weapon accuracy
    accuracy: zod.optional(AccessoryAccuracyXmlSchema),
    // Bonus/penalty to weapon damage
    damage: zod.optional(AccessoryDamageXmlSchema),
    // Changes weapon damage type from stun to physical
    damagetype: zod.optional(zod.literal("P")),
    // Bonus/penalty to weapon reach
    reach: zod.optional(zod.number()),
    // Bonus/penalty to weapon armour penetration (bonus is negative for ap)
    ap: zod.optional(zod.number()),
    // Bonus/penalty to weapon recoil compensation
    rangemodifier: zod.optional(zod.number()),
    // Bonus/penalty to weapon conceal (bonus is negative for conceal)
    // sometimes using + for positive sometimes not... though zod ignores the +
    conceal: zod.optional(NumberOrRatingSchema),
    // Bonus/penalty to weapon recoil compensation
    rc: zod.optional(zod.number()),
    // Type of recoil compensation,
    // items from the same rcgroup are incompatible with each other
    rcgroup: zod.optional(zod.number()),
    // Recoil compensation is only available when item is deployed
    // e.g. tripod out and braced on ground, or folding stock out and braced on shoulder
    rcdeployable: zod.optional(zod.literal("True")),
    // Availability, can be a modifier to base weapon availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Modifies the cost to add accesories to a weapon
    // this should really be under a trait category
    accessorycostmultiplier: zod.optional(zod.number()),
    // Gear included with the weapon
    gears: zod.optional(GearXmlSchema),
    // Gear that can be added to the weapon accessory
    allowgear: zod.optional(
      zod
        .object({
          gearcategory: zod.union([
            zod.array(zod.nativeEnum(gearCategoryEnum)),
            zod.nativeEnum(gearCategoryEnum),
          ]),
        })
        .strict()
    ),
    // Requires the special modification quality
    specialmodification: zod.optional(zod.literal("True")),
    // Adds an additional ammo slot to a weapon
    // this is usually combined with ammo replace to provide a different reload method/ammo type
    ammoslots: zod.optional(zod.literal(1)),
    // Replace the original reload/ammo type with this one
    ammoreplace: zod.optional(StringOrNumberSchema),
    // Modifies the ammo capacity of all ammo slots currently in use
    // (I should put this and ammo bonus together)
    modifyammocapacity: zod.optional(zod.string()),
    // Modifies the ammo capacity, normally by a percentage amount
    // For explosive magazine this instead modifies it by -2 bullets
    ammobonus: zod.optional(StringOrNumberSchema),
    // Mount locations required to add accessory
    // For a few accessories this is one of a few locations
    mount: zod.optional(zod.union([zod.string(), zod.literal("")])),
    // Second mount location, seems to be an error here
    // sometimes there are 2 options for mount and extramount, when there should just be 1 in each
    extramount: zod.optional(zod.string()),
    // this item is not selectable i.e. only used when weapon includes it
    hide: zod.optional(zod.literal("")),
    // Add an underbarrel weapon to the host weapon
    // This should really only be used for Krim Stun-O-Net
    // but could maybe be removed even from that
    // Normally you add underbarrel weapons and then they are linked as accessories separately
    addunderbarrels: zod.optional(
      zod
        .object({
          weapon: zod.string(),
        })
        .strict()
    ),
    // Requirements on host weapon
    required: zod.optional(WeaponAccessoryRequiredXmlSchema),
    // Host weapon cannot have these traits
    forbidden: zod.optional(WeaponAccessoryRequiredXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type WeaponAccessoryXmlType = zod.infer<typeof WeaponAccessoryXmlSchema>;
export const WeaponAccessoryListXmlSchema = zod.array(WeaponAccessoryXmlSchema);
export type WeaponAccessoryListXmlType = zod.infer<
  typeof WeaponAccessoryListXmlSchema
>;
