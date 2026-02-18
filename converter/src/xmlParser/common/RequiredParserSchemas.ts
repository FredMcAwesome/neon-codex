import {
  armourXmlCategoryEnum,
  attributeXMLEnum,
  gearXmlCategoryEnum,
  spellXmlCategoryEnum,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import {
  MountSchema,
  priorityTableRunnerLevelEnum,
  vehicleCategoryEnum,
  weaponSubtypeEnum,
} from "@neon-codex/common";
import { metamagicArtEnum, spellDescriptorEnum } from "@neon-codex/common";
import { type } from "arktype";
import { metatypeXmlCategoryEnum } from "../character/MetatypeParserSchemas.js";

const SkillRequirementXmlSchema = type({
  "+": "reject",
  name: "string",
  val: "number",
  // does this need to be for a specialisation
  "spec?": "string",
  // knowledge or active
  "type?": "'Knowledge'",
});

const SpellCategorySchema = type({
  "+": "reject",
  name: type.valueOf(spellXmlCategoryEnum),
  // Number of known spells in this category
  count: "number",
});

export enum MathComparisonXMLEnum {
  LessThan = "lessthanequals",
  GreaterThan = "greaterthan",
  GreaterThanOrEqual = "greaterthanorequals",
}

const ConcealXmlSchema = type({
  "+": "reject",
  xmltext: "number",
  _operation: type.valueOf(MathComparisonXMLEnum),
});

const XmlContainsOperationSchema = type({
  "+": "reject",
  xmltext: "string",
  _operation: "'contains'",
});

const XmlStringOrContainsOperationSchema = type.or(
  XmlContainsOperationSchema,
  "string"
);

const XmlOperationSchema = type({
  "+": "reject",
  xmltext: StringOrNumberSchema,
  _operation: type.valueOf(MathComparisonXMLEnum),
});

const XmlWeaponSubtypeOrOperationSchema = type.or(
  type.valueOf(weaponSubtypeEnum),
  type({
    "+": "reject",
    xmltext: type.valueOf(weaponSubtypeEnum),
    _operation: "'contains'",
  })
);
export type XmlCategoryOrOperationType =
  typeof XmlWeaponSubtypeOrOperationSchema.infer;

export const RequiredWeaponDetailsXmlSubSchema = type({
  "+": "reject",
  "id?": "string",
  "name?": type.or(
    XmlStringOrContainsOperationSchema,
    XmlStringOrContainsOperationSchema.array()
  ),
  "ammo?": type.or(
    XmlContainsOperationSchema,
    XmlContainsOperationSchema.array()
  ),
  // Ammo type if different than weapon type or for exotic ranged weapons
  "ammocategory?": type.or(
    type.valueOf(weaponSubtypeEnum),
    type.valueOf(weaponSubtypeEnum).array()
  ),
  "category?": type.or(
    XmlWeaponSubtypeOrOperationSchema,
    XmlWeaponSubtypeOrOperationSchema.array()
  ),
  "type?": type.or("'Melee'", "'Ranged'"),
  "spec?": StringArrayOrStringSchema,
  "spec2?": StringArrayOrStringSchema,
  "useskill?": type.or(
    StringArrayOrStringSchema,
    type({
      "+": "reject",
      _NOT: "''",
      _operation: "'exists'",
    })
  ),
  "conceal?": ConcealXmlSchema,
  "accessorymounts?": type({
    "+": "reject",
    mount: type.or(MountSchema.array(), MountSchema),
  }),
  "damage?": XmlContainsOperationSchema,
  "mode?": XmlContainsOperationSchema,
  // Attribute of AND or OR
  "_NOT?": "''",
});
export type RequiredWeaponDetailsXmlSubSchemaType =
  typeof RequiredWeaponDetailsXmlSubSchema.infer;

// add recursive properties
const { RequiredWeaponDetailsXmlSchema } = type.module({
  LocalRequiredWeaponDetailsXmlSubSchema: RequiredWeaponDetailsXmlSubSchema,
  NonTopLevelSchema:
    "Merge<LocalRequiredWeaponDetailsXmlSubSchema, AndOrSchema>",
  AndOrSchema: {
    "+": "reject",
    "AND?": "NonTopLevelSchema  | NonTopLevelSchema[]",
    "OR?": "NonTopLevelSchema     | NonTopLevelSchema[]",
  },
  RequiredWeaponDetailsXmlSchema: [
    "AndOrSchema",
    "|",
    "LocalRequiredWeaponDetailsXmlSubSchema",
  ],
});
export type RequiredWeaponDetailsXmlType =
  typeof RequiredWeaponDetailsXmlSchema.infer;

export const RequiredParentDetailsXmlSchema = type.or(
  type({
    "+": "reject",
    // This is currently handled pretty hardcoded, so be careful if
    // changing these conditions to update the parser
    OR: type({
      "+": "reject",
      name: type
        .or(
          type({
            "+": "reject",
            xmltext: "string",
            _operation: "'contains'",
          }),
          "string"
        )
        .array(),
      // No parent
      "NONE?": "''",
    }),
  }),
  type({
    "+": "reject",
    "name?": "string",
    // both if category required for gear (as name is not unique)
    // or only category
    "category?": "string",
  }),
  type({
    "+": "reject",
    ammoforweapontype: "'bow'",
  }),
  type({
    "+": "reject",
    // No parent
    NONE: "''",
  })
);
export type RequiredParentDetailsType =
  typeof RequiredParentDetailsXmlSchema.infer;

const GearRequiredGearDetailsPropertyStandardSchema = type.or(
  type({
    "+": "reject",
    _operation: "'greaterthan'",
    xmltext: "0",
  }),
  type({
    "+": "reject",
    _operation: "'exists'",
    _NOT: "''",
  }),
  "0"
);

const GearDetailsPropertyUnionXMLSchema = type.or(
  GearRequiredGearDetailsPropertyStandardSchema,
  GearRequiredGearDetailsPropertyStandardSchema.array()
);
export type GearDetailsPropertyUnionXMLType =
  typeof GearDetailsPropertyUnionXMLSchema.infer;

const NameUnionSchema = type.or(
  StringArrayOrStringSchema,
  type({ "+": "reject", _operation: "'contains'", xmltext: "string" }),
  type
    .or(
      "string",
      type({ "+": "reject", _operation: "'contains'", xmltext: "string" })
    )
    .array()
);

const PartialGearRequiredInnerSchema = type.or(
  type({
    "+": "reject",
    "name?": NameUnionSchema,
    "category?": type.or(
      type.valueOf(gearXmlCategoryEnum),
      type.valueOf(armourXmlCategoryEnum),
      type
        .or(
          type.valueOf(gearXmlCategoryEnum),
          type.valueOf(armourXmlCategoryEnum)
        )
        .array()
    ),
    "attributearray?": type({
      "+": "reject",
      _operation: "'exists'",
      "_NOT?": "''",
    }),
    "attack?": GearDetailsPropertyUnionXMLSchema,
    "sleaze?": GearDetailsPropertyUnionXMLSchema,
    "dataprocessing?": GearDetailsPropertyUnionXMLSchema,
    "firewall?": GearDetailsPropertyUnionXMLSchema,
    // Attribute of AND or OR
    "NONE?": "''",
  })
);

export const { RequiredGearDetailsXmlSchema, InnerGearRequiredInnerSchema } =
  type.module({
    // module merge must be done on internal schemas
    LocalInnerGearRequiredInnerSchema: PartialGearRequiredInnerSchema,
    InnerGearRequiredInnerSchema:
      "Merge<LocalInnerGearRequiredInnerSchema, AndOrSchema>",
    AndOrSchema: {
      "+": "reject",
      "OR?": "InnerGearRequiredInnerSchema",
      "AND?": "InnerGearRequiredInnerSchema",
    },
    // The Top level should not have an AND/OR as well as other nodes,
    // it should be either/or
    RequiredGearDetailsXmlSchema: [
      "AndOrSchema",
      "|",
      "LocalInnerGearRequiredInnerSchema",
    ],
  });
export type InnerGearRequiredInnerType =
  typeof InnerGearRequiredInnerSchema.infer;
export type RequiredGearDetailsXmlType =
  typeof RequiredGearDetailsXmlSchema.infer;

const RequiredVehicleDetailsXmlSubSchema = type.or(
  type({
    "+": "reject",
    name: type.or(
      XmlStringOrContainsOperationSchema,
      XmlStringOrContainsOperationSchema.array()
    ),
  }),
  type({
    "+": "reject",
    "body?": type.or(XmlOperationSchema, XmlOperationSchema.array()),
    "seats?": type.or(XmlOperationSchema, XmlOperationSchema.array()),
    "category?": type.or(
      type({
        "+": "reject",
        xmltext: type.or(type.valueOf(vehicleCategoryEnum), "'Drones'"),
        _operation: "'contains'",
      }),
      // Can't use the above here or leads to: https://github.com/arktypeio/arktype/issues/1458
      XmlStringOrContainsOperationSchema.array()
    ),
  })
);
export type RequiredVehicleDetailsXmlSubType =
  typeof RequiredVehicleDetailsXmlSubSchema.infer;

// add recursive properties
export const { RequiredVehicleDetailsXmlSchema } = type.module({
  RequiredVehicleDetailsXmlSchema: [
    RequiredVehicleDetailsXmlSubSchema,
    "|",
    {
      "+": "reject",
      "AND?":
        "RequiredVehicleDetailsXmlSchema  | RequiredVehicleDetailsXmlSchema[]",
      "OR?":
        "RequiredVehicleDetailsXmlSchema   | RequiredVehicleDetailsXmlSchema[]",
    },
  ],
});
export type RequiredVehicleDetailsXmlType =
  typeof RequiredVehicleDetailsXmlSchema.infer;

const RequiredWeaponMountDetailsXmlSubSchema = type({
  "+": "reject",
  "control?": StringArrayOrStringSchema,
  "flexibility?": StringArrayOrStringSchema,
  "visibility?": StringArrayOrStringSchema,
});

// add recursive properties
export const { RequiredWeaponMountDetailsXmlSchema } = type.module({
  RequiredWeaponMountDetailsXmlSchema: [
    RequiredWeaponMountDetailsXmlSubSchema,
    "|",
    {
      "+": "reject",
      "AND?":
        "RequiredWeaponMountDetailsXmlSchema  | RequiredWeaponMountDetailsXmlSchema[]",
      "OR?":
        "RequiredWeaponMountDetailsXmlSchema  | RequiredWeaponMountDetailsXmlSchema[]",
    },
  ],
});
export type RequiredWeaponMountDetailsXmlType =
  typeof RequiredWeaponMountDetailsXmlSchema.infer;

const AttributeRequiredXMLSchema = type({
  "+": "reject",
  name: type.valueOf(attributeXMLEnum),
  "natural?": "''",
  total: "number",
});

export const RequiredXmlSubSchema = type({
  "+": "reject",
  "quality?": type.or(
    StringArrayOrStringSchema,
    type({
      "+": "reject",
      xmltext: "string",
      // seems to be a one-off that is just a selected string for the quality
      _extra: "string",
    })
  ),
  // Required qualities
  "characterquality?": StringArrayOrStringSchema,
  "martialart?": "string",
  "martialtechnique?": "string",
  "bioware?": StringArrayOrStringSchema,
  "cyberware?": StringArrayOrStringSchema,
  // Any cyberware that contains this string
  "cyberwarecontains?": "string",
  "metatype?": StringArrayOrStringSchema,
  "metatypecategory?": type.or(
    type.valueOf(metatypeXmlCategoryEnum),
    type.valueOf(metatypeXmlCategoryEnum).array()
  ),
  "gear?": {
    _minrating: "string",
    xmltext: "string",
  },
  "skill?": type.or(
    SkillRequirementXmlSchema,
    SkillRequirementXmlSchema.array()
  ),
  // What accessory must be installed
  "accessory?": StringArrayOrStringSchema,
  // How many additional special modification points are required to install
  "specialmodificationlimit?": "number",
  // What armor mod must be installed
  "armormod?": type({
    "+": "reject",
    xmltext: "string",
    _sameparent: "'True'",
  }),
  // Attribute requirements
  "attribute?": type.or(
    AttributeRequiredXMLSchema,
    AttributeRequiredXMLSchema.array()
  ),
  // What program must be installed
  "program?": "string",
  // Required lifestyle
  "lifestyle?": "string",
  // Required lifestyle qualities
  "lifestylequality?": StringArrayOrStringSchema,
  "gameplayoption?": type.valueOf(priorityTableRunnerLevelEnum),
  "ess?": type.or(
    type(
      type.or(
        type({
          "+": "reject",
          _grade: "string",
          xmltext: "number",
        }),
        "number"
      )
    ).array(),
    type.or(
      type({
        "+": "reject",
        _grade: "string",
        xmltext: "number",
      }),
      "number"
    )
  ),
  "magenabled?": "''",
  "resenabled?": "''",
  "depenabled?": "''",
  "initiategrade?": "number",
  "submersiongrade?": "number",
  "tradition?": StringArrayOrStringSchema,
  "metamagic?": "string",
  "metamagicart?": type.valueOf(metamagicArtEnum),
  "art?": type.or(
    type.valueOf(metamagicArtEnum),
    type.valueOf(metamagicArtEnum).array()
  ),
  "spell?": StringArrayOrStringSchema,
  "spellcategory?": type.or(SpellCategorySchema, SpellCategorySchema.array()),
  "spelldescriptor?": type({
    "+": "reject",
    name: type.valueOf(spellDescriptorEnum),
    // Number of known spells with this descriptor
    count: "number",
  }),
  "power?": StringArrayOrStringSchema,
  "critterpower?": "string",
  // Some traditions specify spirit forms
  "traditionspiritform?": "string",
});
export type RequiredXmlSubType = typeof RequiredXmlSubSchema.infer;

export const ParentRequiredXMLSchmea = type({
  "+": "reject",
  // These all relate to the parent of the item
  "parentdetails?": RequiredParentDetailsXmlSchema,
  "geardetails?": RequiredGearDetailsXmlSchema,
  "vehicledetails?": RequiredVehicleDetailsXmlSchema,
  "weapondetails?": RequiredWeaponDetailsXmlSchema,
  "weaponmountdetails?": RequiredWeaponMountDetailsXmlSchema,
});
export type ParentRequiredXMLType = typeof ParentRequiredXMLSchmea.infer;
const RequiredRecursiveXMLSubSchema = RequiredXmlSubSchema.merge(
  ParentRequiredXMLSchmea
);

export const { RequiredRecursiveXMLSchema } = type.module({
  RequiredRecursiveXMLSchema:
    "Merge<LocalRequiredRecursiveSubSchema, GroupSchema>",
  LocalRequiredRecursiveSubSchema: RequiredRecursiveXMLSubSchema,
  GroupSchema: {
    "+": "reject",
    // oneof (inside of a group node)
    "grouponeof?": [
      "RequiredRecursiveXMLSchema",
      "|",
      "RequiredRecursiveXMLSchema[]",
    ],
    // essentially an AND node (for related things I guess)
    "group?": [
      "RequiredRecursiveXMLSchema",
      "|",
      "RequiredRecursiveXMLSchema[]",
    ],
  },
});
export type RequiredRecursiveXMLType = typeof RequiredRecursiveXMLSchema.infer;

export const AllOneRequiredXMLSchema = ParentRequiredXMLSchmea.merge({
  "+": "reject",
  "oneof?": RequiredRecursiveXMLSchema,
  "allof?": RequiredRecursiveXMLSchema,
});

export const RequiredXmlSchema = type.or(
  AllOneRequiredXMLSchema,
  RequiredRecursiveXMLSchema
);
export type RequiredXmlType = typeof RequiredXmlSchema.infer;
