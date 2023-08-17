import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import {
  weaponXmlSubtypeEnum,
  WeaponXmlSubtypeSchema,
} from "@shadowrun/common/build/schemas/commonSchema.js";
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  GearXmlSchema,
  StringOrNumberSchema,
  StringArrayOrStringSchema,
} from "../ParserCommonDefines.js";

const AccessoryAccuracyXmlSchema = zod.number();
export type AccessoryAccuracyXmlType = zod.infer<
  typeof AccessoryAccuracyXmlSchema
>;

const AccessoryDamageXmlSchema = zod.number();
export type AccessoryDamageXmlType = zod.infer<typeof AccessoryDamageXmlSchema>;

const LowerSchema = zod
  .object({
    category: zod.union([
      zod.array(zod.nativeEnum(weaponXmlSubtypeEnum)),
      zod.nativeEnum(weaponXmlSubtypeEnum),
    ]),
    useskill: StringArrayOrStringSchema,
    AND: zod.object({
      OR: zod.object({
        category: StringArrayOrStringSchema,
      }),
    }),
  })
  .strict();

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

const XmlOperationSchema = zod.object({
  xmltext: zod.string(),
  _operation: zod.string(),
});

const XmlStringOrOperationSchema = zod.union([
  XmlOperationSchema,
  zod.string(),
]);

const XmlCategoryOrOperationSchema = zod.union([
  WeaponXmlSubtypeSchema,
  zod.object({
    xmltext: WeaponXmlSubtypeSchema,
    _operation: zod.string(),
  }),
]);
export type XmlCategoryOrOperationType = zod.infer<
  typeof XmlCategoryOrOperationSchema
>;

const RequiredWeaponDetailsXmlSchema = zod
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
    useskill: zod.optional(StringArrayOrStringSchema),
    AND: zod.optional(
      zod.object({
        OR: zod
          .object({
            category: StringArrayOrStringSchema,
          })
          .strict(),
      })
    ),
    accessorymounts: zod.optional(
      zod.object({ mount: StringArrayOrStringSchema })
    ),
    _NOT: zod.optional(zod.literal("")),
    damage: zod.optional(XmlOperationSchema),
    // OR: zod.optional(LowerSchema),
  })
  .strict();

export type RequiredWeaponDetailsXmlType = zod.infer<
  typeof RequiredWeaponDetailsXmlSchema
>;

const WeaponAccessoryDetailsOrXmlSchema = zod.union([
  LowerSchema,
  zod
    .object({
      weapondetails: RequiredWeaponDetailsXmlSchema,
    })
    .strict(),
]);

const WeaponAccessoryOr = zod
  .object({
    OR: zod.union([
      RequiredWeaponDetailsXmlSchema,
      zod.array(RequiredWeaponDetailsXmlSchema),
    ]),
    mode: zod.optional(XmlOperationSchema),
    conceal: zod.optional(ConcealXmlSchema),
  })
  .strict();

const WeaponAccessoryRequiredXmlSchema = zod.union([
  zod
    .object({
      weapondetails: zod.optional(
        zod.union([WeaponAccessoryOr, RequiredWeaponDetailsXmlSchema])
      ),
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
    rating: zod.number(),
    accuracy: zod.optional(AccessoryAccuracyXmlSchema),
    damage: zod.optional(AccessoryDamageXmlSchema),
    damagetype: zod.optional(zod.literal("P")),
    reach: zod.optional(zod.number()),
    ap: zod.optional(zod.number()),
    rc: zod.optional(zod.number()),
    rcgroup: zod.optional(zod.number()), // items from the same rcgroup are incompatible with each other
    rcdeployable: zod.optional(zod.literal("True")),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
    accessorycostmultiplier: zod.optional(zod.number()), // this should really be under a trait category
    gears: zod.optional(GearXmlSchema),
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
    specialmodification: zod.optional(zod.literal("True")),
    ammoslots: zod.optional(zod.literal(1)),
    modifyammocapacity: zod.optional(zod.string()), // put this and ammo bonus together
    ammobonus: zod.optional(StringOrNumberSchema),
    ammoreplace: zod.optional(StringOrNumberSchema),
    mount: zod.optional(zod.union([zod.string(), zod.literal("")])),
    extramount: zod.optional(zod.string()),
    hide: zod.optional(zod.literal("")), // unused again?
    rangemodifier: zod.optional(zod.number()),
    addunderbarrels: zod.optional(
      // redundant information
      zod
        .object({
          weapon: zod.string(),
        })
        .strict()
    ),
    conceal: zod.optional(zod.union([zod.number(), zod.literal("Rating")])),
    required: zod.optional(WeaponAccessoryRequiredXmlSchema),
    forbidden: zod.optional(WeaponAccessoryRequiredXmlSchema),
  })
  .strict();
export type WeaponAccessoryXmlType = zod.infer<typeof WeaponAccessoryXmlSchema>;
export const WeaponAccessoryListXmlSchema = zod.array(WeaponAccessoryXmlSchema);
export type WeaponAccessoryListXmlType = zod.infer<
  typeof WeaponAccessoryListXmlSchema
>;