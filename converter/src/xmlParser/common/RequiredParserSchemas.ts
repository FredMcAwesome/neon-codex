import {
  attributeXMLEnum,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { WeaponXmlSubtypeSchema } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import { metamagicArtEnum } from "@neon-codex/common/build/enums.js";
import { type } from "arktype";

const SkillSchema = type({
  name: "string",
  val: "number",
  "spec?": "string",
  "type?": "string",
});

const SpellCategorySchema = type({
  name: "string",
  count: "number",
});

const ConcealXmlSchema = type({
  xmltext: "number",
  _operation: type.or(
    "'lessthanequals'",
    "'greaterthan'",
    "'greaterthanorequals'"
  ),
});

const XmlOperationSchema = type({
  xmltext: StringOrNumberSchema,
  _operation: "string",
});

const XmlStringOrOperationSchema = type.or(
  XmlOperationSchema,
  StringOrNumberSchema
);

const XmlCategoryOrOperationSchema = type.or(WeaponXmlSubtypeSchema, {
  xmltext: WeaponXmlSubtypeSchema,
  _operation: "string",
});
export type XmlCategoryOrOperationType =
  typeof XmlCategoryOrOperationSchema.infer;

const RequiredWeaponDetailsXmlSubSchema = type({
  "name?": type.or(
    XmlStringOrOperationSchema,
    XmlStringOrOperationSchema.array()
  ),
  "ammo?": type.or(XmlOperationSchema, XmlOperationSchema.array()),
  "ammocategory?": type.or(
    WeaponXmlSubtypeSchema,
    WeaponXmlSubtypeSchema.array()
  ),
  "category?": type.or(
    [XmlCategoryOrOperationSchema],
    XmlCategoryOrOperationSchema
  ),
  "type?": "string",
  "spec?": StringArrayOrStringSchema,
  "spec2?": StringArrayOrStringSchema,
  "conceal?": ConcealXmlSchema,
  "useskill?": type.or(StringArrayOrStringSchema, {
    _NOT: "''",
    _operation: "'exists'",
  }),
  "accessorymounts?": { mount: StringArrayOrStringSchema },
  "_NOT?": "''",
  "damage?": XmlOperationSchema,
  "mode?": XmlOperationSchema,
});

// add recursive properties
const { RequiredWeaponDetailsXmlSchema } = type.module({
  RequiredWeaponDetailsXmlSchema: [
    RequiredWeaponDetailsXmlSubSchema,
    "|",
    {
      "AND?":
        "RequiredWeaponDetailsXmlSchema  | RequiredWeaponDetailsXmlSchema[]",
      "OR?":
        "RequiredWeaponDetailsXmlSchema   | RequiredWeaponDetailsXmlSchema[]",
    },
  ],
});
export type RequiredWeaponDetailsXmlType =
  typeof RequiredWeaponDetailsXmlSchema.infer;

const WeaponAccessoryDetailsOrXmlSchema = type.or(
  RequiredWeaponDetailsXmlSchema,
  {
    weapondetails: RequiredWeaponDetailsXmlSchema,
  }
);

const RequiredVehicleDetailsXmlSubSchema = type({
  "name?": type.or(
    XmlStringOrOperationSchema,
    XmlStringOrOperationSchema.array()
  ),
  "body?": type.or(XmlOperationSchema, XmlOperationSchema.array()),
  "seats?": type.or(XmlOperationSchema, XmlOperationSchema.array()),
  "category?": type.or(
    XmlStringOrOperationSchema,
    XmlStringOrOperationSchema.array()
  ),
});

// add recursive properties
const { RequiredVehicleDetailsXmlSchema } = type.module({
  RequiredVehicleDetailsXmlSchema: [
    RequiredVehicleDetailsXmlSubSchema,
    "|",
    {
      "AND?":
        "RequiredVehicleDetailsXmlSchema  | RequiredVehicleDetailsXmlSchema[]",
      "OR?":
        "RequiredVehicleDetailsXmlSchema   | RequiredVehicleDetailsXmlSchema[]",
    },
  ],
});

const RequiredWeaponMountDetailsXmlSubSchema = type({
  "control?": StringArrayOrStringSchema,
  "flexibility?": StringArrayOrStringSchema,
  "visibility?": StringArrayOrStringSchema,
  // "name?": (
  //   type.or(
  //     XmlStringOrOperationSchema,
  //     XmlStringOrOperationSchema.array(),
  //   ).array()
  // ),
  // "body?": (
  //   type.or(XmlOperationSchema, XmlOperationSchema.array()).array()
  // ),
  // "seats?": (
  //   type.or(XmlOperationSchema.array(), XmlOperationSchema).array()
  // ),
  // "category?": (
  //   type.or(
  //     XmlStringOrOperationSchema,
  //     XmlStringOrOperationSchema.array(),
  //   ).array()
  // ),
});

// add recursive properties
const { RequiredWeaponMountDetailsXmlSchema } = type.module({
  RequiredWeaponMountDetailsXmlSchema: [
    RequiredWeaponMountDetailsXmlSubSchema,
    "|",
    {
      "AND?":
        "RequiredWeaponMountDetailsXmlSchema  | RequiredWeaponMountDetailsXmlSchema[]",
      "OR?":
        "RequiredWeaponMountDetailsXmlSchema  | RequiredWeaponMountDetailsXmlSchema[]",
    },
  ],
});

const GearRequiredGearDetailsPropertyStandardSchema = type.or(
  {
    _operation: "string",
    "_NOT?": "''",
    "xmltext?": type.or("0", "string"),
  },
  "0"
);

const GearDetailsPropertyUnionSchema = type.or(
  GearRequiredGearDetailsPropertyStandardSchema,
  [GearRequiredGearDetailsPropertyStandardSchema]
);

const NameUnionSchema = type.or(StringArrayOrStringSchema, [
  type.or("string", GearRequiredGearDetailsPropertyStandardSchema),
]);

const PartialGearRequiredInnerSchema = type({
  "category?": StringArrayOrStringSchema,
  "attributearray?": {
    _operation: "string",
    "_NOT?": "''",
  },
  "name?": NameUnionSchema,
  "NONE?": "''",
  "attack?": GearDetailsPropertyUnionSchema,
  "sleaze?": GearDetailsPropertyUnionSchema,
  "dataprocessing?": GearDetailsPropertyUnionSchema,
  "firewall?": GearDetailsPropertyUnionSchema,
});

export const { RequiredGearDetailsXmlSchema } = type.module({
  RequiredGearDetailsXmlSchema: [
    PartialGearRequiredInnerSchema,
    "|",
    {
      "OR?": "RequiredGearDetailsXmlSchema",
      "AND?": "RequiredGearDetailsXmlSchema",
    },
  ],
});

const RequiredSubSchema = type({
  "tradition?": StringArrayOrStringSchema,
  "quality?": type.or(StringArrayOrStringSchema, {
    xmltext: "string",
    _extra: "string",
  }),
  "martialtechnique?": "string",
  // this should probably self-referential...
  "initiategrade?": "number",
  "metamagic?": "string",
  "metamagicart?": type.valueOf(metamagicArtEnum),
  "spell?": StringArrayOrStringSchema,
  "spellcategory?": type.or(SpellCategorySchema, SpellCategorySchema.array()),
  "spelldescriptor?": {
    name: "string",
    count: "number",
  },
  "bioware?": StringArrayOrStringSchema,
  "cyberware?": StringArrayOrStringSchema,
  "cyberwarecontains?": "string",
  "metatype?": StringArrayOrStringSchema,
  "metatypecategory?": StringArrayOrStringSchema,
  "power?": StringArrayOrStringSchema,
  "critterpower?": "string",
  "magenabled?": "''",
  "resenabled?": "''",
  "depenabled?": "''",
  "submersiongrade?": "number",
  "ess?": type.or(
    type(
      type.or(
        {
          _grade: "string",
          xmltext: "number",
        },
        StringOrNumberSchema
      )
    ).array(),
    type.or(
      {
        _grade: "string",
        xmltext: "number",
      },
      StringOrNumberSchema
    )
  ),
  "gear?": {
    _minrating: "string",
    xmltext: "string",
  },
  "skill?": type.or(SkillSchema, SkillSchema.array()),
  "gameplayoption?": "string",
});
const RequiredRecursiveSubSchema = RequiredSubSchema.and({
  "grouponeof?": type.or(RequiredSubSchema, RequiredSubSchema.array()),
});

const RequiredRecursiveSchema = RequiredRecursiveSubSchema.and({
  "group?": type.or(
    RequiredRecursiveSubSchema,
    RequiredRecursiveSubSchema.array()
  ),
});

const AttributeRequiredXMLSchema = type({
  name: type.valueOf(attributeXMLEnum),
  "natural?": "''",
  total: "number",
});
const containsSchema = type.or(
  {
    accessory: StringArrayOrStringSchema,
  },
  {
    specialmodificationlimit: "number",
  },
  {
    armormod: {
      xmltext: "string",
      _sameparent: "'True'",
    },
  },
  {
    attribute: type.or(AttributeRequiredXMLSchema, [
      AttributeRequiredXMLSchema,
    ]),
  },
  { program: "string" },
  { lifestylequality: StringArrayOrStringSchema },
  { characterquality: StringArrayOrStringSchema },
  RequiredRecursiveSchema
);

export type containsType = typeof containsSchema.infer;

const parentDetailsSchema = type({
  "NONE?": "''",
  "OR?": {
    name: type
      .or(
        {
          xmltext: "string",
          _operation: "string",
        },
        "string"
      )
      .array(),
    "NONE?": "''",
  },
  "category?": "string",
  "name?": "string",
  "ammoforweapontype?": "'bow'",
});

export const RequiredXmlSchema = type.or(
  {
    "weapondetails?": RequiredWeaponDetailsXmlSchema,
    "vehicledetails?": RequiredVehicleDetailsXmlSchema,
    "weaponmountdetails?": RequiredWeaponMountDetailsXmlSchema,
    "geardetails?": RequiredGearDetailsXmlSchema,
    "oneof?": containsSchema,
    "allof?": containsSchema,
    "parentdetails?": parentDetailsSchema,
  },
  {
    OR: WeaponAccessoryDetailsOrXmlSchema,
  }
);
export type RequiredXmlType = typeof RequiredXmlSchema.infer;
