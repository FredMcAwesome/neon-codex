import { gearCategoryEnum } from "@shadowrun/common/src/enums.js";
import { weaponSubtypeEnum } from "@shadowrun/common/src/schemas/commonSchema.js";
import { z as zod } from "zod";
import { GearXmlSchema, SourceXmlSchema } from "./WeaponParserSchema.js";

const AccessoryAccuracyXmlSchema = zod.number();
export type AccessoryAccuracyXmlType = zod.infer<
  typeof AccessoryAccuracyXmlSchema
>;

const AccessoryDamageXmlSchema = zod.number();
export type AccessoryDamageXmlType = zod.infer<typeof AccessoryDamageXmlSchema>;

const LowerSchema = zod
  .object({
    category: zod.union([
      zod.array(zod.nativeEnum(weaponSubtypeEnum)),
      zod.nativeEnum(weaponSubtypeEnum),
    ]),
    useskill: zod.union([zod.array(zod.string()), zod.string()]),
    AND: zod.object({
      OR: zod.object({
        category: zod.union([zod.array(zod.string()), zod.string()]),
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

const RequiredWeaponDetailsXmlSchema = zod
  .object({
    ammo: zod.optional(
      zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    ),
    ammocategory: zod.optional(
      zod.union([zod.array(zod.string()), zod.string()])
    ),
    category: zod.optional(
      zod.union([
        zod.array(XmlStringOrOperationSchema),
        XmlStringOrOperationSchema,
      ])
    ),
    name: zod.optional(
      zod.union([
        XmlStringOrOperationSchema,
        zod.array(XmlStringOrOperationSchema),
      ])
    ),
    type: zod.optional(zod.string()),
    spec: zod.optional(zod.union([zod.string(), zod.array(zod.string())])),
    spec2: zod.optional(zod.union([zod.string(), zod.array(zod.string())])),
    conceal: zod.optional(ConcealXmlSchema),
    useskill: zod.optional(zod.string()),
    AND: zod.optional(
      zod.object({
        OR: zod
          .object({
            category: zod.union([zod.array(zod.string()), zod.string()]),
          })
          .strict(),
      })
    ),
    accessorymounts: zod.optional(
      zod.union([
        zod.array(zod.object({ mount: zod.string() })),
        zod.object({ mount: zod.string() }),
      ])
    ),
    _NOT: zod.optional(zod.literal("")),
    damage: zod.optional(XmlOperationSchema),
    OR: zod.optional(LowerSchema),
  })
  .strict();

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
  })
  .strict();

const WeaponAccessoryForbiddenXmlSchema = zod.object({
  weapondetails: zod.optional(
    zod.union([
      WeaponAccessoryOr,
      zod
        .object({
          name: zod.optional(zod.string()),
          type: zod.optional(zod.string()),
        })
        .strict(),
    ])
  ),
  oneof: zod.optional(
    zod
      .object({
        accessory: zod.union([zod.array(zod.string()), zod.string()]),
      })
      .strict()
  ),
});
export type WeaponAccessoryForbiddenXmlType = zod.infer<
  typeof WeaponAccessoryForbiddenXmlSchema
>;

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
              accessory: zod.union([zod.array(zod.string()), zod.string()]),
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
    avail: zod.union([zod.string(), zod.number()]),
    cost: zod.union([zod.string(), zod.number()]),
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
    ammobonus: zod.optional(zod.union([zod.number(), zod.string()])),
    ammoreplace: zod.optional(zod.union([zod.string(), zod.number()])),
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
    forbidden: zod.optional(WeaponAccessoryForbiddenXmlSchema),
  })
  .strict();
export type WeaponAccessoryXmlType = zod.infer<typeof WeaponAccessoryXmlSchema>;
export const WeaponAccessoryListXmlSchema = zod.array(WeaponAccessoryXmlSchema);
export type WeaponAccessoryListXmlType = zod.infer<
  typeof WeaponAccessoryListXmlSchema
>;
