import { z as zod } from "zod";
import {
  attributeXMLEnum,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { WeaponXmlSubtypeSchema } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import { metamagicArtEnum } from "@neon-codex/common/build/enums.js";

const SkillSchema = zod
  .object({
    name: zod.string(),
    val: zod.number(),
    spec: zod.optional(zod.string()),
    type: zod.optional(zod.string()),
  })
  .strict();

const SpellCategorySchema = zod
  .object({
    name: zod.string(),
    count: zod.number(),
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

const XmlOperationSchema = zod
  .object({
    xmltext: StringOrNumberSchema,
    _operation: zod.string(),
  })
  .strict();

const XmlStringOrOperationSchema = zod.union([
  XmlOperationSchema,
  StringOrNumberSchema,
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

const RequiredVehicleDetailsXmlSubSchema = zod
  .object({
    name: zod.optional(
      zod.union([
        XmlStringOrOperationSchema,
        zod.array(XmlStringOrOperationSchema),
      ])
    ),
    body: zod.optional(
      zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    ),
    seats: zod.optional(
      zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    ),
    category: zod.optional(
      zod.union([
        zod.array(XmlStringOrOperationSchema),
        XmlStringOrOperationSchema,
      ])
    ),
  })
  .strict();

// add recursive properties
export type RequiredVehicleDetailsXmlType = zod.infer<
  typeof RequiredVehicleDetailsXmlSubSchema
> & {
  AND?:
    | RequiredVehicleDetailsXmlType
    | Array<RequiredVehicleDetailsXmlType>
    | undefined;
} & {
  OR?:
    | RequiredVehicleDetailsXmlType
    | Array<RequiredVehicleDetailsXmlType>
    | undefined;
};

const RequiredVehicleDetailsXmlSchema: zod.ZodType<RequiredVehicleDetailsXmlType> =
  RequiredVehicleDetailsXmlSubSchema.extend({
    AND: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredVehicleDetailsXmlSchema,
          zod.array(RequiredVehicleDetailsXmlSchema),
        ])
      )
    ),
    OR: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredVehicleDetailsXmlSchema,
          zod.array(RequiredVehicleDetailsXmlSchema),
        ])
      )
    ),
  }).strict();

const RequiredWeaponMountDetailsXmlSubSchema = zod
  .object({
    control: zod.optional(StringArrayOrStringSchema),
    flexibility: zod.optional(StringArrayOrStringSchema),
    visibility: zod.optional(StringArrayOrStringSchema),
    // name: zod.optional(
    //   zod.union([
    //     XmlStringOrOperationSchema,
    //     zod.array(XmlStringOrOperationSchema),
    //   ])
    // ),
    // body: zod.optional(
    //   zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    // ),
    // seats: zod.optional(
    //   zod.union([zod.array(XmlOperationSchema), XmlOperationSchema])
    // ),
    // category: zod.optional(
    //   zod.union([
    //     zod.array(XmlStringOrOperationSchema),
    //     XmlStringOrOperationSchema,
    //   ])
    // ),
  })
  .strict();

// add recursive properties
export type RequiredWeaponMountDetailsXmlType = zod.infer<
  typeof RequiredWeaponMountDetailsXmlSubSchema
> & {
  AND?:
    | RequiredWeaponMountDetailsXmlType
    | Array<RequiredWeaponMountDetailsXmlType>
    | undefined;
} & {
  OR?:
    | RequiredWeaponMountDetailsXmlType
    | Array<RequiredWeaponMountDetailsXmlType>
    | undefined;
};

const RequiredWeaponMountDetailsXmlSchema: zod.ZodType<RequiredWeaponMountDetailsXmlType> =
  RequiredWeaponMountDetailsXmlSubSchema.extend({
    AND: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredWeaponMountDetailsXmlSchema,
          zod.array(RequiredWeaponMountDetailsXmlSchema),
        ])
      )
    ),
    OR: zod.optional(
      zod.lazy(() =>
        zod.union([
          RequiredWeaponMountDetailsXmlSchema,
          zod.array(RequiredWeaponMountDetailsXmlSchema),
        ])
      )
    ),
  }).strict();

const GearRequiredGearDetailsPropertyStandardSchema = zod.union([
  zod
    .object({
      _operation: zod.string(),
      _NOT: zod.optional(zod.literal("")),
      xmltext: zod.optional(zod.union([zod.literal(0), zod.string()])),
    })
    .strict(),
  zod.literal(0),
]);

const GearDetailsPropertyUnionSchema = zod.union([
  GearRequiredGearDetailsPropertyStandardSchema,
  zod.array(GearRequiredGearDetailsPropertyStandardSchema),
]);

const NameUnionSchema = zod.union([
  StringArrayOrStringSchema,
  zod.array(
    zod.union([zod.string(), GearRequiredGearDetailsPropertyStandardSchema])
  ),
]);

const PartialGearRequiredInnerSchema = zod
  .object({
    category: zod.optional(StringArrayOrStringSchema),
    attributearray: zod.optional(
      zod
        .object({
          _operation: zod.string(),
          _NOT: zod.optional(zod.literal("")),
        })
        .strict()
    ),
    name: zod.optional(NameUnionSchema),
    NONE: zod.optional(zod.literal("")),
    attack: zod.optional(GearDetailsPropertyUnionSchema),
    sleaze: zod.optional(GearDetailsPropertyUnionSchema),
    dataprocessing: zod.optional(GearDetailsPropertyUnionSchema),
    firewall: zod.optional(GearDetailsPropertyUnionSchema),
  })
  .strict();

type RequiredGearDetailsXmlType = zod.infer<
  typeof PartialGearRequiredInnerSchema
> & {
  OR?: zod.infer<typeof RequiredGearDetailsXmlSchema> | undefined;
  AND?: zod.infer<typeof RequiredGearDetailsXmlSchema> | undefined;
};

export const RequiredGearDetailsXmlSchema: zod.ZodType<RequiredGearDetailsXmlType> =
  PartialGearRequiredInnerSchema.extend({
    OR: zod.optional(zod.lazy(() => RequiredGearDetailsXmlSchema)),
    AND: zod.optional(zod.lazy(() => RequiredGearDetailsXmlSchema)),
  }).strict();

const RequiredSubSchema = zod
  .object({
    tradition: zod.optional(StringArrayOrStringSchema),
    quality: zod.optional(StringArrayOrStringSchema),
    martialtechnique: zod.optional(zod.string()),
    // this should probably self-referential...
    initiategrade: zod.optional(zod.number()),
    metamagic: zod.optional(zod.string()),
    metamagicart: zod.optional(zod.nativeEnum(metamagicArtEnum)),
    spell: zod.optional(StringArrayOrStringSchema),
    spellcategory: zod.optional(
      zod.union([zod.array(SpellCategorySchema), SpellCategorySchema])
    ),
    spelldescriptor: zod.optional(
      zod
        .object({
          name: zod.string(),
          count: zod.number(),
        })
        .strict()
    ),
    bioware: zod.optional(StringArrayOrStringSchema),
    cyberware: zod.optional(StringArrayOrStringSchema),
    cyberwarecontains: zod.optional(zod.string()),
    metatype: zod.optional(StringArrayOrStringSchema),
    metatypecategory: zod.optional(StringArrayOrStringSchema),
    power: zod.optional(StringArrayOrStringSchema),
    critterpower: zod.optional(zod.string()),
    magenabled: zod.optional(zod.literal("")),
    resenabled: zod.optional(zod.literal("")),
    depenabled: zod.optional(zod.literal("")),
    submersiongrade: zod.optional(zod.number()),
    ess: zod.optional(
      zod.union([
        zod.array(
          zod.union([
            zod
              .object({
                _grade: zod.string(),
                xmltext: zod.number(),
              })
              .strict(),
            StringOrNumberSchema,
          ])
        ),
        zod.union([
          zod
            .object({
              _grade: zod.string(),
              xmltext: zod.number(),
            })
            .strict(),
          StringOrNumberSchema,
        ]),
      ])
    ),
    gear: zod.optional(
      zod
        .object({
          _minrating: zod.string(),
          xmltext: zod.string(),
        })
        .strict()
    ),
    skill: zod.optional(zod.union([zod.array(SkillSchema), SkillSchema])),
    gameplayoption: zod.optional(zod.string()),
  })
  .strict();

const RequiredRecursiveSubSchema = RequiredSubSchema.extend({
  grouponeof: zod.optional(
    zod.union([zod.array(RequiredSubSchema), RequiredSubSchema])
  ),
}).strict();

const RequiredRecursiveSchema = RequiredRecursiveSubSchema.extend({
  group: zod.optional(
    zod.union([
      zod.array(RequiredRecursiveSubSchema),
      RequiredRecursiveSubSchema,
    ])
  ),
}).strict();

const AttributeRequiredXMLSchema = zod
  .object({
    name: zod.nativeEnum(attributeXMLEnum),
    natural: zod.optional(zod.literal("")),
    total: zod.number(),
  })
  .strict();

const containsSchema = zod.union([
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
  zod
    .object({
      armormod: zod
        .object({
          xmltext: zod.string(),
          _sameparent: zod.literal("True"),
        })
        .strict(),
    })
    .strict(),
  zod
    .object({
      attribute: zod.union([
        AttributeRequiredXMLSchema,
        zod.array(AttributeRequiredXMLSchema),
      ]),
    })
    .strict(),
  zod.object({ program: zod.string() }).strict(),
  zod.object({ lifestylequality: StringArrayOrStringSchema }).strict(),
  zod.object({ characterquality: StringArrayOrStringSchema }).strict(),
  RequiredRecursiveSchema,
]);

export type containsType = zod.infer<typeof containsSchema>;

const parentDetailsSchema = zod
  .object({
    NONE: zod.optional(zod.literal("")),
    OR: zod.optional(
      zod
        .object({
          name: zod.array(
            zod.union([
              zod
                .object({
                  xmltext: zod.string(),
                  _operation: zod.string(),
                })
                .strict(),
              zod.string(),
            ])
          ),
          NONE: zod.optional(zod.literal("")),
        })
        .strict()
    ),
    category: zod.optional(zod.string()),
    name: zod.optional(zod.string()),
    ammoforweapontype: zod.optional(zod.literal("bow")),
  })
  .strict();

export const RequiredXmlSchema = zod.union([
  zod
    .object({
      weapondetails: zod.optional(RequiredWeaponDetailsXmlSchema),
      vehicledetails: zod.optional(RequiredVehicleDetailsXmlSchema),
      weaponmountdetails: zod.optional(RequiredWeaponMountDetailsXmlSchema),
      geardetails: zod.optional(RequiredGearDetailsXmlSchema),
      oneof: zod.optional(containsSchema),
      allof: zod.optional(containsSchema),
      parentdetails: zod.optional(parentDetailsSchema),
    })
    .strict(),
  zod
    .object({
      OR: WeaponAccessoryDetailsOrXmlSchema,
    })
    .strict(),
]);
export type RequiredXmlType = zod.infer<typeof RequiredXmlSchema>;
