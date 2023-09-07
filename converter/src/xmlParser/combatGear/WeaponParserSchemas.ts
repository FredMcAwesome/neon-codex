import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import {
  weaponXmlSubtypeEnum,
  WeaponXmlSubtypeSchema,
} from "@shadowrun/common/build/schemas/commonSchemas.js";
import { MountSchema } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { z as zod } from "zod";
import {
  GearXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../ParserCommonDefines.js";

const AccessoryXmlSchema = zod
  .object({
    name: zod.string(),
    mount: zod.optional(zod.union([zod.array(MountSchema), MountSchema])),
    rating: zod.optional(zod.number()),
    gears: zod.optional(GearXmlSchema),
  })
  .strict();
export type AccessoryXmlType = zod.infer<typeof AccessoryXmlSchema>;

const UnderbarrelXmlSchema = zod
  .object({
    underbarrel: StringArrayOrStringSchema,
  })
  .strict();

const AccuracyXmlSchema = StringOrNumberSchema;
export type AccuracyXmlType = zod.infer<typeof AccuracyXmlSchema>;

const DamageXmlSchema = zod.union([zod.string(), zod.literal(0)]);
export type DamageXmlType = zod.infer<typeof DamageXmlSchema>;

const AccessoriesXmlSchema = zod.union([
  zod.array(AccessoryXmlSchema),
  AccessoryXmlSchema,
]);
export type AccessoriesXmlType = zod.infer<typeof AccessoriesXmlSchema>;

const categorySchema = zod.union([
  zod.array(zod.nativeEnum(weaponXmlSubtypeEnum)),
  zod.nativeEnum(weaponXmlSubtypeEnum),
]);

type categoryType = zod.infer<typeof categorySchema>;

type NotExistsType = {
  _NOT: "";
  _operation: "exists";
};

type WeaponDetailsAndXmlType = {
  category?: categoryType | undefined;
  useskill: Array<String> | String | NotExistsType;
  OR: WeaponDetailsOrXmlType;
};

const WeaponDetailsAndXmlSchema: zod.ZodType<WeaponDetailsAndXmlType> = zod
  .object({
    category: zod.optional(categorySchema),
    useskill: zod.union([
      StringArrayOrStringSchema,
      zod
        .object({
          _NOT: zod.literal(""),
          _operation: zod.literal("exists"),
        })
        .strict(),
    ]),
    OR: zod.lazy(() => WeaponDetailsOrXmlSchema),
  })
  .strict();

const WeaponDetailsOrXmlSchema = zod
  .object({
    category: zod.optional(categorySchema),
    useskill: zod.optional(StringArrayOrStringSchema),
    AND: zod.optional(WeaponDetailsAndXmlSchema),
  })
  .strict();

type WeaponDetailsOrXmlType = zod.infer<typeof WeaponDetailsOrXmlSchema>;

const RequiredXmlSchema = zod.union([
  zod
    .object({
      weapondetails: zod
        .object({
          name: zod.optional(zod.string()),
          conceal: zod.optional(
            zod
              .object({
                xmltext: zod.number(),
                _operation: zod.union([
                  zod.literal("lessthanequals"),
                  zod.literal("greaterthan"),
                ]),
              })
              .strict()
          ),
        })
        .strict(),
    })
    .strict(),
  zod
    .object({
      OR: WeaponDetailsOrXmlSchema,
    })
    .strict(),
  zod
    .object({
      AND: WeaponDetailsAndXmlSchema,
    })
    .strict(),
]);

export type RequiredXmlType = zod.infer<typeof RequiredXmlSchema>;

const WeaponXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    type: zod.union([zod.literal("Ranged"), zod.literal("Melee")]),
    category: WeaponXmlSubtypeSchema,
    conceal: zod.number(),
    accuracy: AccuracyXmlSchema,
    reach: zod.number(),
    damage: DamageXmlSchema,
    ap: StringOrNumberSchema,
    mode: zod.union([zod.string(), zod.literal(0)]),
    rc: zod.union([zod.number(), zod.literal("-")]),
    ammo: StringOrNumberSchema,
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
    accessories: zod.optional(
      zod
        .object({
          accessory: AccessoriesXmlSchema,
        })
        .strict()
    ),
    accessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    addweapon: zod.optional(StringArrayOrStringSchema),
    allowaccessory: zod.optional(
      zod.union([zod.literal("True"), zod.literal("False")])
    ),
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
    alternaterange: zod.optional(zod.string()),
    ammocategory: zod.optional(zod.nativeEnum(weaponXmlSubtypeEnum)),
    ammoslots: zod.optional(zod.number()),
    cyberware: zod.optional(zod.literal("True")),
    doubledcostaccessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    extramount: zod.optional(MountSchema),
    hide: zod.optional(zod.literal("")),
    mount: zod.optional(MountSchema),
    range: zod.optional(zod.string()),
    required: zod.optional(RequiredXmlSchema),
    requireammo: zod.optional(
      zod.union([zod.literal("False"), zod.literal("microtorpedo")])
    ),
    singleshot: zod.optional(zod.literal(2)),
    sizecategory: zod.optional(zod.string()),
    shortburst: zod.optional(zod.literal(6)),
    spec: zod.optional(zod.string()),
    spec2: zod.optional(zod.string()),
    underbarrels: zod.optional(UnderbarrelXmlSchema),
    useskill: zod.optional(zod.string()),
    useskillspec: zod.optional(zod.string()),
    weapontype: zod.optional(zod.string()),
  })
  .strict();
export type WeaponXmlType = zod.infer<typeof WeaponXmlSchema>;
export const WeaponListXmlSchema = zod.array(WeaponXmlSchema);
export type WeaponListXmlType = zod.infer<typeof WeaponListXmlSchema>;
