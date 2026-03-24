import {
  ammoSourceEnum,
  armourCategoryEnum,
  armourModCategoryEnum,
  augmentationCategoryEnum,
  damageAnnotationEnum,
  damageTypeEnum,
  equipmentTypeEnum,
  projectileWeaponTypeEnum,
  weaponCategoryEnum,
  type EquipmentCategoryType,
  type FixedAttributeType,
  type RequirementOtherSubType,
  type RequirementsType,
  gearRequirementTypeEnum,
  vehicleRequirementTypeEnum,
  weaponRequirementTypeEnum,
  weaponMountRequirementTypeEnum,
  genericRequirementTypeEnum,
  otherRequirementTypeEnum,
  weaponMountVisibilityEnum,
  type NonTopRequirementsType,
  type ParentRequirementsType,
  type ParentGearRequirementType,
  type ParentGenericRequirementType,
  type ParentWeaponRequirementType,
  type ParentWeaponMountRequirementType,
  type ParentVehicleRequirementType,
  augmentationGradeEnum,
  skillTypeEnum,
  type WeaponClassificationType,
} from "@neon-codex/common";
import assert from "assert";
import {
  RequiredWeaponDetailsXmlSubSchema,
  type GearDetailsPropertyUnionXMLType,
  type InnerGearRequiredInnerType,
  type ParentRequiredXMLType,
  type RequiredGearDetailsXmlType,
  type RequiredParentDetailsType,
  type RequiredRecursiveXMLType,
  type RequiredXmlSubType,
  type RequiredVehicleDetailsXmlType,
  type RequiredWeaponDetailsXmlSubSchemaType,
  type RequiredWeaponDetailsXmlType,
  type RequiredWeaponMountDetailsXmlType,
  type RequiredXmlType,
  RequiredWeaponMountDetailsXmlSchema,
  RequiredVehicleDetailsXmlSchema,
  RequiredParentDetailsXmlSchema,
  RequiredXmlSubSchema,
  InnerGearRequiredInnerSchema,
} from "./RequiredParserSchemas.js";
import Requirements from "../../grammar/requirements.ohm-bundle.js";
import { type } from "arktype";
import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { WeaponListXmlSchema } from "../combat/WeaponParserSchemas.js";
import { fileURLToPath } from "url";
import {
  convertAttribute,
  convertGearCategory,
  convertMathComparison,
} from "./ParserHelper.js";
import { convertXmlToWeaponTypeInformation } from "../combat/WeaponParserHelper.js";
import {
  armourXmlCategoryEnum,
  gearXmlCategoryEnum,
  weaponSubtypeEnum,
} from "./ParserCommonDefines.js";
import { convertMetatypeCategory } from "../character/MetatypeParserHelper.js";
import { convertSpellCategory } from "../talent/SpellParserHelper.js";
import { cyberwareXmlCategoryEnum } from "../bodyModification/CyberwareParserSchemas.js";
import { convertCyberwareCategory } from "../bodyModification/CyberwareParserHelper.js";
import { vehicleXmlCategoryEnum } from "../riggerGear/VehicleParserSchemas.js";
import { convertVehicleCategory } from "../riggerGear/VehicleParserHelper.js";
import { convertArmourCategory } from "../combat/ArmourParserHelper.js";
function checkCurrentProp(prop: string, checkedProps: Set<string>) {
  assert(!checkedProps.has(prop), `Property '${prop}' checked twice`);
  return prop;
}

const Essence = Requirements.Essence;

export const convertRequirements = function (
  xmlRequirements: RequiredXmlType
): RequirementsType {
  const allOfEntries: Array<NonTopRequirementsType> = [];

  if ("oneof" in xmlRequirements || "allof" in xmlRequirements) {
    if (xmlRequirements.oneof !== undefined) {
      const requirementInternal = convertRequiredRecursive(
        xmlRequirements.oneof,
        false
      );
      if (Object.keys(xmlRequirements).length === 1) {
        return {
          oneOf: requirementInternal,
        };
      } else {
        allOfEntries.push({
          oneOf: requirementInternal,
        });
      }
    }
    if (xmlRequirements.allof !== undefined) {
      const requirementInternal = convertRequiredRecursive(
        xmlRequirements.allof,
        false
      );
      if (Object.keys(xmlRequirements).length === 1) {
        return {
          allOf: requirementInternal,
        };
      } else {
        allOfEntries.push({ allOf: requirementInternal });
      }
    }
    if (
      xmlRequirements.parentdetails !== undefined ||
      xmlRequirements.geardetails !== undefined ||
      xmlRequirements.vehicledetails !== undefined ||
      xmlRequirements.weapondetails !== undefined ||
      xmlRequirements.weaponmountdetails !== undefined
    ) {
      const parentRequirements = convertParentRequired(xmlRequirements);
      parentRequirements.forEach((req) => {
        allOfEntries.push({ parentDetails: req });
      });
    }

    if (allOfEntries.length === 0) {
      assert(false, "Requirements empty after parsing allOf/oneOf");
    }

    return { allOf: allOfEntries };
  } else {
    const requirementInternal: RequiredRecursiveXMLType = xmlRequirements;
    if (requirementInternal.group !== undefined) {
      assert(Object.keys(requirementInternal.group).length === 1);
    }
    return {
      allOf: convertRequiredRecursive(requirementInternal, false),
    };
  }
};

const convertRequiredRecursive = function (
  required: RequiredRecursiveXMLType,
  parentIsGroup: boolean
): Array<NonTopRequirementsType> {
  const requirements: Array<NonTopRequirementsType> = [];

  if (required.group !== undefined) {
    const requiredGroupList = Array.isArray(required.group)
      ? required.group
      : [required.group];
    const groupReqs = requiredGroupList.map((innerRequired) => {
      return convertRequiredRecursive(innerRequired, true);
    });
    requirements.push({
      allOf: groupReqs.map((req) => {
        return { allOf: req };
      }),
    });
  }
  if (required.grouponeof !== undefined) {
    assert(parentIsGroup);
    const requiredGroupList = Array.isArray(required.grouponeof)
      ? required.grouponeof
      : [required.grouponeof];
    const groupReqs = requiredGroupList.map((innerRequired) => {
      return convertRequiredRecursive(innerRequired, true);
    });
    requirements.push({
      oneOf: groupReqs.map((req) => {
        return { allOf: req };
      }),
    });
  }

  const requirementsNotParent: RequiredXmlSubType = { ...required };
  if ("parentdetails" in requirementsNotParent) {
    delete requirementsNotParent.parentdetails;
  }
  if ("geardetails" in requirementsNotParent) {
    delete requirementsNotParent.geardetails;
  }
  if ("vehicledetails" in requirementsNotParent) {
    delete requirementsNotParent.vehicledetails;
  }
  if ("weapondetails" in requirementsNotParent) {
    delete requirementsNotParent.weapondetails;
  }
  if ("weaponmountdetails" in requirementsNotParent) {
    delete requirementsNotParent.weaponmountdetails;
  }
  if ("group" in requirementsNotParent) {
    delete requirementsNotParent.group;
  }
  if ("grouponeof" in requirementsNotParent) {
    delete requirementsNotParent.grouponeof;
  }

  if (Object.keys(requirementsNotParent).length > 0) {
    const otherDetails: Array<RequirementOtherSubType> =
      convertRequiredOtherDetails(requirementsNotParent);
    otherDetails.forEach((details) => {
      requirements.push({ otherDetails: details });
    });
  }

  if (
    required.parentdetails !== undefined ||
    required.geardetails !== undefined ||
    required.vehicledetails !== undefined ||
    required.weapondetails !== undefined ||
    required.weaponmountdetails !== undefined
  ) {
    const parentDetails = convertParentRequired(required);
    parentDetails.forEach((details) => {
      requirements.push({ parentDetails: details });
    });
  }

  assert(
    requirements.length > 0,
    `No requirements found for ${JSON.stringify(required)}`
  );
  return requirements;
};

const convertRequiredOtherDetails = function (
  requiredSub: RequiredXmlSubType
): Array<RequirementOtherSubType> {
  const checkedProps = new Set<string>();
  const reqs: Array<RequirementOtherSubType> = [];

  const requiredSubParsed = RequiredXmlSubSchema(requiredSub);
  if (requiredSubParsed instanceof type.errors) {
    assert(false, requiredSubParsed.summary);
  }

  if (requiredSub.quality !== undefined) {
    checkedProps.add(checkCurrentProp("quality", checkedProps));
    if (
      typeof requiredSub.quality === "string" ||
      Array.isArray(requiredSub.quality)
    ) {
      const qualityList = Array.isArray(requiredSub.quality)
        ? requiredSub.quality
        : [requiredSub.quality];
      qualityList.forEach((quality) => {
        reqs.push({
          type: otherRequirementTypeEnum.Quality,
          value: { quality: quality },
        });
      });
    } else {
      reqs.push({
        type: otherRequirementTypeEnum.Quality,
        value: {
          quality: requiredSub.quality.xmltext,
          select: requiredSub.quality._extra,
        },
      });
    }
  }
  if (requiredSub.characterquality !== undefined) {
    checkedProps.add(checkCurrentProp("characterquality", checkedProps));
    const characterqualityList = Array.isArray(requiredSub.characterquality)
      ? requiredSub.characterquality
      : [requiredSub.characterquality];
    characterqualityList.forEach((characterquality) => {
      reqs.push({
        type: otherRequirementTypeEnum.Quality,
        value: { quality: characterquality },
      });
    });
  }
  if (requiredSub.martialart !== undefined) {
    checkedProps.add(checkCurrentProp("martialart", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.MartialArt,
      value: requiredSub.martialart,
    });
  }
  if (requiredSub.martialtechnique !== undefined) {
    checkedProps.add(checkCurrentProp("martialtechnique", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.MartialTechnique,
      value: requiredSub.martialtechnique,
    });
  }
  if (requiredSub.bioware !== undefined) {
    checkedProps.add(checkCurrentProp("bioware", checkedProps));
    const biowareList = Array.isArray(requiredSub.bioware)
      ? requiredSub.bioware
      : [requiredSub.bioware];
    biowareList.forEach((bioware) => {
      reqs.push({
        type: otherRequirementTypeEnum.Bioware,
        value: bioware,
      });
    });
  }
  if (requiredSub.cyberware !== undefined) {
    checkedProps.add(checkCurrentProp("cyberware", checkedProps));
    const cyberwareList = Array.isArray(requiredSub.cyberware)
      ? requiredSub.cyberware
      : [requiredSub.cyberware];
    cyberwareList.forEach((cyberware) => {
      reqs.push({
        type: otherRequirementTypeEnum.Cyberware,
        value: { name: cyberware },
      });
    });
  }
  if (requiredSub.cyberwarecontains !== undefined) {
    checkedProps.add(checkCurrentProp("cyberwarecontains", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.Cyberware,
      value: {
        name: requiredSub.cyberwarecontains,
        partialName: true as const,
      },
    });
  }
  if (requiredSub.metatype !== undefined) {
    checkedProps.add(checkCurrentProp("metatype", checkedProps));
    const metatypeList = Array.isArray(requiredSub.metatype)
      ? requiredSub.metatype
      : [requiredSub.metatype];
    metatypeList.forEach((metatype) => {
      reqs.push({
        type: otherRequirementTypeEnum.Metatype,
        value: metatype,
      });
    });
  }
  if (requiredSub.metatypecategory !== undefined) {
    checkedProps.add(checkCurrentProp("metatypecategory", checkedProps));
    const metatypecategoryList = Array.isArray(requiredSub.metatypecategory)
      ? requiredSub.metatypecategory
      : [requiredSub.metatypecategory];
    metatypecategoryList.forEach((metatypecategory) => {
      reqs.push({
        type: otherRequirementTypeEnum.MetatypeCategory,
        value: convertMetatypeCategory(metatypecategory),
      });
    });
  }
  if (requiredSub.gear !== undefined) {
    checkedProps.add(checkCurrentProp("gear", checkedProps));
    const minRating = parseInt(requiredSub.gear._minrating);
    assert(!isNaN(minRating) && minRating !== 0);
    reqs.push({
      type: otherRequirementTypeEnum.Gear,
      value: { name: requiredSub.gear.xmltext, minimumRating: minRating },
    });
  }
  if (requiredSub.skill !== undefined) {
    checkedProps.add(checkCurrentProp("skill", checkedProps));
    const skillList = Array.isArray(requiredSub.skill)
      ? requiredSub.skill
      : [requiredSub.skill];
    skillList.forEach((skill) => {
      if (skill.type !== undefined) {
        assert(skill.type === "Knowledge");
      }
      reqs.push({
        type: otherRequirementTypeEnum.Skill,
        value: {
          name: skill.name,
          value: skill.val,
          ...(skill.spec !== undefined && { specialisation: skill.spec }),
          ...(skill.type !== undefined && { type: skillTypeEnum.Knowledge }),
        },
      });
    });
  }
  if (requiredSub.accessory !== undefined) {
    checkedProps.add(checkCurrentProp("accessory", checkedProps));
    const accessoryList = Array.isArray(requiredSub.accessory)
      ? requiredSub.accessory
      : [requiredSub.accessory];
    accessoryList.forEach((accessory) => {
      reqs.push({
        type: otherRequirementTypeEnum.Accessory,
        value: accessory,
      });
    });
  }
  if (requiredSub.specialmodificationlimit !== undefined) {
    checkedProps.add(
      checkCurrentProp("specialmodificationlimit", checkedProps)
    );
    reqs.push({
      type: otherRequirementTypeEnum.SpecialModificationLimit,
      value: requiredSub.specialmodificationlimit,
    });
  }
  if (requiredSub.armormod !== undefined) {
    checkedProps.add(checkCurrentProp("armormod", checkedProps));
    assert(requiredSub.armormod._sameparent === "True");
    reqs.push({
      type: otherRequirementTypeEnum.ArmourMod,
      value: {
        name: requiredSub.armormod.xmltext,
        sameParent: true,
      },
    });
  }
  if (requiredSub.attribute !== undefined) {
    checkedProps.add(checkCurrentProp("attribute", checkedProps));
    const attributeList = Array.isArray(requiredSub.attribute)
      ? requiredSub.attribute
      : [requiredSub.attribute];
    attributeList.forEach((attribute) => {
      reqs.push({
        type: otherRequirementTypeEnum.Attribute,
        value: {
          name: convertAttribute(attribute.name),
          minimumRating: attribute.total,
          ...(attribute.natural !== undefined && {
            isNaturalMinimumRating: true as const,
          }),
        },
      });
    });
  }
  if (requiredSub.program !== undefined) {
    checkedProps.add(checkCurrentProp("program", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.Program,
      value: requiredSub.program,
    });
  }
  if (requiredSub.lifestyle !== undefined) {
    checkedProps.add(checkCurrentProp("lifestyle", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.Lifestyle,
      value: requiredSub.lifestyle,
    });
  }
  if (requiredSub.lifestylequality !== undefined) {
    checkedProps.add(checkCurrentProp("lifestylequality", checkedProps));
    const lifestyleQualityList = Array.isArray(requiredSub.lifestylequality)
      ? requiredSub.lifestylequality
      : [requiredSub.lifestylequality];
    lifestyleQualityList.forEach((lifestylequality) => {
      reqs.push({
        type: otherRequirementTypeEnum.LifestyleQuality,
        value: lifestylequality,
      });
    });
  }
  if (requiredSub.gameplayoption !== undefined) {
    checkedProps.add(checkCurrentProp("gameplayoption", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.GameplayOption,
      value: requiredSub.gameplayoption,
    });
  }
  if (requiredSub.ess !== undefined) {
    checkedProps.add(checkCurrentProp("ess", checkedProps));
    const essenceList = Array.isArray(requiredSub.ess)
      ? requiredSub.ess
      : [requiredSub.ess];
    essenceList.forEach((essence) => {
      if (typeof essence === "object") {
        const essenceGradeList = essence._grade.split(",").map((s) => s.trim());
        essenceGradeList.forEach((grade) => {
          assert(Object.keys(augmentationGradeEnum).includes(grade), grade);
        });
        reqs.push({
          type: otherRequirementTypeEnum.EssenceLoss,
          value: {
            loss: essence.xmltext,
            lossFromAugmentationGradeList:
              essenceGradeList as augmentationGradeEnum[],
          },
        });
      } else {
        reqs.push({
          type: otherRequirementTypeEnum.EssenceMinimum,
          value: essence,
        });
      }
    });
  }
  if (requiredSub.magenabled !== undefined) {
    checkedProps.add(checkCurrentProp("magenabled", checkedProps));
    assert(requiredSub.magenabled === "");
    reqs.push({
      type: otherRequirementTypeEnum.MagicEnabled,
      value: true,
    });
  }
  if (requiredSub.resenabled !== undefined) {
    checkedProps.add(checkCurrentProp("resenabled", checkedProps));
    assert(requiredSub.resenabled === "");
    reqs.push({
      type: otherRequirementTypeEnum.ResonanceEnabled,
      value: true,
    });
  }
  if (requiredSub.depenabled !== undefined) {
    checkedProps.add(checkCurrentProp("depenabled", checkedProps));
    assert(requiredSub.depenabled === "");
    reqs.push({
      type: otherRequirementTypeEnum.DepthEnabled,
      value: true,
    });
  }
  if (requiredSub.initiategrade !== undefined) {
    checkedProps.add(checkCurrentProp("initiategrade", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.MinimumInitiateGrade,
      value: requiredSub.initiategrade,
    });
  }
  if (requiredSub.submersiongrade !== undefined) {
    checkedProps.add(checkCurrentProp("submersiongrade", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.MinimumSubmersionGrade,
      value: requiredSub.submersiongrade,
    });
  }
  if (requiredSub.tradition !== undefined) {
    checkedProps.add(checkCurrentProp("tradition", checkedProps));
    const traditionList = Array.isArray(requiredSub.tradition)
      ? requiredSub.tradition
      : [requiredSub.tradition];
    traditionList.forEach((tradition) => {
      reqs.push({
        type: otherRequirementTypeEnum.Tradition,
        value: tradition,
      });
    });
  }
  if (requiredSub.metamagic !== undefined) {
    checkedProps.add(checkCurrentProp("metamagic", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.Metamagic,
      value: requiredSub.metamagic,
    });
  }
  if (requiredSub.metamagicart !== undefined) {
    checkedProps.add(checkCurrentProp("metamagicart", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.MetamagicArt,
      value: requiredSub.metamagicart,
    });
  }
  if (requiredSub.art !== undefined) {
    checkedProps.add(checkCurrentProp("art", checkedProps));
    const artList = Array.isArray(requiredSub.art)
      ? requiredSub.art
      : [requiredSub.art];
    artList.forEach((art) => {
      reqs.push({
        type: otherRequirementTypeEnum.MetamagicArt,
        value: art,
      });
    });
  }
  if (requiredSub.spell !== undefined) {
    checkedProps.add(checkCurrentProp("spell", checkedProps));
    const spellList = Array.isArray(requiredSub.spell)
      ? requiredSub.spell
      : [requiredSub.spell];
    spellList.forEach((spell) => {
      reqs.push({
        type: otherRequirementTypeEnum.Spell,
        value: spell,
      });
    });
  }
  if (requiredSub.spellcategory !== undefined) {
    checkedProps.add(checkCurrentProp("spellcategory", checkedProps));
    const spellCategoryList = Array.isArray(requiredSub.spellcategory)
      ? requiredSub.spellcategory
      : [requiredSub.spellcategory];
    spellCategoryList.forEach((spellCategory) => {
      reqs.push({
        type: otherRequirementTypeEnum.SpellCategory,
        value: {
          category: convertSpellCategory(spellCategory.name),
          spellsInCategory: spellCategory.count,
        },
      });
    });
  }
  if (requiredSub.spelldescriptor !== undefined) {
    checkedProps.add(checkCurrentProp("spelldescriptor", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.SpellDescriptor,
      value: requiredSub.spelldescriptor,
    });
  }
  if (requiredSub.power !== undefined) {
    checkedProps.add(checkCurrentProp("power", checkedProps));
    const adeptPowerList = Array.isArray(requiredSub.power)
      ? requiredSub.power
      : [requiredSub.power];
    adeptPowerList.forEach((adeptPower) => {
      reqs.push({
        type: otherRequirementTypeEnum.AdeptPower,
        value: adeptPower,
      });
    });
  }
  if (requiredSub.critterpower !== undefined) {
    checkedProps.add(checkCurrentProp("critterpower", checkedProps));

    reqs.push({
      type: otherRequirementTypeEnum.CritterPower,
      value: requiredSub.critterpower,
    });
  }
  if (requiredSub.traditionspiritform !== undefined) {
    checkedProps.add(checkCurrentProp("traditionspiritform", checkedProps));
    reqs.push({
      type: otherRequirementTypeEnum.TraditionSpiritForm,
      value: requiredSub.traditionspiritform,
    });
  }
  checkProps(requiredSub, checkedProps);

  assert(
    reqs.length > 0,
    `No Requirements found for ${JSON.stringify(requiredSub)}`
  );

  return reqs;
};

const convertParentRequired = function (
  parentOptions: ParentRequiredXMLType
): Array<ParentRequirementsType> {
  const reqs: ParentRequirementsType[] = [];

  if (parentOptions.parentdetails !== undefined) {
    const genericParentDetailList = convertParentGenericDetails(
      parentOptions.parentdetails
    );
    genericParentDetailList.forEach((detail) => {
      reqs.push(detail);
    });
  }
  if (parentOptions.geardetails !== undefined) {
    convertGearDetails(parentOptions.geardetails).forEach((detail) => {
      reqs.push(detail);
    });
  }
  if (parentOptions.vehicledetails !== undefined) {
    convertVehicleDetails(parentOptions.vehicledetails).forEach((detail) => {
      reqs.push(detail);
    });
  }
  if (parentOptions.weapondetails !== undefined) {
    convertWeaponDetails(parentOptions.weapondetails).forEach((detail) => {
      reqs.push(detail);
    });
  }
  if (parentOptions.weaponmountdetails !== undefined) {
    convertWeaponMountDetails(parentOptions.weaponmountdetails).forEach(
      (detail) => {
        reqs.push(detail);
      }
    );
  }

  assert(
    reqs.length > 0,
    `No Requirements found for ${JSON.stringify(parentOptions)}`
  );
  return reqs;
};

const convertParentGenericDetails = function (
  parentDetails: RequiredParentDetailsType
): Array<ParentGenericRequirementType> {
  const checkedProps = new Set<string>();
  assert(Object.keys(parentDetails).length > 0);
  const reqs: Array<ParentGenericRequirementType> = [];

  const parentDetailsParsed = RequiredParentDetailsXmlSchema(parentDetails);
  if (parentDetailsParsed instanceof type.errors) {
    console.log(parentDetailsParsed.summary);
    assert(false, "Parent details parse error");
  }

  if ("OR" in parentDetails) {
    const or = parentDetails.OR;
    or.name.forEach((nameInput) => {
      if (typeof nameInput === "string") {
        reqs.push({
          generic: {
            type: genericRequirementTypeEnum.Name,
            value: { name: nameInput },
          },
        });
      } else {
        assert(nameInput._operation === "contains");
        reqs.push({
          generic: {
            type: genericRequirementTypeEnum.Name,
            value: { name: nameInput.xmltext, partialName: true },
          },
        });
      }
    });

    if (or.NONE !== undefined) {
      reqs.push({
        generic: {
          type: genericRequirementTypeEnum.NoParent as const,
          value: true as const,
        },
      });
    }
    return [{ generic: { oneOf: reqs } }];
  }

  if ("NONE" in parentDetails) {
    return [
      { generic: { type: genericRequirementTypeEnum.NoParent, value: true } },
    ];
  }

  if ("ammoforweapontype" in parentDetails) {
    checkedProps.add(checkCurrentProp("ammoforweapontype", checkedProps));
    assert(parentDetails.ammoforweapontype === "bow");
    return [
      {
        generic: {
          type: genericRequirementTypeEnum.Equipment,
          value: {
            equipmentType: equipmentTypeEnum.Weapon as const,
            category: weaponCategoryEnum.Projectile as const,
            subtype: projectileWeaponTypeEnum.Bows as const,
          },
        },
      },
    ];
  }

  if (parentDetails.name !== undefined) {
    checkedProps.add(checkCurrentProp("name", checkedProps));
    reqs.push({
      generic: {
        type: genericRequirementTypeEnum.Name,
        value: { name: parentDetails.name },
      },
    });
  }

  if (parentDetails.category !== undefined) {
    checkedProps.add(checkCurrentProp("category", checkedProps));
    const categoryName = parentDetails.category;
    const categoryList = convertParentDetails(categoryName);
    categoryList.forEach((category) => {
      reqs.push({
        generic: {
          type: genericRequirementTypeEnum.Equipment,
          value: category,
        },
      });
    });
  }

  checkProps(parentDetails, checkedProps);
  if (reqs.length === 0) {
    return [
      { generic: { type: genericRequirementTypeEnum.NoParent, value: false } },
    ];
  }
  return reqs;
};

const convertParentDetails = function (
  categoryName: string,
  partialName: boolean = false
): Array<EquipmentCategoryType> {
  const categoryList: Array<EquipmentCategoryType> = [];
  // Check Gear

  Object.values(gearXmlCategoryEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as gearXmlCategoryEnum)
    ) {
      categoryList.push({
        equipmentType: equipmentTypeEnum.Gear,
        category: convertGearCategory(categoryName as gearXmlCategoryEnum),
      });
    }
  });
  // Check Weapon Subtype (AmmoCategory / WeaponCategory)

  Object.values(weaponSubtypeEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as weaponSubtypeEnum)
    ) {
      const weaponCategory: WeaponClassificationType =
        convertXmlToWeaponTypeInformation({
          category: categoryName as weaponSubtypeEnum,
        });
      categoryList.push({
        equipmentType: equipmentTypeEnum.Weapon as const,
        ...weaponCategory,
      });
    }
  });
  // Check Vehicle Category
  Object.values(vehicleXmlCategoryEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as vehicleXmlCategoryEnum)
    ) {
      categoryList.push({
        equipmentType: equipmentTypeEnum.Vehicle,
        ...convertVehicleCategory(category),
      });
    }
  });

  // Armour
  Object.values(armourCategoryEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as armourCategoryEnum)
    ) {
      categoryList.push({
        equipmentType: equipmentTypeEnum.Armour,
        category: categoryName as armourCategoryEnum,
      });
    }
  });

  // ArmourMod
  Object.values(armourModCategoryEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as armourModCategoryEnum)
    ) {
      categoryList.push({
        equipmentType: equipmentTypeEnum.ArmourMod,
        category: categoryName as armourModCategoryEnum,
      });
    }
  });

  Object.values(cyberwareXmlCategoryEnum).forEach((category) => {
    if (
      (partialName && category.includes(categoryName)) ||
      category === (categoryName as cyberwareXmlCategoryEnum)
    ) {
      categoryList.push({
        equipmentType: equipmentTypeEnum.Augmentation,
        category: augmentationCategoryEnum.Cyberware,
        subtype: convertCyberwareCategory(
          categoryName as cyberwareXmlCategoryEnum
        ),
      });
    }
  });

  if (partialName) {
    assert(categoryList.length > 0, `No categories found: ${categoryName}`);
    assert(categoryList.length > 1, `Only 1 category found: ${categoryName}`);
  } else {
    assert(categoryList.length !== 0, `Unfound category name: ${categoryName}`);
    assert(
      categoryList.length === 1,
      `Multiple categories found: ${categoryName}`
    );
  }
  return categoryList;
};

const convertGearDetails = function (
  gearDetails: RequiredGearDetailsXmlType
): Array<ParentGearRequirementType> {
  assert(Object.keys(gearDetails).length > 0);
  if ("AND" in gearDetails || "OR" in gearDetails) {
    if ("AND" in gearDetails) {
      assert(!("OR" in gearDetails), JSON.stringify(gearDetails));
      return [
        {
          gear: {
            allOf: convertGearDetails(gearDetails.AND),
          },
        },
      ];
    } else {
      assert(!("AND" in gearDetails), JSON.stringify(gearDetails));
      assert("OR" in gearDetails, JSON.stringify(gearDetails));
      return [
        {
          gear: {
            oneOf: convertGearSubDetails(gearDetails.OR),
          },
        },
      ];
    }
  } else {
    return [{ gear: { allOf: convertGearSubDetails(gearDetails) } }];
  }
};

const convertGearSubDetails = function (
  gearDetails: InnerGearRequiredInnerType
): Array<ParentGearRequirementType> {
  const checkedProps = new Set<string>();
  const reqs: Array<ParentGearRequirementType> = [];

  const gearDetailsParsed = InnerGearRequiredInnerSchema(gearDetails);
  if (gearDetailsParsed instanceof type.errors) {
    console.log(gearDetailsParsed.summary);
    assert(false, `Gear details parse error: ${JSON.stringify(gearDetails)}`);
  }

  if ("NONE" in gearDetails) {
    checkedProps.add(checkCurrentProp("NONE", checkedProps));
    reqs.push({
      gear: { type: genericRequirementTypeEnum.NoParent, value: true },
    });
  }

  // Name
  if (gearDetails.name !== undefined) {
    checkedProps.add(checkCurrentProp("name", checkedProps));
    const nameList = Array.isArray(gearDetails.name)
      ? gearDetails.name
      : [gearDetails.name];
    nameList.forEach((name) => {
      if (typeof name === "string") {
        reqs.push({
          gear: {
            type: genericRequirementTypeEnum.Name,
            value: { name: name },
          },
        });
      } else {
        reqs.push({
          gear: {
            type: genericRequirementTypeEnum.Name,
            value: { name: name.xmltext, partialName: true },
          },
        });
      }
    });
  }

  // Category
  if (gearDetails.category !== undefined) {
    checkedProps.add(checkCurrentProp("category", checkedProps));
    const categoryList = Array.isArray(gearDetails.category)
      ? gearDetails.category
      : [gearDetails.category];
    categoryList.forEach((category) => {
      if (
        Object.values(gearXmlCategoryEnum).includes(
          category as gearXmlCategoryEnum
        )
      ) {
        const categoryEnum = convertGearCategory(
          category as gearXmlCategoryEnum
        );
        reqs.push({
          gear: {
            type: genericRequirementTypeEnum.Equipment,
            value: {
              equipmentType: equipmentTypeEnum.Gear,
              category: categoryEnum,
            },
          },
        });
      } else if (
        Object.values(armourXmlCategoryEnum).includes(
          category as armourXmlCategoryEnum
        )
      ) {
        const categoryEnum = convertArmourCategory(
          category as armourXmlCategoryEnum
        );
        reqs.push({
          gear: {
            type: genericRequirementTypeEnum.Equipment,
            value: {
              equipmentType: equipmentTypeEnum.Armour,
              category: categoryEnum,
            },
          },
        });
      } else {
        assert(false, category);
      }
    });
  }

  if (gearDetails.attributearray !== undefined) {
    checkedProps.add(checkCurrentProp("attributearray", checkedProps));
    if (gearDetails.attributearray._NOT !== undefined) {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.AttributeArray,
          exists: false,
        },
      });
    } else {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.AttributeArray,
          exists: true,
        },
      });
    }
  }

  if (gearDetails.attack !== undefined) {
    checkedProps.add(checkCurrentProp("attack", checkedProps));
    const attackList = convertGearDetailsProperty(gearDetails.attack);
    attackList.forEach((attack) => {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.Attack,
          value: attack,
        },
      });
    });
  }
  if (gearDetails.sleaze !== undefined) {
    checkedProps.add(checkCurrentProp("sleaze", checkedProps));
    const sleazeList = convertGearDetailsProperty(gearDetails.sleaze);
    sleazeList.forEach((sleaze) => {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.Sleaze,
          value: sleaze,
        },
      });
    });
  }
  if (gearDetails.dataprocessing !== undefined) {
    checkedProps.add(checkCurrentProp("dataprocessing", checkedProps));
    const dataprocessingList = convertGearDetailsProperty(
      gearDetails.dataprocessing
    );
    dataprocessingList.forEach((dataprocessing) => {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.DataProcessing,
          value: dataprocessing,
        },
      });
    });
  }
  if (gearDetails.firewall !== undefined) {
    checkedProps.add(checkCurrentProp("firewall", checkedProps));
    const firewallList = convertGearDetailsProperty(gearDetails.firewall);
    firewallList.forEach((firewall) => {
      reqs.push({
        gear: {
          type: gearRequirementTypeEnum.Firewall,
          value: firewall,
        },
      });
    });
  }

  // Recursive
  if (gearDetails.AND !== undefined) {
    checkedProps.add(checkCurrentProp("AND", checkedProps));
    reqs.push({ gear: { allOf: convertGearSubDetails(gearDetails.AND) } });
  }
  if (gearDetails.OR !== undefined) {
    checkedProps.add(checkCurrentProp("OR", checkedProps));
    reqs.push({
      gear: { oneOf: convertGearSubDetails(gearDetails.OR) },
    });
  }

  checkProps(gearDetails, checkedProps);
  assert(
    reqs.length > 0,
    `No requirements found: ${JSON.stringify(gearDetails)}`
  );
  return reqs;
};

const convertGearDetailsProperty = function (
  gearDetail: GearDetailsPropertyUnionXMLType
): Array<FixedAttributeType> {
  const gearDetailList = Array.isArray(gearDetail) ? gearDetail : [gearDetail];
  return gearDetailList.map((gear) => {
    if (typeof gear === "number") {
      return { noAttribute: true };
    }
    if (gear._operation === "exists") {
      assert(gear._NOT === "");
      return {
        noAttribute: true,
      };
    }
    assert(gear.xmltext === 0 && gear._operation === "greaterthan");
    return {
      nonZeroAttribute: true,
    };
  });
};

const convertVehicleDetails = function (
  vehicleDetails: RequiredVehicleDetailsXmlType
): Array<ParentVehicleRequirementType> {
  const checkedProps = new Set<string>();
  const reqs: Array<ParentVehicleRequirementType> = [];

  const vehicleDetailsParsed = RequiredVehicleDetailsXmlSchema(vehicleDetails);
  if (vehicleDetailsParsed instanceof type.errors) {
    console.log(vehicleDetailsParsed.summary);
    assert(false, "Vehicle details parse error");
  }

  if ("AND" in vehicleDetails || "OR" in vehicleDetails) {
    if ("AND" in vehicleDetails) {
      assert(!("OR" in vehicleDetails));
      const andList = Array.isArray(vehicleDetails.AND)
        ? vehicleDetails.AND
        : [vehicleDetails.AND];
      andList.forEach((detail) => {
        reqs.push({ vehicle: { allOf: convertVehicleDetails(detail) } });
      });
    }
    if ("OR" in vehicleDetails) {
      assert(!("AND" in vehicleDetails));
      const orList = Array.isArray(vehicleDetails.OR)
        ? vehicleDetails.OR
        : [vehicleDetails.OR];
      orList.forEach((detail) => {
        reqs.push({ vehicle: { oneOf: convertVehicleDetails(detail) } });
      });
    }
    assert(
      reqs.length > 0,
      `No requirements found: ${JSON.stringify(vehicleDetails)}`
    );
    return reqs;
  }

  if ("name" in vehicleDetails) {
    checkedProps.add(checkCurrentProp("name", checkedProps));
    const nameList = Array.isArray(vehicleDetails.name)
      ? vehicleDetails.name
      : [vehicleDetails.name];
    nameList.forEach((name) => {
      if (typeof name === "string") {
        reqs.push({
          vehicle: {
            type: genericRequirementTypeEnum.Name,
            value: { name: name },
          },
        });
      } else {
        assert(name._operation === "contains");
        reqs.push({
          vehicle: {
            type: genericRequirementTypeEnum.Name,
            value: { name: name.xmltext, partialName: true },
          },
        });
      }
    });
    assert(
      reqs.length > 0,
      `No requirements found: ${JSON.stringify(vehicleDetails)}`
    );
    return reqs;
  }
  assert(
    "body" in vehicleDetails ||
      "seats" in vehicleDetails ||
      "category" in vehicleDetails
  );
  if (vehicleDetails.body !== undefined) {
    checkedProps.add(checkCurrentProp("body", checkedProps));
    const bodyList = Array.isArray(vehicleDetails.body)
      ? vehicleDetails.body
      : [vehicleDetails.body];
    bodyList.forEach((body) => {
      const bodyValue = body.xmltext;
      assert(typeof bodyValue !== "string", `bodyValue is ${bodyValue}`);
      reqs.push({
        vehicle: {
          type: vehicleRequirementTypeEnum.Body,
          value: {
            value: bodyValue,
            comparison: convertMathComparison(body._operation),
          },
        },
      });
    });
  }
  if (vehicleDetails.seats !== undefined) {
    checkedProps.add(checkCurrentProp("seats", checkedProps));
    const seatsList = Array.isArray(vehicleDetails.seats)
      ? vehicleDetails.seats
      : [vehicleDetails.seats];
    seatsList.forEach((seats) => {
      const seatValue = seats.xmltext;
      assert(typeof seatValue !== "string", `seatValue is ${seatValue}`);
      reqs.push({
        vehicle: {
          type: vehicleRequirementTypeEnum.Seats,
          value: {
            value: seatValue,
            comparison: convertMathComparison(seats._operation),
          },
        },
      });
    });
  }
  if (vehicleDetails.category !== undefined) {
    checkedProps.add(checkCurrentProp("category", checkedProps));
    const categoryList = Array.isArray(vehicleDetails.category)
      ? vehicleDetails.category
      : [vehicleDetails.category];
    categoryList.forEach((category) => {
      if (typeof category === "string") {
        const categoryDetailList = convertParentDetails(category);
        categoryDetailList.forEach((detail) => {
          reqs.push({
            vehicle: {
              type: genericRequirementTypeEnum.Equipment,
              value: detail,
            },
          });
        });
      } else {
        const categoryDetailList = convertParentDetails(category.xmltext, true);
        categoryDetailList.forEach((detail) => {
          reqs.push({
            vehicle: {
              type: genericRequirementTypeEnum.Equipment,
              value: detail,
            },
          });
        });
      }
    });
  }

  checkProps(vehicleDetails, checkedProps);
  assert(
    reqs.length > 0,
    `No Requirements found for ${JSON.stringify(vehicleDetails)}`
  );
  return reqs;
};

const convertWeaponDetails = function (
  weaponDetails: RequiredWeaponDetailsXmlType
): Array<ParentWeaponRequirementType> {
  assert(!("NOT" in weaponDetails));
  const weaponRequirements: Array<ParentWeaponRequirementType> = [];

  if (
    !(
      ("OR" in weaponDetails && weaponDetails.OR !== undefined) ||
      ("AND" in weaponDetails && weaponDetails.AND !== undefined)
    )
  ) {
    const weaponDetailsInner = RequiredWeaponDetailsXmlSubSchema(weaponDetails);
    if (weaponDetailsInner instanceof type.errors) {
      console.log(weaponDetailsInner.summary);
      assert(false);
    }
    const weaponInnerList = convertWeaponDetailsInner(weaponDetailsInner);
    weaponInnerList.forEach((weaponDetailsInner) => {
      weaponRequirements.push(weaponDetailsInner);
    });
  } else if ("OR" in weaponDetails && weaponDetails.OR !== undefined) {
    assert(typeof weaponDetails.AND === "undefined");
    const detailsOr = Array.isArray(weaponDetails.OR)
      ? weaponDetails.OR
      : [weaponDetails.OR];
    detailsOr.forEach((detail) => {
      weaponRequirements.push({
        weapon: {
          oneOf: convertWeaponDetails(detail),
        },
      });
    });
  } else if ("AND" in weaponDetails && weaponDetails.AND !== undefined) {
    assert(typeof weaponDetails.OR === "undefined");
    const detailsAnd = Array.isArray(weaponDetails.AND)
      ? weaponDetails.AND
      : [weaponDetails.AND];
    detailsAnd.forEach((detail) => {
      weaponRequirements.push({
        weapon: {
          allOf: convertWeaponDetails(detail),
        },
      });
    });
  } else {
    assert(false);
  }
  assert(weaponRequirements.length > 0);
  return weaponRequirements;
};

const convertWeaponDetailsInner = function (
  weaponDetails: RequiredWeaponDetailsXmlSubSchemaType
): Array<ParentWeaponRequirementType> {
  const checkedProps = new Set<string>();
  const reqs: Array<ParentWeaponRequirementType> = [];
  const weaponDetailsParsed = RequiredWeaponDetailsXmlSubSchema(weaponDetails);
  if (weaponDetailsParsed instanceof type.errors) {
    console.log(weaponDetailsParsed.summary);
    assert(false, "Weapon details parse error");
  }

  const weaponId = "id" in weaponDetails ? weaponDetails.id : undefined;
  const weaponName = "name" in weaponDetails ? weaponDetails.name : undefined;

  // Name Resolution
  if (weaponId !== undefined) {
    checkedProps.add(checkCurrentProp("id", checkedProps));
    const currentPath = import.meta.url;
    const xml_string = fs.readFileSync(
      fileURLToPath(path.dirname(currentPath) + "../../../../xmls/weapons.xml"),
      "utf8"
    );
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      textNodeName: "xmltext",
    });
    const jObj: any = parser.parse(xml_string);
    const weaponListParsed = WeaponListXmlSchema(jObj.chummer.weapons.weapon);
    if (weaponListParsed instanceof type.errors) {
      assert(false, "Weapon list parse error");
    }
    const weaponMatchedList = weaponListParsed.filter((fullWeapon) => {
      return weaponId === fullWeapon.id;
    });
    assert(weaponMatchedList.length === 1, JSON.stringify(weaponMatchedList));
    assert(
      weaponListParsed.filter((fullWeapon) => {
        return weaponMatchedList[0].name === fullWeapon.name;
      }).length === 1,
      `Weapon Name: ${weaponMatchedList[0].name} has multiple matches`
    );
    reqs.push({
      weapon: {
        type: genericRequirementTypeEnum.Name,
        value: { name: weaponMatchedList[0].name },
      },
    });
  } else if (weaponName !== undefined) {
    checkedProps.add(checkCurrentProp("name", checkedProps));
    const weaponNameArray = Array.isArray(weaponName)
      ? weaponName
      : [weaponName];
    const nameReqs = weaponNameArray.map(
      (weapon): ParentWeaponRequirementType => {
        if (typeof weapon === "object") {
          assert(
            weapon._operation === "contains",
            `Weapon operation ${weapon._operation} not supported`
          );
          return {
            weapon: {
              type: genericRequirementTypeEnum.Name,
              value: { name: weapon.xmltext, partialName: true },
            },
          };
        } else {
          return {
            weapon: {
              type: genericRequirementTypeEnum.Name,
              value: { name: weapon },
            },
          };
        }
      }
    );
    if (nameReqs.length === 1) reqs.push(nameReqs[0]);
    else {
      nameReqs.forEach((name) => {
        reqs.push(name);
      });
    }
  }

  // Ammo
  if ("ammo" in weaponDetails) {
    checkedProps.add(checkCurrentProp("ammo", checkedProps));
    const ammoArray = Array.isArray(weaponDetails.ammo)
      ? weaponDetails.ammo
      : [weaponDetails.ammo];
    const ammoReqs = ammoArray.map((ammo): ParentWeaponRequirementType => {
      let val = ammoSourceEnum.Clip;
      assert(ammo._operation === "contains");
      switch (ammo.xmltext) {
        case "(b)":
          val = ammoSourceEnum.BreakAction;
          break;
        case "(c)":
          val = ammoSourceEnum.Clip;
          break;
        case "(d)":
          val = ammoSourceEnum.Drum;
          break;
        case "(ml)":
          val = ammoSourceEnum.MuzzleLoader;
          break;
        case "(m)":
          val = ammoSourceEnum.InternalMagazine;
          break;
        case "(cy)":
          val = ammoSourceEnum.Cylinder;
          break;
        case "(belt)":
          val = ammoSourceEnum.BeltFed;
          break;
        case "(tank)":
          val = ammoSourceEnum.Tank;
          break;
        case "(cb)":
          val = ammoSourceEnum.CapAndBall;
          break;
        case "Energy":
          val = ammoSourceEnum.Energy;
          break;
        case "External Source":
          val = ammoSourceEnum.External;
          break;
        default:
          assert(false, `Unknown ammo type: ${ammo.xmltext}`);
      }
      return {
        weapon: { type: weaponRequirementTypeEnum.AmmoType, value: val },
      };
    });
    if (ammoReqs.length === 1) {
      reqs.push(ammoReqs[0]);
    } else {
      ammoReqs.forEach((ammo) => {
        reqs.push(ammo);
      });
    }
  }

  if ("ammocategory" in weaponDetails) {
    checkedProps.add(checkCurrentProp("ammocategory", checkedProps));
    const ammoCategoryArray = Array.isArray(weaponDetails.ammocategory)
      ? weaponDetails.ammocategory
      : [weaponDetails.ammocategory];
    ammoCategoryArray.forEach((ammoCategory) => {
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.AmmoCategory,
          value: convertXmlToWeaponTypeInformation({ category: ammoCategory }),
        },
      });
    });
  }

  if ("type" in weaponDetails) {
    checkedProps.add(checkCurrentProp("type", checkedProps));
    if (weaponDetails.type === "Melee") {
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.Category,
          value: weaponCategoryEnum.Melee,
        },
      });
    } else if (weaponDetails.type === "Ranged") {
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.Category,
          value: weaponCategoryEnum.Firearm,
        },
      });
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.Category,
          value: weaponCategoryEnum.Projectile,
        },
      });
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.Category,
          value: weaponCategoryEnum.Explosive,
        },
      });
    }
  }

  if ("category" in weaponDetails) {
    checkedProps.add(checkCurrentProp("category", checkedProps));
    const categoryArray = Array.isArray(weaponDetails.category)
      ? weaponDetails.category
      : [weaponDetails.category];
    const categoryLocalList: Array<weaponSubtypeEnum> = [];
    categoryArray.forEach((category) => {
      if (typeof category === "object") {
        assert(category._operation === "contains");
        Object.values(weaponSubtypeEnum).forEach((subtype) => {
          if (
            subtype.includes(category.xmltext) &&
            subtype !== weaponSubtypeEnum.Rifles &&
            subtype !== weaponSubtypeEnum.Pistol
          ) {
            categoryLocalList.push(subtype);
            convertWeaponCategoryRequirement(subtype);
          }
        });
      } else {
        convertWeaponCategoryRequirement(category);
      }
    });
    for (let i = 0; i < categoryLocalList.length; i++) {
      for (let j = i + 1; j < categoryLocalList.length; j++) {
        assert(
          categoryLocalList[i] !== categoryLocalList[j],
          `Category "${categoryLocalList[i]}" is duplicated`
        );
      }
    }
    // eslint-disable-next-line no-inner-declarations
    function convertWeaponCategoryRequirement(value: weaponSubtypeEnum) {
      if (
        value === weaponSubtypeEnum.UnderbarrelWeapons ||
        value === weaponSubtypeEnum.Cyberweapon
      ) {
        reqs.push({
          weapon: {
            type: weaponRequirementTypeEnum.Subtype,
            value: convertXmlToWeaponTypeInformation({
              category: value,
              type: "Melee",
            }),
          },
        });
        reqs.push({
          weapon: {
            type: weaponRequirementTypeEnum.Subtype,
            value: convertXmlToWeaponTypeInformation({
              category: value,
              type: "Ranged",
            }),
          },
        });
      } else {
        reqs.push({
          weapon: {
            type: weaponRequirementTypeEnum.Subtype,
            value: convertXmlToWeaponTypeInformation({ category: value }),
          },
        });
      }
    }
  }

  // Useskill
  if ("useskill" in weaponDetails && weaponDetails.useskill) {
    checkedProps.add(checkCurrentProp("useskill", checkedProps));
    const skillArray = Array.isArray(weaponDetails.useskill)
      ? weaponDetails.useskill
      : [weaponDetails.useskill];
    const skillReqs = skillArray.map((skill): ParentWeaponRequirementType => {
      if (typeof skill !== "string")
        return {
          weapon: {
            type: weaponRequirementTypeEnum.Skill,
            // TODO: fix this and the representation
            value: { skill: "Unknown" },
          },
        };
      return {
        weapon: {
          type: weaponRequirementTypeEnum.Skill,
          value: { skill: skill },
        },
      };
    });
    if (skillReqs.length === 1) reqs.push(skillReqs[0]);
    else {
      skillReqs.forEach((skill) => {
        reqs.push(skill);
      });
    }
  }

  const specList: string[] = [];
  // Spec / Spec2
  if ("spec" in weaponDetails) {
    checkedProps.add(checkCurrentProp("spec", checkedProps));
    const specArray = Array.isArray(weaponDetails.spec)
      ? weaponDetails.spec
      : [weaponDetails.spec];
    specArray.forEach((spec) => {
      specList.push(spec);
    });
  }
  if ("spec2" in weaponDetails) {
    checkedProps.add(checkCurrentProp("spec2", checkedProps));
    const specArray = Array.isArray(weaponDetails.spec2)
      ? weaponDetails.spec2
      : [weaponDetails.spec2];
    specArray.forEach((spec) => {
      assert(
        specList.find((s) => s === spec) !== undefined,
        `Spec2 ${spec} not found in spec list`
      );
    });
  }
  if (weaponDetails.conceal !== undefined) {
    checkedProps.add(checkCurrentProp("conceal", checkedProps));
    reqs.push({
      weapon: {
        type: weaponRequirementTypeEnum.Conceal,
        value: {
          value: weaponDetails.conceal.xmltext,
          comparison: convertMathComparison(weaponDetails.conceal._operation),
        },
      },
    });
  }
  if (weaponDetails.accessorymounts !== undefined) {
    checkedProps.add(checkCurrentProp("accessorymounts", checkedProps));
    const mountList = Array.isArray(weaponDetails.accessorymounts)
      ? weaponDetails.accessorymounts
      : [weaponDetails.accessorymounts];
    mountList.forEach((mount) => {
      reqs.push({
        weapon: {
          type: weaponRequirementTypeEnum.AccessoryMount,
          value: mount,
        },
      });
    });
  }
  if (weaponDetails.damage !== undefined) {
    checkedProps.add(checkCurrentProp("damage", checkedProps));
    // console.log(weaponDetails.damage);
    assert(weaponDetails.damage._operation === "contains");
    const damage = weaponDetails.damage.xmltext;
    let type: damageTypeEnum | undefined = undefined;
    let annotation: damageAnnotationEnum | undefined = undefined;
    if (damage.toLowerCase().includes("(fire)")) {
      annotation = damageAnnotationEnum.Fire;
    }
    if (damage.toLowerCase().includes("(f)")) {
      assert(annotation === undefined, "Multiple damage annotations found");
      annotation = damageAnnotationEnum.Flechette;
    }
    if (damage.toLowerCase().includes("(e)")) {
      assert(annotation === undefined, "Multiple damage annotations found");
      annotation = damageAnnotationEnum.Electrical;
    }
    if (damage.includes("P")) {
      type = damageTypeEnum.Physical;
    }
    if (damage.includes("S")) {
      assert(type === undefined, "Multiple damage types found");
      type = damageTypeEnum.Stun;
    }
    assert(type !== undefined, "No damage type found");
    assert(annotation !== undefined, "No damage annotation found");
    reqs.push({
      weapon: {
        type: weaponRequirementTypeEnum.Damage,
        value: {
          type: type,
          annotation: annotation,
        },
      },
    });
  }

  if ("_NOT" in weaponDetails) {
    checkedProps.add(checkCurrentProp("_NOT", checkedProps));
    reqs.push({
      weapon: {
        type: genericRequirementTypeEnum.NoParent,
        value: true,
      },
    });
  }

  checkProps(weaponDetails, checkedProps);
  assert(
    reqs.length > 0,
    `No requirements found for ${JSON.stringify(weaponDetails)}`
  );
  return reqs;
};

const convertWeaponMountDetails = function (
  mountDetails: RequiredWeaponMountDetailsXmlType
): Array<ParentWeaponMountRequirementType> {
  const checkedProps = new Set<string>();
  const reqs = [];

  const weaponMountDetailsParsed =
    RequiredWeaponMountDetailsXmlSchema(mountDetails);
  if (weaponMountDetailsParsed instanceof type.errors) {
    console.log(weaponMountDetailsParsed.summary);
    assert(false, "Weapon mount details parse error");
  }

  checkProps(mountDetails, checkedProps);
  assert(
    reqs.length > 0,
    `No requirements found for ${JSON.stringify(mountDetails)}`
  );
  return [
    {
      weaponMount: {
        type: weaponMountRequirementTypeEnum.Visibility,
        value: weaponMountVisibilityEnum.External,
      },
    },
  ];
};
function checkProps(requiredSub: Object, checkedProps: Set<string>) {
  // Check to ensure no props were missed
  const handledProps = Array.from(checkedProps);
  const inputProps = Object.keys(requiredSub).filter((k) => k !== "xmltext"); // ignore xmltext if needed
  const missedProps = inputProps.filter((prop) => !handledProps.includes(prop));
  assert(
    missedProps.length === 0,
    `Unhandled requirement properties: ${missedProps.join(", ")}`
  );
}
