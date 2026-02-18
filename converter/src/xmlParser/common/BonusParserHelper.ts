import {
  attributeTypeEnum,
  augmentationGradeEnum,
  augmentationCategoryEnum,
  bonusConditionEnum,
  bonusCostModifierTypeEnum,
  bonusSkillModifierTypeEnum,
  critterAttributePowerEnum,
  damageTypeEnum,
  focusTypeEnum,
  freeSpellRateEnum,
  limitCategoryEnum,
  listTypeEnum,
  magicalFormulaeCategoryEnum,
  skillCategoryEnum,
  skillTypeEnum,
  specialAttributeTypeEnum,
  spellCategoryEnum,
  spellPowerRangeEnum,
  vehicleCategoryEnum,
  weaponCategoryEnum,
} from "@neon-codex/common";
import type {
  BonusType,
  BonusGenericListType,
  BonusSelectionType,
  BonusSelectionOptionModifierType,
  SpecificAttributeBonusType,
  WeaponAccuracySkillListSkillSelectionType,
  BonusAttributeOptionType,
  BonusSkillOptionType,
  BonusPowerOptionType,
  BonusSpellAndMagicOptionType,
  BonusCombatAndWeaponOptionType,
  BonusConditionAndRecoveryOptionType,
  BonusMovementAndLifestyleOptionType,
  BonusTestAndResistanceOptionType,
  BonusInitiativeOptionType,
  BonusGearAndVehicleOptionType,
  BonusEssenceAndAugmentationType,
  BonusContactAndReputationType,
  BonusQualityType,
  BonusSpecificQualityType,
  BonusMiscellaneousOptionType,
  RatingCalculationType,
  MovementReplacementType,
} from "@neon-codex/common";
import assert from "assert";
import type {
  GenericNameValueListType,
  GenericNameValueType,
  NumberOrAnyRatingType,
  NumberOrRatingOrAttributeType,
  SkillImprovementXMLListType,
  SkillImprovementXMLType,
  SpellPowerXmlRangeType,
  StringOrNumberType,
} from "./ParserCommonDefines.js";
import {
  attributeXMLEnum,
  EnglishTranslationsXMLSchema,
  lockedAttributeXmlEnum,
} from "./ParserCommonDefines.js";
import Bonus from "../../grammar/bonus.ohm-bundle.js";
import {
  NumberFixedRatingSemantics,
  bonusRatingCalculationSemantics,
  bonusSkillKarmaCostSemantics,
  bonusWeaponDetailsSemantics,
} from "./ParserSemanticsHelper.js";
import {
  convertAttribute,
  convertAugmentationGrade,
  convertLimbSlot,
  convertNaturalWeapon,
  convertSpellPowerRange,
} from "./ParserHelper.js";
import type {
  BonusXmlType,
  MovementReplacementXmlType,
  SelectSkillXMLType,
  SpecificPowerXMLType,
  WeaponSkillAccuracyXMLType,
} from "./BonusParserSchemas.js";

import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
import { essenceCostSemantics } from "../bodyModification/augmentationParserHelper.js";
import { type } from "arktype";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import { SpellListXmlSchema } from "../talent/SpellParserSchemas.js";
import {
  convertSpellCategory,
  convertSpellDescriptors,
} from "../talent/SpellParserHelper.js";
import { QualityListXmlSchema } from "../character/QualityParserSchemas.js";
import { convertCyberwareCategory } from "../bodyModification/CyberwareParserHelper.js";
import type { cyberwareXmlCategoryEnum } from "../bodyModification/CyberwareParserSchemas.js";
const NumberFixedRating = Bonus.NumberFixedRating;
const SkillKarmaCost = Bonus.SkillKarmaCost;
const WeaponDetails = Bonus.WeaponDetails;
const RatingCalculation = Bonus.RatingCalculation;
const EssenceCost = Augmentation.EssenceCost;

export function convertXmlBonus(bonus: BonusXmlType) {
  if (typeof bonus == "string") {
    assert(bonus === "");
    return undefined;
  }
  const checkedProps = new Set<string>();

  function checkProp(prop: string) {
    assert(!checkedProps.has(prop), `Property '${prop}' checked twice`);
    checkedProps.add(prop);
  }
  const attributeOption: BonusAttributeOptionType = {};
  const skillOption: BonusSkillOptionType = {};
  const powerOption: BonusPowerOptionType = {};
  const spellAndMagicOption: BonusSpellAndMagicOptionType = {};
  const combatAndWeaponOption: BonusCombatAndWeaponOptionType = {};
  const conditionAndRecoveryOption: BonusConditionAndRecoveryOptionType = {};
  const movementAndLifestyleOption: BonusMovementAndLifestyleOptionType = {};
  const testAndResistanceOption: BonusTestAndResistanceOptionType = {};
  const initiativeOption: BonusInitiativeOptionType = {};
  const gearAndVehicleOption: BonusGearAndVehicleOptionType = {};
  const essenceAndAugmentationOption: BonusEssenceAndAugmentationType = {};
  const contactAndReputationOption: BonusContactAndReputationType = {};
  const qualityOption: BonusQualityType = {};
  const specificQualityOption: BonusSpecificQualityType = {};
  const miscellaneousOption: BonusMiscellaneousOptionType = {};

  // Attribute Bonuses and Modifiers
  // --------------------------------------------------------------------------------------------
  if ("attribute" in bonus && bonus.attribute !== undefined) {
    checkProp("attribute");
    const attributeList = Array.isArray(bonus.attribute)
      ? bonus.attribute
      : [bonus.attribute];
    const convertedAttributeList = attributeList.map((attribute) => {
      return convertSpecificAttribute(attribute);
    });
    if (attributeOption.linkAttributeList === undefined) {
      attributeOption.linkAttributeList = convertedAttributeList;
    } else {
      attributeOption.linkAttributeList =
        attributeOption.linkAttributeList.concat(convertedAttributeList);
    }
  }
  if ("specificattribute" in bonus && bonus.specificattribute !== undefined) {
    checkProp("specificattribute");
    const attributeList = Array.isArray(bonus.specificattribute)
      ? bonus.specificattribute
      : [bonus.specificattribute];
    const convertedAttributeList = attributeList.map((attribute) => {
      return convertSpecificAttribute(attribute);
    });
    if (attributeOption.linkAttributeList === undefined) {
      attributeOption.linkAttributeList = convertedAttributeList;
    } else {
      attributeOption.linkAttributeList =
        attributeOption.linkAttributeList.concat(convertedAttributeList);
    }
  }
  if ("selectattributes" in bonus && bonus.selectattributes !== undefined) {
    checkProp("selectattributes");
    const selectAttribute = Array.isArray(
      bonus.selectattributes.selectattribute
    )
      ? bonus.selectattributes.selectattribute
      : [bonus.selectattributes.selectattribute];
    const elementList = selectAttribute.map((selectAttribute) => {
      return convertSelectAttribute(selectAttribute);
    });

    if (attributeOption.linkAttributeList === undefined) {
      attributeOption.linkAttributeList = elementList;
    } else {
      attributeOption.linkAttributeList =
        attributeOption.linkAttributeList.concat(elementList);
    }
  }
  if ("selectattribute" in bonus && bonus.selectattribute !== undefined) {
    checkProp("selectattribute");
    const selectAttribute = bonus.selectattribute;
    const element = convertSelectAttribute(selectAttribute);

    if (attributeOption.linkAttributeList === undefined) {
      attributeOption.linkAttributeList = [element];
    } else {
      attributeOption.linkAttributeList.push(element);
    }
  }
  if ("enableattribute" in bonus && bonus.enableattribute !== undefined) {
    checkProp("enableattribute");
    const attribute = bonus.enableattribute;
    let override;
    if (
      attribute.min !== undefined ||
      attribute.max !== undefined ||
      attribute.aug !== undefined ||
      attribute.val !== undefined
    ) {
      assert(attribute.min !== undefined);
      assert(attribute.max !== undefined);
      assert(attribute.aug !== undefined);
      assert(attribute.val !== undefined);
      let min, max, aug, val;
      if (typeof attribute.min === "number") {
        min = attribute.min;
      } else {
        min = critterAttributePowerEnum.Force as const;
      }

      if (typeof attribute.max === "number") {
        max = attribute.max;
      } else {
        max = critterAttributePowerEnum.Force as const;
      }

      if (typeof attribute.aug === "number") {
        aug = attribute.aug;
      } else {
        aug = critterAttributePowerEnum.Force as const;
      }

      if (typeof attribute.val === "number") {
        val = attribute.val;
      } else {
        val = critterAttributePowerEnum.Force as const;
      }

      override = {
        min: min,
        max: max,
        aug: aug,
        val: val,
      };
    }
    let name;
    switch (attribute.name) {
      case lockedAttributeXmlEnum.DEP:
        {
          name = specialAttributeTypeEnum.Depth;
        }
        break;
      case lockedAttributeXmlEnum.MAG:
        {
          name = specialAttributeTypeEnum.Magic;
        }
        break;
      case lockedAttributeXmlEnum.RES:
        {
          name = specialAttributeTypeEnum.Resonance;
        }
        break;
    }
    attributeOption.enableAttribute = {
      name: name,
      ...(override !== undefined && { override: override }),
    };
  }
  if ("replaceattributes" in bonus && bonus.replaceattributes !== undefined) {
    checkProp("replaceattributes");
    assert(attributeOption.replaceAttributeList === undefined);
    const replaceArray = Array.isArray(bonus.replaceattributes.replaceattribute)
      ? bonus.replaceattributes.replaceattribute
      : [bonus.replaceattributes.replaceattribute];
    attributeOption.replaceAttributeList = replaceArray.map((replace) => {
      let name;
      if (replace.name !== undefined) {
        assert(replace._name === undefined);
        name = replace.name;
      } else {
        assert(replace._name !== undefined, JSON.stringify(replace));
        name = replace._name;
      }

      assert(replace.id === undefined);
      assert(replace.xmltext === undefined);
      assert(replace._precedence === undefined);
      if (replace.val !== undefined || replace.value !== undefined) {
        assert(
          replace.min === undefined &&
            replace.max === undefined &&
            replace.aug === undefined
        );
        if (replace.val !== undefined) {
          assert(replace.value === undefined);
          assert(typeof replace.val === "number");
          return { name: name, value: replace.val };
        } else {
          return { name: name, value: replace.value };
        }
      } else {
        let min, max, aug;
        if (replace.min !== undefined) {
          assert(typeof replace.min === "number");
          min = { min: replace.min };
        }
        if (replace.max !== undefined) {
          assert(typeof replace.max === "number");
          max = { max: replace.max };
        }
        if (replace.aug !== undefined) {
          assert(typeof replace.aug === "number");
          aug = { aug: replace.aug };
        }
        return {
          name: name,
          ...(min !== undefined && min),
          ...(max !== undefined && max),
          ...(aug !== undefined && aug),
        };
      }
    });
  }
  if ("attributekarmacost" in bonus && bonus.attributekarmacost !== undefined) {
    checkProp("attributekarmacost");
    const karmaCost = Array.isArray(bonus.attributekarmacost)
      ? bonus.attributekarmacost.map((karmaCost) => {
          return convertKarmaCost(karmaCost);
        })
      : [convertKarmaCost(bonus.attributekarmacost)];
    attributeOption.modifyAttributeImprovementKarmaCost = karmaCost;
  }
  if ("limit" in bonus && bonus.limit !== undefined) {
    checkProp("limit");
    const limitList = Array.isArray(bonus.limit) ? bonus.limit : [bonus.limit];
    attributeOption.limitIncrease = limitList.map((limit) => {
      assert(limit.name !== undefined);
      assert(limit.value !== undefined);
      switch (limit.name as limitCategoryEnum) {
        case limitCategoryEnum.Mental:
        case limitCategoryEnum.Physical:
        case limitCategoryEnum.Social:
          break;
        default:
          assert(false, limit.name);
      }
      return {
        category: limit.name as limitCategoryEnum,
        value: limit.value,
      };
    });
  }
  if ("limitmodifier" in bonus && bonus.limitmodifier !== undefined) {
    checkProp("limitmodifier");
    const limitModifierList = Array.isArray(bonus.limitmodifier)
      ? bonus.limitmodifier
      : [bonus.limitmodifier];
    attributeOption.limitModifier = limitModifierList.map((limit) => {
      let category;
      switch (limit.limit) {
        case limitCategoryEnum.Mental:
          category = limitCategoryEnum.Mental;
          break;
        case limitCategoryEnum.Physical:
          category = limitCategoryEnum.Physical;
          break;
        case limitCategoryEnum.Social:
          category = limitCategoryEnum.Social;
          break;
        default:
          assert(false, limit.limit);
      }
      return {
        category: category,
        value: convertRatingUnion(limit.value),
        ...(limit.condition !== undefined && {
          condition: convertCondition(limit.condition),
        }),
      };
    });
  }
  if ("selectlimit" in bonus && bonus.selectlimit !== undefined) {
    checkProp("selectlimit");
    assert(attributeOption.increaseLimitIgnoreMaximum === undefined);
    attributeOption.increaseLimitIgnoreMaximum = bonus.selectlimit.val;
  }
  if ("sociallimit" in bonus && bonus.sociallimit !== undefined) {
    checkProp("sociallimit");
    attributeOption.socialLimit = convertRatingUnion(bonus.sociallimit);
  }
  if ("physicallimit" in bonus && bonus.physicallimit !== undefined) {
    checkProp("physicallimit");
    const physicalLimit =
      typeof bonus.physicallimit === "number"
        ? bonus.physicallimit
        : { option: bonus.physicallimit };
    attributeOption.physicalLimit = physicalLimit;
  }
  if ("mentallimit" in bonus && bonus.mentallimit !== undefined) {
    checkProp("mentallimit");
    const mentalLimit =
      typeof bonus.mentallimit === "number"
        ? bonus.mentallimit
        : { option: bonus.mentallimit };
    attributeOption.mentalLimit = mentalLimit;
  }
  if (
    "nativelanguagelimit" in bonus &&
    bonus.nativelanguagelimit !== undefined
  ) {
    checkProp("nativelanguagelimit");
    attributeOption.increaseNativeLanguageLimit = bonus.nativelanguagelimit;
  }

  // Skill Bonuses and Modifiers
  // --------------------------------------------------------------------------------------------
  if ("selectskill" in bonus && bonus.selectskill !== undefined) {
    checkProp("selectskill");
    assert(skillOption.selectSkill === undefined);
    const linkSkill = bonus.selectskill;
    if (typeof linkSkill === "string") {
      assert(linkSkill === "");
      skillOption.selectSkill = {
        skill: { restriction: {} },
        bonus: { modifierType: bonusSkillModifierTypeEnum.Linked },
      };
    } else {
      const selectSkillBase = getSkillSelectionOptions(linkSkill);

      if (linkSkill._prompt !== undefined) {
        assert(
          selectSkillBase.restriction.attributeList === undefined &&
            selectSkillBase.restriction.skillCategoryList === undefined &&
            selectSkillBase.restriction.skillList === undefined,
          JSON.stringify(linkSkill)
        );
        skillOption.selectSkill = {
          skill: {
            enterName: true,
            restriction: {
              ...(linkSkill._knowledgeskills !== undefined && {
                knowledgeSkillRestriction: {
                  limit:
                    linkSkill._knowledgeskills === "True"
                      ? ("Only" as const)
                      : ("Exclude" as const),
                },
              }),
            },
          },
          bonus: {
            modifierType: bonusSkillModifierTypeEnum.Linked,
          },
        };
      } else {
        let modifierType;
        if (linkSkill.applytorating !== undefined) {
          modifierType =
            linkSkill.applytorating === "True"
              ? bonusSkillModifierTypeEnum.ApplyBonusToLevel
              : bonusSkillModifierTypeEnum.DicePoolIncrease;
        } else {
          modifierType =
            linkSkill.max !== undefined
              ? bonusSkillModifierTypeEnum.MaximumIncrease
              : bonusSkillModifierTypeEnum.DicePoolIncrease;
        }
        let ratingIncrease;
        if (linkSkill.val !== undefined) {
          assert(linkSkill.max === undefined, JSON.stringify(linkSkill));
          ratingIncrease = convertRatingAttributeUnion(linkSkill.val);
        } else if (linkSkill.max !== undefined) {
          ratingIncrease = linkSkill.max;
        } else {
          ratingIncrease = { option: "Rating" as const };
        }
        skillOption.selectSkill = {
          skill: selectSkillBase,
          bonus: {
            ratingIncreaseCount: ratingIncrease,
            modifierType: modifierType,
          },
          ...(linkSkill.disablespecializationeffects !== undefined && {
            disableSkillSpecialisation: true,
          }),
        };
      }
    }
  }
  if ("selectexpertise" in bonus && bonus.selectexpertise !== undefined) {
    checkProp("selectexpertise");
    assert(skillOption.selectExpertise === undefined);
    skillOption.selectExpertise = {
      availableSkillList: bonus.selectexpertise._limittoskill
        .split(",")
        .map((s) => s.trim()),
    };
  }
  if ("specificskill" in bonus && bonus.specificskill !== undefined) {
    checkProp("specificskill");
    const skillList = Array.isArray(bonus.specificskill)
      ? bonus.specificskill
      : [bonus.specificskill];
    skillOption.skillIncreaseList = skillList.map((skill) => {
      return convertSkill(skill);
    });
  }
  if ("skillattribute" in bonus && bonus.skillattribute !== undefined) {
    checkProp("skillattribute");
    const skillList = Array.isArray(bonus.skillattribute)
      ? bonus.skillattribute
      : [bonus.skillattribute];
    skillOption.skillIncreaseForAttributeList = skillList.map((skill) => {
      return convertSkill(skill);
    });
  }
  if (
    "skilllinkedattribute" in bonus &&
    bonus.skilllinkedattribute !== undefined
  ) {
    checkProp("skilllinkedattribute");
    assert(skillOption.skillIncreaseForAttributeList === undefined);
    const skillList = Array.isArray(bonus.skilllinkedattribute)
      ? bonus.skilllinkedattribute
      : [bonus.skilllinkedattribute];
    skillOption.skillIncreaseForAttributeList = skillList.map((skill) => {
      return convertSkill(skill);
    });
  }
  if ("skillcategory" in bonus && bonus.skillcategory !== undefined) {
    checkProp("skillcategory");
    assert(skillOption.skillCategoryList === undefined);
    const skillCategoryList = Array.isArray(bonus.skillcategory)
      ? bonus.skillcategory
      : [bonus.skillcategory];
    skillOption.skillCategoryList = skillCategoryList.map((category) => {
      return convertSkill(category);
    });
  }
  if ("skillgroup" in bonus && bonus.skillgroup !== undefined) {
    checkProp("skillgroup");
    assert(skillOption.skillGroupList === undefined);
    const skillGroupList = Array.isArray(bonus.skillgroup)
      ? bonus.skillgroup
      : [bonus.skillgroup];
    skillOption.skillGroupList = skillGroupList.map((group) => {
      return convertSkill(group);
    });
  }
  if ("skillgrouplevel" in bonus && bonus.skillgrouplevel !== undefined) {
    checkProp("skillgrouplevel");
    // const skillGroupLevelList = Array.isArray(bonus.skillgrouplevel) ? bonus.skillgrouplevel : [bonus.skillgrouplevel]
    const skillGroupLevelList = [bonus.skillgrouplevel];
    const skillGroupList = skillGroupLevelList.map((group) => {
      return {
        name: group.name,
        bonus: group.val,
        modifierType: bonusSkillModifierTypeEnum.LevelIncrease as const,
      };
    });
    if (skillOption.skillGroupList !== undefined) {
      skillOption.skillGroupList =
        skillOption.skillGroupList.concat(skillGroupList);
    } else {
      skillOption.skillGroupList = skillGroupList;
    }
  }
  if (
    "allowskilldefaulting" in bonus &&
    bonus.allowskilldefaulting !== undefined
  ) {
    checkProp("allowskilldefaulting");
    assert(skillOption.allowSkillDefaulting === undefined);
    assert(bonus.allowskilldefaulting === "");
    skillOption.allowSkillDefaulting = true as const;
  }
  if (
    "addskillspecializationoption" in bonus &&
    bonus.addskillspecializationoption !== undefined
  ) {
    checkProp("addskillspecializationoption");
    assert(skillOption.addSkillSpecialistion === undefined);
    const spec = bonus.addskillspecializationoption;
    let skillList;
    if ("skills" in spec) {
      skillList = Array.isArray(spec.skills.skill)
        ? spec.skills.skill
        : [spec.skills.skill];
    } else {
      skillList = [spec.skill];
    }
    skillOption.addSkillSpecialistion = {
      spec: spec.spec,
      skillList: skillList,
    };
  }
  if (
    "knowledgeskillpoints" in bonus &&
    bonus.knowledgeskillpoints !== undefined
  ) {
    checkProp("knowledgeskillpoints");
    skillOption.bonusSkillPoints = {
      points: bonus.knowledgeskillpoints.val,
      knowledgeSkillRestriction: "Only" as const,
    };
  }
  if (
    "blockskillgroupdefaulting" in bonus &&
    bonus.blockskillgroupdefaulting !== undefined
  ) {
    checkProp("blockskillgroupdefaulting");
    assert(skillOption.blockSkillGroupAndDefaulting === undefined);
    skillOption.blockSkillGroupAndDefaulting = bonus.blockskillgroupdefaulting;
  }
  if (
    "blockskillcategorydefaulting" in bonus &&
    bonus.blockskillcategorydefaulting !== undefined
  ) {
    checkProp("blockskillcategorydefaulting");
    assert(skillOption.blockSkillCategoryListAndDefaulting === undefined);
    const category = Array.isArray(bonus.blockskillcategorydefaulting)
      ? bonus.blockskillcategorydefaulting
      : [bonus.blockskillcategorydefaulting];
    skillOption.blockSkillCategoryListAndDefaulting = category;
  }
  if ("activesoft" in bonus && bonus.activesoft !== undefined) {
    checkProp("activesoft");
    assert(skillOption.activeSoft === undefined);
    const activeSoft = bonus.activesoft;
    skillOption.activeSoft = { option: activeSoft.val };
  }
  if ("skillsoft" in bonus && bonus.skillsoft !== undefined) {
    checkProp("skillsoft");
    assert(skillOption.skillSoft === undefined);
    const skillSoft = bonus.skillsoft;
    skillOption.skillSoft = {
      bonus: {
        option: skillSoft.val,
      },
      ...(skillSoft._excludecategory !== undefined && {
        excludedCategory: skillSoft._excludecategory,
      }),
      ...(skillSoft._skillcategory !== undefined && {
        specificCategory: skillSoft._skillcategory,
      }),
    };
  }
  if ("skillsoftaccess" in bonus && bonus.skillsoftaccess !== undefined) {
    checkProp("skillsoftaccess");
    assert(skillOption.skillSoftHost === undefined);
    const skillsoftaccess = bonus.skillsoftaccess;
    skillOption.skillSoftHost = {
      maximumSkillSoftRating: {
        option: skillsoftaccess.xmltext,
        precedence: skillsoftaccess._precedence,
      },
    };
  }
  if ("skillwire" in bonus && bonus.skillwire !== undefined) {
    checkProp("skillwire");
    assert(skillOption.skillwire === undefined);
    const skillwire = bonus.skillwire;
    let skillWireMaxRating;
    if (typeof skillwire === "string") skillWireMaxRating = skillwire;
    else skillWireMaxRating = skillwire.xmltext;

    skillOption.skillwire = {
      maximumSkillSoftRating: convertRatingCalculation(skillWireMaxRating),
      ...(typeof bonus.skillwire === "object" && {
        precedence: bonus.skillwire._precedence,
      }),
    };
  }
  if ("hardwires" in bonus && bonus.hardwires !== undefined) {
    checkProp("hardwires");
    const hardwire = bonus.hardwires;
    if ("_knowledgeskill" in hardwire) {
      skillOption.hardwire = {
        maximumSkillSoftRating: [
          {
            option: hardwire.xmltext,
          },
        ],
        activeSkills: false,
        excludeCategoryList: [],
      };
    } else {
      skillOption.hardwire = {
        maximumSkillSoftRating: [
          {
            option: hardwire.xmltext,
          },
        ],
        activeSkills: true,
        excludeCategoryList: hardwire._excludecategory
          .split(",")
          .map((s) => s.trim()),
      };
    }
  }
  if (
    "skillcategorykarmacost" in bonus &&
    bonus.skillcategorykarmacost !== undefined
  ) {
    checkProp("skillcategorykarmacost");
    const karmaCostArray = Array.isArray(bonus.skillcategorykarmacost)
      ? bonus.skillcategorykarmacost
      : [bonus.skillcategorykarmacost];
    const skillCategoryKarmaCostModifierList = karmaCostArray.map(
      (karmaCost) => {
        assert(karmaCost.name !== "", karmaCost.name);
        assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
        let condition;
        if (karmaCost.condition !== undefined) {
          if (karmaCost.condition === "career") {
            condition = bonusConditionEnum.CareerMode;
          } else if (karmaCost.condition === "create") {
            condition = bonusConditionEnum.CharacterCreation;
          } else {
            assert(false, karmaCost.condition);
          }
        }
        return {
          category: karmaCost.name as skillCategoryEnum,
          value: karmaCost.val,
          costModifierType: bonusCostModifierTypeEnum.KarmaIncrease,
          ...(condition !== undefined && {
            condition: condition,
          }),
          ...(karmaCost.min !== undefined && {
            minimumLevelWhereBonusApplies: karmaCost.min,
          }),
          ...(karmaCost.max !== undefined && {
            maximumLevelBeforeBonusStopsApplying: karmaCost.max,
          }),
        };
      }
    );

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        skillCategoryList: skillCategoryKarmaCostModifierList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList.skillCategoryList === undefined
      ) {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillCategoryKarmaCostModifierList;
      } else {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillOption.skillKarmaCostModifierList.skillCategoryList.concat(
            skillCategoryKarmaCostModifierList
          );
      }
    }
  }
  if (
    "skillcategorykarmacostmultiplier" in bonus &&
    bonus.skillcategorykarmacostmultiplier !== undefined
  ) {
    checkProp("skillcategorykarmacostmultiplier");
    const karmaCostArray = Array.isArray(bonus.skillcategorykarmacostmultiplier)
      ? bonus.skillcategorykarmacostmultiplier
      : [bonus.skillcategorykarmacostmultiplier];
    const skillCategoryKarmaCostMultiplierList = karmaCostArray.map(
      (karmaCost) => {
        assert(karmaCost.name !== "", karmaCost.name);
        assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
        let condition;
        if (karmaCost.condition !== undefined) {
          if (karmaCost.condition === "career") {
            condition = bonusConditionEnum.CareerMode;
          } else if (karmaCost.condition === "create") {
            condition = bonusConditionEnum.CharacterCreation;
          } else {
            assert(false, karmaCost.condition);
          }
        }
        return {
          category: karmaCost.name as skillCategoryEnum,
          value: karmaCost.val,
          costModifierType: bonusCostModifierTypeEnum.KarmaMultiplier,
          ...(condition !== undefined && {
            condition: condition,
          }),
          ...(karmaCost.min !== undefined && {
            minimumLevelWhereBonusApplies: karmaCost.min,
          }),
          ...(karmaCost.max !== undefined && {
            maximumLevelBeforeBonusStopsApplying: karmaCost.max,
          }),
        };
      }
    );

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        skillCategoryList: skillCategoryKarmaCostMultiplierList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList.skillCategoryList === undefined
      ) {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillCategoryKarmaCostMultiplierList;
      } else {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillOption.skillKarmaCostModifierList.skillCategoryList.concat(
            skillCategoryKarmaCostMultiplierList
          );
      }
    }
  }
  if (
    "skillcategoryspecializationkarmacostmultiplier" in bonus &&
    bonus.skillcategoryspecializationkarmacostmultiplier !== undefined
  ) {
    checkProp("skillcategoryspecializationkarmacostmultiplier");
    const karmaCostArray = Array.isArray(
      bonus.skillcategoryspecializationkarmacostmultiplier
    )
      ? bonus.skillcategoryspecializationkarmacostmultiplier
      : [bonus.skillcategoryspecializationkarmacostmultiplier];
    const skillCategorySpecialisationKarmaCostMultiplierList =
      karmaCostArray.map((karmaCost) => {
        assert(karmaCost.name !== "", karmaCost.name);
        assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
        let condition;
        if (karmaCost.condition !== undefined) {
          if (karmaCost.condition === "career") {
            condition = bonusConditionEnum.CareerMode;
          } else if (karmaCost.condition === "create") {
            condition = bonusConditionEnum.CharacterCreation;
          } else {
            assert(false, karmaCost.condition);
          }
        }
        return {
          category: karmaCost.name as skillCategoryEnum,
          value: karmaCost.val,
          costModifierType: bonusCostModifierTypeEnum.KarmaMultiplier,
          ...(condition !== undefined && {
            condition: condition,
          }),
          ...(karmaCost.min !== undefined && {
            minimumLevelWhereBonusApplies: karmaCost.min,
          }),
          ...(karmaCost.max !== undefined && {
            maximumLevelBeforeBonusStopsApplying: karmaCost.max,
          }),
        };
      });

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        skillCategorySpecialisationList:
          skillCategorySpecialisationKarmaCostMultiplierList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList
          .skillCategorySpecialisationList === undefined
      ) {
        skillOption.skillKarmaCostModifierList.skillCategorySpecialisationList =
          skillCategorySpecialisationKarmaCostMultiplierList;
      } else {
        skillOption.skillKarmaCostModifierList.skillCategorySpecialisationList =
          skillOption.skillKarmaCostModifierList.skillCategorySpecialisationList.concat(
            skillCategorySpecialisationKarmaCostMultiplierList
          );
      }
    }
  }
  if (
    "skillcategorypointcostmultiplier" in bonus &&
    bonus.skillcategorypointcostmultiplier !== undefined
  ) {
    checkProp("skillcategorypointcostmultiplier");
    const karmaCostArray = Array.isArray(bonus.skillcategorypointcostmultiplier)
      ? bonus.skillcategorypointcostmultiplier
      : [bonus.skillcategorypointcostmultiplier];
    const skillCategoryPointCostMultiplierList = karmaCostArray.map(
      (karmaCost) => {
        assert(karmaCost.name !== "", karmaCost.name);
        assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
        assert(Object.keys(karmaCost).length == 2);
        return {
          category: karmaCost.name as skillCategoryEnum,
          value: karmaCost.val,
          costModifierType: bonusCostModifierTypeEnum.PointMultiplier,
        };
      }
    );

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        skillCategoryList: skillCategoryPointCostMultiplierList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList.skillCategoryList === undefined
      ) {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillCategoryPointCostMultiplierList;
      } else {
        skillOption.skillKarmaCostModifierList.skillCategoryList =
          skillOption.skillKarmaCostModifierList.skillCategoryList.concat(
            skillCategoryPointCostMultiplierList
          );
      }
    }
  }
  if (
    "skillgroupcategorykarmacostmultiplier" in bonus &&
    bonus.skillgroupcategorykarmacostmultiplier !== undefined
  ) {
    checkProp("skillgroupcategorykarmacostmultiplier");
    const karmaCostArray = Array.isArray(
      bonus.skillgroupcategorykarmacostmultiplier
    )
      ? bonus.skillgroupcategorykarmacostmultiplier
      : [bonus.skillgroupcategorykarmacostmultiplier];
    const skillGroupWithinSkillCategoryList = karmaCostArray.map(
      (karmaCost) => {
        assert(karmaCost.name !== "", karmaCost.name);
        assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
        assert(Object.keys(karmaCost).length == 2);
        return {
          category: karmaCost.name as skillCategoryEnum,
          value: karmaCost.val,
          costModifierType: bonusCostModifierTypeEnum.KarmaMultiplier,
        };
      }
    );

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        skillCategoryList: skillGroupWithinSkillCategoryList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList
          .skillGroupWithinSkillCategoryList === undefined
      ) {
        skillOption.skillKarmaCostModifierList.skillGroupWithinSkillCategoryList =
          skillGroupWithinSkillCategoryList;
      } else {
        skillOption.skillKarmaCostModifierList.skillGroupWithinSkillCategoryList =
          skillOption.skillKarmaCostModifierList.skillGroupWithinSkillCategoryList.concat(
            skillGroupWithinSkillCategoryList
          );
      }
    }
  }
  if (
    "activeskillkarmacost" in bonus &&
    bonus.activeskillkarmacost !== undefined
  ) {
    checkProp("activeskillkarmacost");
    const karmaCostArray = Array.isArray(bonus.activeskillkarmacost)
      ? bonus.activeskillkarmacost
      : [bonus.activeskillkarmacost];
    const allSkillList = karmaCostArray.map((karmaCost) => {
      assert(karmaCost.name === "", karmaCost.name);
      assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
      let condition;
      if (karmaCost.condition !== undefined) {
        if (karmaCost.condition === "career") {
          condition = bonusConditionEnum.CareerMode;
        } else if (karmaCost.condition === "create") {
          condition = bonusConditionEnum.CharacterCreation;
        } else {
          assert(false, karmaCost.condition);
        }
      }
      return {
        skillType: skillTypeEnum.Active,
        value: karmaCost.val,
        costModifierType: bonusCostModifierTypeEnum.KarmaMultiplier,
        ...(condition !== undefined && {
          condition: condition,
        }),
        ...(karmaCost.min !== undefined && {
          minimumLevelWhereBonusApplies: karmaCost.min,
        }),
        ...(karmaCost.max !== undefined && {
          maximumLevelBeforeBonusStopsApplying: karmaCost.max,
        }),
      };
    });

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        allSkillList: allSkillList,
      };
    } else {
      if (skillOption.skillKarmaCostModifierList.allSkillList === undefined) {
        skillOption.skillKarmaCostModifierList.allSkillList = allSkillList;
      } else {
        skillOption.skillKarmaCostModifierList.allSkillList =
          skillOption.skillKarmaCostModifierList.allSkillList.concat(
            allSkillList
          );
      }
    }
  }
  if (
    "knowledgeskillkarmacost" in bonus &&
    bonus.knowledgeskillkarmacost !== undefined
  ) {
    checkProp("knowledgeskillkarmacost");
    const karmaCostArray = Array.isArray(bonus.knowledgeskillkarmacost)
      ? bonus.knowledgeskillkarmacost
      : [bonus.knowledgeskillkarmacost];
    const allSkillKarmaCostModifierList = karmaCostArray.map((karmaCost) => {
      assert(karmaCost.name === "", karmaCost.name);
      assert("val" in karmaCost, JSON.stringify(karmaCost));
      const conditionalBonus = karmaCost.val;
      assert(conditionalBonus !== undefined);
      const match = SkillKarmaCost.match(conditionalBonus.toString());
      if (match.failed()) {
        assert(false, match.message);
      }
      let value;
      let itemRatingRequired;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const temp: unknown = bonusSkillKarmaCostSemantics(match).eval();
      assert(temp !== null);
      if (typeof temp === "number") {
        value = temp;
      } else {
        assert(typeof temp === "object");
        assert("RatingRequired" in temp);
        assert(Object.keys(temp).length === 1);
        assert(typeof temp.RatingRequired === "number");
        value = 1;
        itemRatingRequired = temp.RatingRequired;
      }
      if (karmaCost.condition !== undefined) {
        assert(karmaCost.condition === "career");
      }
      return {
        value: value,
        skillType: skillTypeEnum.Knowledge,
        costModifierType: bonusCostModifierTypeEnum.KarmaIncrease,
        ...(karmaCost.condition !== undefined && {
          condition: bonusConditionEnum.CareerMode,
        }),
        ...(karmaCost.min !== undefined && {
          minimumLevelWhereBonusApplies: karmaCost.min,
        }),
        ...(karmaCost.max !== undefined && {
          maximumLevelBeforeBonusStopsApplying: karmaCost.max,
        }),
        ...(itemRatingRequired !== undefined && {
          itemRatingRequired: itemRatingRequired,
        }),
      };
    });
    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        allSkillList: allSkillKarmaCostModifierList,
      };
    } else {
      if (skillOption.skillKarmaCostModifierList.allSkillList === undefined) {
        skillOption.skillKarmaCostModifierList.allSkillList =
          allSkillKarmaCostModifierList;
      } else {
        skillOption.skillKarmaCostModifierList.allSkillList =
          skillOption.skillKarmaCostModifierList.allSkillList.concat(
            allSkillKarmaCostModifierList
          );
      }
    }
  }
  if (
    "knowledgeskillkarmacostmin" in bonus &&
    bonus.knowledgeskillkarmacostmin !== undefined
  ) {
    checkProp("knowledgeskillkarmacostmin");
    const karmaCostArray = Array.isArray(bonus.knowledgeskillkarmacostmin)
      ? bonus.knowledgeskillkarmacostmin
      : [bonus.knowledgeskillkarmacostmin];
    const allSkillMinimumCostList = karmaCostArray.map((karmaCost) => {
      assert(karmaCost.name === "", karmaCost.name);
      assert(karmaCost.max !== undefined);
      assert(Object.keys(karmaCost).length == 4);
      assert(typeof karmaCost.val === "number", `${karmaCost.val}`);
      let condition;
      if (karmaCost.condition !== undefined) {
        if (karmaCost.condition === "career") {
          condition = bonusConditionEnum.CareerMode;
        } else if (karmaCost.condition === "create") {
          condition = bonusConditionEnum.CharacterCreation;
        } else {
          assert(false, karmaCost.condition);
        }
      }
      return {
        skillType: skillTypeEnum.Active,
        minimumCost: karmaCost.val,
        maximumLevelBeforeMinimumStopsApplying: karmaCost.max,
        ...(condition !== undefined && {
          condition: condition,
        }),
      };
    });

    if (skillOption.skillKarmaCostModifierList === undefined) {
      skillOption.skillKarmaCostModifierList = {
        allSkillMinimumCostList: allSkillMinimumCostList,
      };
    } else {
      if (
        skillOption.skillKarmaCostModifierList.allSkillMinimumCostList ===
        undefined
      ) {
        skillOption.skillKarmaCostModifierList.allSkillMinimumCostList =
          allSkillMinimumCostList;
      } else {
        skillOption.skillKarmaCostModifierList.allSkillMinimumCostList =
          skillOption.skillKarmaCostModifierList.allSkillMinimumCostList.concat(
            allSkillMinimumCostList
          );
      }
    }
  }
  if (
    "skillgroupcategorydisable" in bonus &&
    bonus.skillgroupcategorydisable !== undefined
  ) {
    checkProp("skillgroupcategorydisable");
    // const skillGroupsInCategoryDisable = Array.isArray(
    //   bonus.skillgroupcategorydisable
    // )
    //   ? bonus.skillgroupcategorydisable
    //   : [bonus.skillgroupcategorydisable];
    const skillGroupsInCategoryDisable = [bonus.skillgroupcategorydisable];
    if (skillOption.skillDisableList === undefined) {
      skillOption.skillDisableList = {
        skillGroupWithinSkillCategoryList: skillGroupsInCategoryDisable,
      };
    } else {
      skillOption.skillDisableList.skillGroupWithinSkillCategoryList =
        skillGroupsInCategoryDisable;
    }
  }
  if ("skillgroupdisable" in bonus && bonus.skillgroupdisable !== undefined) {
    checkProp("skillgroupdisable");
    const skillGroupDisable = Array.isArray(bonus.skillgroupdisable)
      ? bonus.skillgroupdisable
      : [bonus.skillgroupdisable];
    if (skillOption.skillDisableList === undefined) {
      skillOption.skillDisableList = {
        skillGroupList: skillGroupDisable,
      };
    } else {
      skillOption.skillDisableList.skillGroupList = skillGroupDisable;
    }
  }
  if (
    "skillgroupdisablechoice" in bonus &&
    bonus.skillgroupdisablechoice !== undefined
  ) {
    checkProp("skillgroupdisablechoice");
    if (skillOption.skillDisableList === undefined) {
      skillOption.skillDisableList = {};
    }
    skillOption.skillDisableList.selectSkillGroupToDisable = true;
  }
  if ("skilldisable" in bonus && bonus.skilldisable !== undefined) {
    checkProp("skilldisable");
    const skillDisable = Array.isArray(bonus.skilldisable)
      ? bonus.skilldisable
      : [bonus.skilldisable];
    if (skillOption.skillDisableList === undefined) {
      skillOption.skillDisableList = {
        skillList: skillDisable,
      };
    } else {
      skillOption.skillDisableList.skillList = skillDisable;
    }
  }
  if ("unlockskills" in bonus && bonus.unlockskills !== undefined) {
    checkProp("unlockskills");
    const unlockSkillList = Array.isArray(bonus.unlockskills)
      ? bonus.unlockskills
      : [bonus.unlockskills];
    skillOption.unlockSkillList = unlockSkillList.map((unlockSkill) => {
      if (typeof unlockSkill === "string") {
        return unlockSkill;
      } else {
        assert(
          unlockSkill.xmltext === "Name",
          `Unexpected name: ${unlockSkill._name}`
        );
        assert(unlockSkill._name !== "");
        return unlockSkill._name;
      }
    });
  }
  if ("swapskillattribute" in bonus && bonus.swapskillattribute !== undefined) {
    checkProp("swapskillattribute");
    skillOption.swapSkillAttribute = {
      skill: bonus.swapskillattribute.limittoskill,
      newAttribute: convertAttribute(bonus.swapskillattribute.attribute),
    };
  }
  if (
    "swapskillspecattribute" in bonus &&
    bonus.swapskillspecattribute !== undefined
  ) {
    checkProp("swapskillspecattribute");
    skillOption.swapSkillSpecialisationAttribute = {
      skill: bonus.swapskillspecattribute.limittoskill,
      specialisation: bonus.swapskillspecattribute.spec,
      newAttribute: convertAttribute(bonus.swapskillspecattribute.attribute),
    };
  }

  // Power Related Bonuses
  // --------------------------------------------------------------------------------------------
  if ("selectpowers" in bonus && bonus.selectpowers !== undefined) {
    checkProp("selectpowers");
    assert(powerOption.selectPower === undefined);
    const linkPower = bonus.selectpowers.selectpower;
    let powerPointLimit;
    if (
      linkPower.limit !== undefined ||
      linkPower.pointsperlevel !== undefined
    ) {
      assert(
        linkPower.limit !== undefined && linkPower.pointsperlevel !== undefined,
        JSON.stringify(linkPower)
      );
      powerPointLimit = {
        limit: convertRatingUnion(linkPower.limit),
        powerPointsPerLevel: linkPower.pointsperlevel,
      };
    }
    powerOption.selectPower = {
      ...(linkPower._limittopowers !== undefined && {
        limitedPowerList: linkPower._limittopowers
          .split(",")
          .map((s) => s.trim()),
      }),
      ...(linkPower.ignorerating !== undefined && {
        ignorePowerLimit: true as const,
      }),
      powerLevelBonus: convertRatingUnion(linkPower.val),
      ...(powerPointLimit !== undefined && {
        powerPointLimit: powerPointLimit,
      }),
    };
  }
  if ("specificpower" in bonus && bonus.specificpower !== undefined) {
    checkProp("specificpower");
    let specificPowerList: Array<SpecificPowerXMLType> = [];
    if (Array.isArray(bonus.specificpower)) {
      specificPowerList = bonus.specificpower;
    } else {
      specificPowerList.push(bonus.specificpower);
    }
    powerOption.specificPowerList = specificPowerList.map((power) => {
      let selectOption;
      if (power.bonusoverride !== undefined) {
        if ("selectskill" in power.bonusoverride) {
          const linkSkill = power.bonusoverride.selectskill;
          assert(linkSkill !== "");
          const selectSkillBase = getSkillSelectionOptions(linkSkill);

          assert(
            linkSkill.disablespecializationeffects === undefined,
            linkSkill.disablespecializationeffects
          );
          assert(linkSkill._prompt === undefined, linkSkill._prompt);
          assert(
            linkSkill.applytorating === undefined,
            linkSkill.applytorating
          );
          assert(linkSkill.max === undefined, `${linkSkill.max}`);
          assert(linkSkill.val === "Rating", `${linkSkill.val}`);
          selectOption = { skill: selectSkillBase };
        } else {
          const attribute = convertAttribute(
            power.bonusoverride.selectattribute.attribute
          );
          selectOption = { attribute: attribute };
        }
      }
      assert(power.val !== undefined || selectOption === undefined);
      const bonus =
        power.val !== undefined
          ? {
              value: power.val,
              ...(selectOption !== undefined && { select: selectOption }),
            }
          : undefined;
      return {
        name: power.name,
        ...(bonus !== undefined && { bonus: bonus }),
      };
    });
  }
  if ("adeptpowerpoints" in bonus && bonus.adeptpowerpoints !== undefined) {
    checkProp("adeptpowerpoints");
    powerOption.bonusAdeptPowerPoints = bonus.adeptpowerpoints;
  }
  if ("optionalpowers" in bonus && bonus.optionalpowers !== undefined) {
    checkProp("optionalpowers");
    const powerList = Array.isArray(bonus.optionalpowers.optionalpower)
      ? bonus.optionalpowers.optionalpower
      : [bonus.optionalpowers.optionalpower];
    const convertedPowerList = powerList.map((power) => {
      let convertedPower;
      if (typeof power !== "string") {
        assert(!("_rating" in power));
        convertedPower = {
          name: power.xmltext,
          select: power._select,
        };
      } else {
        convertedPower = { name: power };
      }
      return convertedPower;
    });
    let count;
    if (bonus.optionalpowers._count !== undefined) {
      count = parseInt(bonus.optionalpowers._count);
      if (isNaN(count)) {
        // TODO: make this generic... and actually handle it properly
        assert(
          bonus.optionalpowers._count === "floor({MAG} div 3)",
          bonus.optionalpowers._count
        );
        count = { calc: "floor({MAG} div 3)" as const };
      }
    }

    powerOption.unlockOptionalPowerList = {
      ...(count !== undefined && { selectOptionalPowerCount: count }),
      optionalPowerList: convertedPowerList,
    };
  }
  if ("critterpowers" in bonus && bonus.critterpowers !== undefined) {
    checkProp("critterpowers");
    const powerList = Array.isArray(bonus.critterpowers.power)
      ? bonus.critterpowers.power
      : [bonus.critterpowers.power];
    const convertedPowerList = powerList.map((power) => {
      let convertedPower;
      if (typeof power !== "string") {
        let rating;
        if ("_rating" in power && power._rating !== undefined) {
          rating = parseInt(power._rating);
          assert(!isNaN(rating));
        }
        convertedPower = {
          name: power.xmltext,
          ...("_select" in power &&
            power._select !== undefined && { select: power._select }),
          ...(rating !== undefined && { rating: rating }),
        };
      } else {
        convertedPower = { name: power };
      }
      return convertedPower;
    });

    powerOption.addCritterPowerList = convertedPowerList;
  }
  if ("critterpowerlevels" in bonus && bonus.critterpowerlevels !== undefined) {
    checkProp("critterpowerlevels");
    const critterPowerList = Array.isArray(bonus.critterpowerlevels.power)
      ? bonus.critterpowerlevels.power
      : [bonus.critterpowerlevels.power];
    const convertedPowerList = critterPowerList.map((power) => {
      return {
        name: power.name,
        rating: power.val,
      };
    });
    if (powerOption.addCritterPowerList !== undefined) {
      powerOption.addCritterPowerList =
        powerOption.addCritterPowerList.concat(convertedPowerList);
    } else {
      powerOption.addCritterPowerList = convertedPowerList;
    }
  }
  if (
    "limitcritterpowercategory" in bonus &&
    bonus.limitcritterpowercategory !== undefined
  ) {
    checkProp("limitcritterpowercategory");
    powerOption.unlockCritterPowerCategory = bonus.limitcritterpowercategory;
  }

  // Spell and Magic Bonuses
  // --------------------------------------------------------------------------------------------
  if ("addspell" in bonus && bonus.addspell !== undefined) {
    checkProp("addspell");
    spellAndMagicOption.addSpell = {
      name: bonus.addspell.xmltext,
      ...(bonus.addspell._alchemical === "True" && { alchemical: true }),
    };
  }
  if ("freespells" in bonus && bonus.freespells !== undefined) {
    checkProp("freespells");
    const freeSpell = bonus.freespells;
    let freeSpellBonus;
    if ("_attribute" in freeSpell) {
      assert(freeSpell._limit === "half,touchonly");
      freeSpellBonus = {
        linkType: {
          attributeLinked: convertAttribute(
            freeSpell._attribute as attributeXMLEnum
          ),
        },
        freeSpellRate: freeSpellRateEnum.Half,
        spellRange: spellPowerRangeEnum.Touch,
      };
    } else {
      freeSpellBonus = {
        linkType: { skillLinked: freeSpell._skill },
        freeSpellRate: freeSpellRateEnum.Full,
      };
    }
    spellAndMagicOption.freeSpellOngoingBonus = freeSpellBonus;
  }
  if ("selectspell" in bonus) {
    checkProp("selectspell");
    assert(spellAndMagicOption.linkSpell === undefined);
    if (typeof bonus.selectspell === "object") {
      assert(
        bonus.selectspell._ignorerequirements === "True",
        bonus.selectspell._ignorerequirements
      );
      spellAndMagicOption.linkSpell = {
        ignoreRequirements: true as const,
      };
    } else {
      assert(bonus.selectspell === "", bonus.selectspell);
      spellAndMagicOption.linkSpell = {
        ignoreRequirements: false as const,
      };
    }
  }
  if ("spellcategory" in bonus && bonus.spellcategory !== undefined) {
    checkProp("spellcategory");
    const spellCategoryXmlList = Array.isArray(bonus.spellcategory)
      ? bonus.spellcategory
      : [bonus.spellcategory];
    assert(spellCategoryXmlList.length > 0);
    const spellCategoryList = [];
    for (const spellCategory of spellCategoryXmlList) {
      let category, value;
      if (spellCategory.name === undefined) {
        // TODO: better way to do this?
        category = { option: "SelectCategory" as const };
      } else {
        category = spellCategoryConversion(spellCategory.name);
      }
      if (typeof spellCategory.val === "number") {
        value = spellCategory.val;
      } else {
        value = {
          option: "Rating" as const,
        };
      }
      spellCategoryList.push({
        category: category,
        bonus: value,
      });
    }
    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellBonusDice: [
          {
            spellCategoryList: spellCategoryList,
          },
        ],
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellBonusDice === undefined) {
        spellAndMagicOption.spellModifiers.spellBonusDice = [
          {
            spellCategoryList: spellCategoryList,
          },
        ];
      } else {
        spellAndMagicOption.spellModifiers.spellBonusDice.push({
          spellCategoryList: spellCategoryList,
        });
      }
    }
  }
  if ("allowspellcategory" in bonus && bonus.allowspellcategory !== undefined) {
    checkProp("allowspellcategory");
    const allowSpellCategory = spellCategoryConversion(
      bonus.allowspellcategory
    );
    if (spellAndMagicOption.unlockSpellList === undefined) {
      spellAndMagicOption.unlockSpellList = [
        {
          allowSpellCategory: allowSpellCategory,
        },
      ];
    } else {
      spellAndMagicOption.unlockSpellList.push({
        allowSpellCategory: allowSpellCategory,
      });
    }
  }
  if ("spelldicepool" in bonus && bonus.spelldicepool !== undefined) {
    checkProp("spelldicepool");
    const spellDicePoolList = Array.isArray(bonus.spelldicepool)
      ? bonus.spelldicepool
      : [bonus.spelldicepool];
    const additionalDiceForSpellList = spellDicePoolList.map((spell) => {
      assert(Object.keys(spell).length === 2);

      let name;
      if ("id" in spell) {
        assert(spell.name === undefined);
        const currentPath = import.meta.url;
        const xml_string = fs.readFileSync(
          fileURLToPath(
            path.dirname(currentPath) + "../../../../xmls/spells.xml"
          ),
          "utf8"
        );
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "_",
          textNodeName: "xmltext",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        const jObj: any = parser.parse(xml_string);
        // console.log(
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //   jObj.chummer.spells.spell[337].required
        // );

        const spellListParsed = SpellListXmlSchema(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          jObj.chummer.spells.spell
        );

        if (spellListParsed instanceof type.errors) {
          console.log(spellListParsed.summary);
          assert(false);
        }
        const spellMatchedList = spellListParsed.filter((fullSpell) => {
          return spell.id === fullSpell.id;
        });
        assert(
          spellMatchedList.length !== 0,
          `Spell ID: ${spell.id} not found`
        );
        assert(
          spellMatchedList.length === 1,
          `Spell ID: ${spell.id} has multiple matches`
        );
        assert(
          spellListParsed.filter((fullSpell) => {
            return spellMatchedList[0].name === fullSpell.name;
          }).length === 1,
          `Spell Name: ${spellMatchedList[0].name} has multiple matches`
        );
        name = spellMatchedList[0].name;
      } else {
        name = spell.name;
      }

      assert(name !== undefined, JSON.stringify(spell));
      assert(spell.val !== undefined);
      assert(typeof spell.val === "number");
      return {
        name: name,
        bonus: spell.val,
      };
    });
    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellBonusDice: [{ specificSpell: additionalDiceForSpellList }],
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellBonusDice === undefined) {
        spellAndMagicOption.spellModifiers.spellBonusDice = [
          { specificSpell: additionalDiceForSpellList },
        ];
      } else {
        spellAndMagicOption.spellModifiers.spellBonusDice.push({
          specificSpell: additionalDiceForSpellList,
        });
      }
    }
  }
  if (
    "blockspelldescriptor" in bonus &&
    bonus.blockspelldescriptor !== undefined
  ) {
    checkProp("blockspelldescriptor");
    spellAndMagicOption.blockSpellDescriptorList = convertSpellDescriptors(
      bonus.blockspelldescriptor
    );
  }
  if (
    "spelldescriptordamage" in bonus &&
    bonus.spelldescriptordamage !== undefined
  ) {
    checkProp("spelldescriptordamage");
    const spellBonusDamage = {
      spellDescriptor: {
        spellDescriptorListRequired: convertSpellDescriptors(
          bonus.spelldescriptordamage.descriptor
        ),
        bonusDamage: bonus.spelldescriptordamage.val,
      },
    };
    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellBonusDamage: spellBonusDamage,
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellBonusDamage === undefined) {
        spellAndMagicOption.spellModifiers.spellBonusDamage = spellBonusDamage;
      } else {
        spellAndMagicOption.spellModifiers.spellBonusDamage.spellDescriptor =
          spellBonusDamage.spellDescriptor;
      }
    }
  }
  if (
    "spellcategorydamage" in bonus &&
    bonus.spellcategorydamage !== undefined
  ) {
    checkProp("spellcategorydamage");
    const spellBonusDamage = {
      spellCategory: {
        spellCategoryRequired: convertSpellCategory(
          bonus.spellcategorydamage.category
        ),
        bonusDamage: bonus.spellcategorydamage.val,
      },
    };
    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellBonusDamage: spellBonusDamage,
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellBonusDamage === undefined) {
        spellAndMagicOption.spellModifiers.spellBonusDamage = spellBonusDamage;
      } else {
        spellAndMagicOption.spellModifiers.spellBonusDamage.spellCategory =
          spellBonusDamage.spellCategory;
      }
    }
  }
  if (
    "spelldescriptordrain" in bonus &&
    bonus.spelldescriptordrain !== undefined
  ) {
    checkProp("spelldescriptordrain");
    const spellDescriptorDrain = {
      spellDescriptorListRequired: convertSpellDescriptors(
        bonus.spelldescriptordrain.descriptor
      ),
      extraDrain: bonus.spelldescriptordrain.val,
    };
    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellExtraDrain: { spellDescriptor: spellDescriptorDrain },
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellExtraDrain === undefined) {
        spellAndMagicOption.spellModifiers.spellExtraDrain = {
          spellDescriptor: spellDescriptorDrain,
        };
      } else {
        spellAndMagicOption.spellModifiers.spellExtraDrain.spellDescriptor =
          spellDescriptorDrain;
      }
    }
  }
  if ("spellcategorydrain" in bonus && bonus.spellcategorydrain !== undefined) {
    checkProp("spellcategorydrain");
    const spellXmlCategory = bonus.spellcategorydrain.category;
    let spellCategory;
    if (spellXmlCategory === undefined) {
      assert(bonus.limitspellcategory !== undefined);
      spellCategory = "MatchLimitSpellCategory" as const;
    } else {
      spellCategory = convertSpellCategory(spellXmlCategory);
    }
    const spellCategoryDrain = {
      spellCategoryRequired: spellCategory,
      extraDrain: bonus.spellcategorydrain.val,
    };

    if (spellAndMagicOption.spellModifiers === undefined) {
      spellAndMagicOption.spellModifiers = {
        spellExtraDrain: { spellCategory: spellCategoryDrain },
      };
    } else {
      if (spellAndMagicOption.spellModifiers.spellExtraDrain === undefined) {
        spellAndMagicOption.spellModifiers.spellExtraDrain = {
          spellCategory: spellCategoryDrain,
        };
      } else {
        spellAndMagicOption.spellModifiers.spellExtraDrain.spellCategory =
          spellCategoryDrain;
      }
    }
  }
  if ("limitspellcategory" in bonus && bonus.limitspellcategory !== undefined) {
    checkProp("limitspellcategory");
    let limitSpellCategoryFullList;
    const limitSpellCategory = bonus.limitspellcategory;
    if (
      typeof limitSpellCategory === "object" &&
      !Array.isArray(limitSpellCategory)
    ) {
      limitSpellCategoryFullList = [
        {
          selectCategory: true as const,
        },
        {
          category: convertSpellCategory(limitSpellCategory._exclude),
        },
      ];
    } else {
      if (Array.isArray(limitSpellCategory)) {
        limitSpellCategoryFullList = limitSpellCategory.map((category) => {
          return {
            category: convertSpellCategory(category),
          };
        });
      } else {
        limitSpellCategoryFullList =
          limitSpellCategory === ""
            ? [{ selectCategory: true as const }]
            : [{ category: convertSpellCategory(limitSpellCategory) }];
      }
    }
    spellAndMagicOption.limitSpellOptionsToCategoryList =
      limitSpellCategoryFullList;
  }
  if ("addmetamagic" in bonus && bonus.addmetamagic !== undefined) {
    checkProp("addmetamagic");
    const metamagicXmlList = Array.isArray(bonus.addmetamagic)
      ? bonus.addmetamagic
      : [bonus.addmetamagic];
    const metamagicList = metamagicXmlList.map((metamagic) => {
      return metamagic.xmltext;
    });
    if (spellAndMagicOption.addMetamagicList === undefined) {
      spellAndMagicOption.addMetamagicList = metamagicList;
    } else {
      spellAndMagicOption.addMetamagicList =
        spellAndMagicOption.addMetamagicList.concat(metamagicList);
    }
  }
  if ("metamagiclimit" in bonus && bonus.metamagiclimit !== undefined) {
    checkProp("metamagiclimit");
    spellAndMagicOption.metamagicChoiceOrderRestriction =
      bonus.metamagiclimit.metamagic.map((metamagic) => {
        const grade = parseInt(metamagic._grade);
        assert(!isNaN(grade));
        return {
          metamagic: metamagic.xmltext,
          initiationOrder: grade,
        };
      });
  }
  if ("penaltyfreesustain" in bonus && bonus.penaltyfreesustain !== undefined) {
    checkProp("penaltyfreesustain");
    spellAndMagicOption.penaltyFreeSustainCount = convertRatingCalculation(
      bonus.penaltyfreesustain.count
    );
  }
  if ("allowspellrange" in bonus && bonus.allowspellrange !== undefined) {
    checkProp("allowspellrange");
    const allowSpellRangeXmlList = Array.isArray(bonus.allowspellrange)
      ? bonus.allowspellrange
      : [bonus.allowspellrange];
    const allowSpellRangeList = allowSpellRangeXmlList.map(
      (allowSpellRange) => {
        return convertSpellPowerRange(
          allowSpellRange as SpellPowerXmlRangeType
        );
      }
    );
    if (spellAndMagicOption.unlockSpellList === undefined) {
      spellAndMagicOption.unlockSpellList = [
        { allowSpellRangeList: allowSpellRangeList },
      ];
    } else {
      spellAndMagicOption.unlockSpellList.push({
        allowSpellRangeList: allowSpellRangeList,
      });
    }
  }
  if ("newspellkarmacost" in bonus && bonus.newspellkarmacost !== undefined) {
    checkProp("newspellkarmacost");
    let spellCategory;
    switch (bonus.newspellkarmacost._type) {
      case "Spells":
        spellCategory = magicalFormulaeCategoryEnum.Spell;
        break;
      case "Rituals":
        spellCategory = magicalFormulaeCategoryEnum.Ritual;
        break;
      case "Alchemical":
        spellCategory = magicalFormulaeCategoryEnum.AlchemicalPreparation;
        break;
      default:
        assert(false, bonus.newspellkarmacost._type);
    }
    spellAndMagicOption.newSpellKarmaCostModification = {
      spellCategory: spellCategory,
      modifier: bonus.newspellkarmacost.xmltext,
    };
  }
  if (
    "focusbindingkarmacost" in bonus &&
    bonus.focusbindingkarmacost !== undefined
  ) {
    checkProp("focusbindingkarmacost");
    const focusKarmaCostArray = Array.isArray(bonus.focusbindingkarmacost)
      ? bonus.focusbindingkarmacost
      : [bonus.focusbindingkarmacost];
    spellAndMagicOption.focusBindingKarmaCostModificationList =
      focusKarmaCostArray.map((karmaCost) => {
        const wordList = karmaCost.name.split(" ");
        assert(wordList.length >= 2, karmaCost.name);
        const focusType = wordList[0];
        assert(
          Object.values(focusTypeEnum).includes(focusType as focusTypeEnum),
          focusType
        );
        return {
          focusType: focusType as focusTypeEnum,
          modifier: karmaCost.val,
          ...(karmaCost.extracontains !== undefined && {
            focusSubtypeText: karmaCost.extracontains,
          }),
        };
      });
  }
  if ("drainvalue" in bonus && bonus.drainvalue !== undefined) {
    checkProp("drainvalue");
    spellAndMagicOption.drainModification = bonus.drainvalue;
  }
  if ("addspirit" in bonus && bonus.addspirit !== undefined) {
    checkProp("addspirit");
    const addSpirits = Array.isArray(bonus.addspirit)
      ? bonus.addspirit
      : [bonus.addspirit];
    assert(addSpirits.length > 0);
    spellAndMagicOption.addSpiritOptionList = [];
    addSpirits.forEach((spirit) => {
      let newSpiritList;
      if (typeof spirit === "string") {
        assert(spirit === "", JSON.stringify(spirit));
        newSpiritList = [
          {
            selectSpirit: true as const,
          },
        ];
      } else if (Array.isArray(spirit.spirit)) {
        newSpiritList = spirit.spirit.map((spiritName) => {
          return {
            name: spiritName,
          };
        });
      } else {
        newSpiritList = [
          {
            name: spirit.spirit,
          },
        ];
      }
      spellAndMagicOption.addSpiritOptionList = newSpiritList;
    });
  }
  if (
    "limitspiritcategory" in bonus &&
    bonus.limitspiritcategory !== undefined
  ) {
    checkProp("limitspiritcategory");
    const limitSpiritCategoryList = Array.isArray(bonus.limitspiritcategory)
      ? bonus.limitspiritcategory
      : [bonus.limitspiritcategory];

    spellAndMagicOption.limitSpiritOptionsToList = limitSpiritCategoryList.map(
      (category) => {
        return category === ""
          ? { selectCategory: true as const }
          : typeof category === "object"
          ? { spirit: category.spirit }
          : { category: convertSpellCategory(category) };
      }
    );
  }
  if ("selectmentorspirit" in bonus && bonus.selectmentorspirit !== undefined) {
    checkProp("selectmentorspirit");
    assert(spellAndMagicOption.linkMentorSpirit === undefined);
    const linkMentorSpirit = bonus.selectmentorspirit;
    assert(linkMentorSpirit === "");
    spellAndMagicOption.linkMentorSpirit = true;
  }
  if ("selecttradition" in bonus && bonus.selecttradition !== undefined) {
    checkProp("selecttradition");
    assert(spellAndMagicOption.linkTradition === undefined);
    const linkTradition = bonus.selecttradition;
    assert(linkTradition === "");
    spellAndMagicOption.linkTradition = true;
  }
  if ("fadingvalue" in bonus && bonus.fadingvalue !== undefined) {
    checkProp("fadingvalue");
    if (typeof bonus.fadingvalue === "number") {
      spellAndMagicOption.fadingModificationList = [
        {
          modifier: bonus.fadingvalue,
        },
      ];
    } else {
      spellAndMagicOption.fadingModificationList = bonus.fadingvalue.map(
        (fading) => {
          return {
            modifier: fading.xmltext,
            specificComplexForm: fading._specific,
          };
        }
      );
    }
  }
  if ("selectsprite" in bonus && bonus.selectsprite !== undefined) {
    checkProp("selectsprite");
    assert(bonus.selectsprite === "");
    assert(spellAndMagicOption.linkSprite === undefined);
    spellAndMagicOption.linkSprite = true;
  }
  if ("selectparagon" in bonus && bonus.selectparagon !== undefined) {
    checkProp("selectparagon");
    assert(bonus.selectparagon === "");
    assert(spellAndMagicOption.linkParagon === undefined);
    spellAndMagicOption.linkParagon = true;
  }
  if ("addecho" in bonus && bonus.addecho !== undefined) {
    checkProp("addecho");
    spellAndMagicOption.addEcho = bonus.addecho;
  }
  if ("livingpersona" in bonus && bonus.livingpersona !== undefined) {
    checkProp("livingpersona");
    spellAndMagicOption.livingPersonaModification = {
      ...(bonus.livingpersona.attack !== undefined && {
        attack: bonus.livingpersona.attack,
      }),
      ...(bonus.livingpersona.dataprocessing !== undefined && {
        dataProcessing: bonus.livingpersona.dataprocessing,
      }),
      ...(bonus.livingpersona.firewall !== undefined && {
        firewall: bonus.livingpersona.firewall,
      }),
      ...(bonus.livingpersona.sleaze !== undefined && {
        sleaze: bonus.livingpersona.sleaze,
      }),
    };
  }
  if (
    "specialattburnmultiplier" in bonus &&
    bonus.specialattburnmultiplier !== undefined
  ) {
    checkProp("specialattburnmultiplier");
    spellAndMagicOption.resonanceLossDueToAugmentationModificationPercentageIncrease =
      bonus.specialattburnmultiplier;
  }

  // Combat and Weapon Bonuses
  // --------------------------------------------------------------------------------------------
  if ("addweapon" in bonus && bonus.addweapon !== undefined) {
    checkProp("addweapon");
    combatAndWeaponOption.addWeaponList = [{ name: bonus.addweapon.name }];
  }
  if ("selectweapon" in bonus && bonus.selectweapon !== undefined) {
    checkProp("selectweapon");
    assert(combatAndWeaponOption.linkWeapon === undefined);
    const linkWeapon = bonus.selectweapon;
    if (typeof linkWeapon === "string") {
      assert(linkWeapon === "");
      combatAndWeaponOption.linkWeapon = { restrictions: false };
    } else {
      // TODO: maybe combine with addWeapon??

      const match = WeaponDetails.match(linkWeapon._weapondetails.toString());
      if (match.failed()) {
        assert(false, match.message);
      }

      combatAndWeaponOption.linkWeapon = {
        restrictions: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        weaponRequirements: bonusWeaponDetailsSemantics(match).eval(),
      };
    }
  }
  if ("naturalweapon" in bonus && bonus.naturalweapon !== undefined) {
    checkProp("naturalweapon");
    if (Array.isArray(bonus.naturalweapon)) {
      combatAndWeaponOption.addWeaponList = bonus.naturalweapon.map(
        (naturalWeapon) => {
          return {
            naturalWeapon: convertNaturalWeapon(naturalWeapon),
          };
        }
      );
    } else {
      combatAndWeaponOption.addWeaponList = [
        {
          naturalWeapon: convertNaturalWeapon(bonus.naturalweapon),
        },
      ];
    }
  }
  if ("weaponspecificdice" in bonus && bonus.weaponspecificdice !== undefined) {
    checkProp("weaponspecificdice");
    const specificWeaponBonus =
      bonus.weaponspecificdice.xmltext === "Rating"
        ? { option: bonus.weaponspecificdice.xmltext }
        : bonus.weaponspecificdice.xmltext;
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.specificWeaponDicePoolModifier = {
      modifier: specificWeaponBonus,
      weaponCategory: weaponTypeConversion(bonus.weaponspecificdice._type),
    };
  }
  if ("weaponaccuracy" in bonus && bonus.weaponaccuracy !== undefined) {
    checkProp("weaponaccuracy");
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.weaponLimitModifier = {
      weapon: bonus.weaponaccuracy.name,
      modifier: bonus.weaponaccuracy.value,
    };
  }
  if (
    "weaponskillaccuracy" in bonus &&
    bonus.weaponskillaccuracy !== undefined
  ) {
    checkProp("weaponskillaccuracy");
    const weaponSkillAccuracyXMLList = bonus.weaponskillaccuracy;
    const weaponSkillAccuracyList = [];
    if (Array.isArray(weaponSkillAccuracyXMLList)) {
      for (const weaponSkillAccuracy of weaponSkillAccuracyXMLList) {
        weaponSkillAccuracyList.push({
          skill: convertWeaponSkillAccuracy(weaponSkillAccuracy),
          bonus: weaponSkillAccuracy.value,
        });
      }
    } else {
      weaponSkillAccuracyList.push({
        skill: convertWeaponSkillAccuracy(weaponSkillAccuracyXMLList),
        bonus: weaponSkillAccuracyXMLList.value,
      });
    }
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.weaponSkillAccuracyList =
      weaponSkillAccuracyList;
  }
  if ("weaponcategorydv" in bonus && bonus.weaponcategorydv !== undefined) {
    checkProp("weaponcategorydv");
    const linkSkill = bonus.weaponcategorydv.selectskill;
    assert(linkSkill !== "");
    const selectSkillBase = getSkillSelectionOptions(linkSkill);

    assert(
      linkSkill.disablespecializationeffects === undefined,
      linkSkill.disablespecializationeffects
    );
    assert(linkSkill._prompt === undefined, linkSkill._prompt);
    assert(linkSkill.applytorating === undefined, linkSkill.applytorating);
    assert(linkSkill.max === undefined, `${linkSkill.max}`);
    assert(linkSkill.val === undefined, `${linkSkill.val}`);
    if (combatAndWeaponOption.damageValueModifiers === undefined) {
      combatAndWeaponOption.damageValueModifiers = {};
    }
    combatAndWeaponOption.damageValueModifiers.weaponSkillDamage = {
      selectionOptions: selectSkillBase,
      bonus: bonus.weaponcategorydv.bonus,
    };
  }
  if ("weaponcategorydice" in bonus && bonus.weaponcategorydice !== undefined) {
    checkProp("weaponcategorydice");
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.weaponCategoryDicePoolModifier = {
      category: bonus.weaponcategorydice.category.name,
      modifier: bonus.weaponcategorydice.category.value,
    };
  }
  if ("throwstr" in bonus && bonus.throwstr !== undefined) {
    checkProp("throwstr");
    if (combatAndWeaponOption.damageValueModifiers === undefined) {
      combatAndWeaponOption.damageValueModifiers = {};
    }
    combatAndWeaponOption.damageValueModifiers.thrownWeaponModifier =
      bonus.throwstr;
  }
  if ("throwrangestr" in bonus && bonus.throwrangestr !== undefined) {
    checkProp("throwrangestr");
    if (combatAndWeaponOption.rangeModifiers === undefined) {
      combatAndWeaponOption.rangeModifiers = {};
    }
    combatAndWeaponOption.rangeModifiers.thrownWeaponRangeModifier =
      convertRatingCalculation(bonus.throwrangestr.toString());
  }
  if ("smartlink" in bonus && bonus.smartlink !== undefined) {
    checkProp("smartlink");
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.smartLinkModifier = bonus.smartlink;
  }
  if ("selectarmor" in bonus && bonus.selectarmor !== undefined) {
    checkProp("selectarmor");
    assert(combatAndWeaponOption.linkArmour === undefined);
    combatAndWeaponOption.linkArmour = true;
  }
  if ("armor" in bonus && bonus.armor !== undefined) {
    checkProp("armor");
    const armour =
      typeof bonus.armor === "number"
        ? bonus.armor
        : typeof bonus.armor === "string"
        ? { option: "Rating" as const }
        : typeof bonus.armor.xmltext === "number"
        ? bonus.armor.xmltext
        : { option: bonus.armor.xmltext };

    if (combatAndWeaponOption.armourModifiers === undefined) {
      combatAndWeaponOption.armourModifiers = {};
    }
    combatAndWeaponOption.armourModifiers.armour = {
      bonus: armour,
      ...(typeof bonus.armor === "object" && { nonStacking: true }),
    };
  }
  if ("firearmor" in bonus && bonus.firearmor !== undefined) {
    checkProp("firearmor");
    const fireArmour =
      typeof bonus.firearmor === "number"
        ? bonus.firearmor
        : { option: bonus.firearmor };
    if (combatAndWeaponOption.armourModifiers === undefined) {
      combatAndWeaponOption.armourModifiers = {};
    }
    combatAndWeaponOption.armourModifiers.fireArmour = fireArmour;
  }
  if ("electricityarmor" in bonus && bonus.electricityarmor !== undefined) {
    checkProp("electricityarmor");
    const electricityArmour =
      typeof bonus.electricityarmor === "number"
        ? bonus.electricityarmor
        : { option: bonus.electricityarmor };
    if (combatAndWeaponOption.armourModifiers === undefined) {
      combatAndWeaponOption.armourModifiers = {};
    }
    combatAndWeaponOption.armourModifiers.electricityArmour = electricityArmour;
  }
  if ("coldarmor" in bonus && bonus.coldarmor !== undefined) {
    checkProp("coldarmor");
    const coldArmour =
      typeof bonus.coldarmor === "number"
        ? bonus.coldarmor
        : { option: bonus.coldarmor };
    if (combatAndWeaponOption.armourModifiers === undefined) {
      combatAndWeaponOption.armourModifiers = {};
    }
    combatAndWeaponOption.armourModifiers.coldArmour = coldArmour;
  }
  if ("defensetest" in bonus && bonus.defensetest !== undefined) {
    checkProp("defensetest");
    combatAndWeaponOption.defenseTestModifier = [bonus.defensetest];
  }
  if ("dodge" in bonus && bonus.dodge !== undefined) {
    checkProp("dodge");
    assert(bonus.defensetest === undefined);
    combatAndWeaponOption.defenseTestModifier = [
      convertRatingUnion(bonus.dodge),
    ];
  }
  if ("unarmeddv" in bonus && bonus.unarmeddv !== undefined) {
    checkProp("unarmeddv");
    if (combatAndWeaponOption.damageValueModifiers === undefined) {
      combatAndWeaponOption.damageValueModifiers = {};
    }
    combatAndWeaponOption.damageValueModifiers.unarmedModifier =
      convertRatingCalculation(bonus.unarmeddv);
  }
  if ("unarmeddvphysical" in bonus && bonus.unarmeddvphysical !== undefined) {
    checkProp("unarmeddvphysical");
    combatAndWeaponOption.unarmedDamageType = damageTypeEnum.Physical;
  }
  if ("unarmedap" in bonus && bonus.unarmedap !== undefined) {
    checkProp("unarmedap");
    if (combatAndWeaponOption.attackModifiers === undefined) {
      combatAndWeaponOption.attackModifiers = {};
    }
    combatAndWeaponOption.attackModifiers.unarmedModifier =
      convertRatingCalculation(bonus.unarmedap);
  }
  if ("unarmedreach" in bonus && bonus.unarmedreach !== undefined) {
    checkProp("unarmedreach");
    if (combatAndWeaponOption.rangeModifiers === undefined) {
      combatAndWeaponOption.rangeModifiers = {};
    }
    combatAndWeaponOption.rangeModifiers.unarmedReach = bonus.unarmedreach;
  }
  if ("reach" in bonus && bonus.reach !== undefined) {
    checkProp("reach");
    if (combatAndWeaponOption.rangeModifiers === undefined) {
      combatAndWeaponOption.rangeModifiers = {};
    }
    let reach;
    if (typeof bonus.reach === "number") {
      reach = { modifier: bonus.reach };
    } else {
      assert(
        Object.keys(bonus.reach).length === 2,
        JSON.stringify(bonus.reach)
      );
      assert("_name" in bonus.reach);
      assert("xmltext" in bonus.reach);
      assert(typeof bonus.reach.xmltext === "number");
      reach = { weaponName: bonus.reach._name, modifier: bonus.reach.xmltext };
    }
    combatAndWeaponOption.rangeModifiers.reach = reach;
  }
  if ("martialart" in bonus && bonus.martialart !== undefined) {
    checkProp("martialart");
    combatAndWeaponOption.addMartialArt = bonus.martialart;
  }
  if ("damageresistance" in bonus && bonus.damageresistance !== undefined) {
    checkProp("damageresistance");
    const damageResistance =
      typeof bonus.damageresistance === "number"
        ? bonus.damageresistance
        : { option: bonus.damageresistance };
    if (combatAndWeaponOption.damageResistanceModifiers === undefined) {
      combatAndWeaponOption.damageResistanceModifiers = {};
    }
    combatAndWeaponOption.damageResistanceModifiers.damageResistance =
      damageResistance;
  }
  if ("radiationresist" in bonus && bonus.radiationresist !== undefined) {
    checkProp("radiationresist");
    const radiationResistance =
      typeof bonus.radiationresist === "number"
        ? bonus.radiationresist
        : { option: bonus.radiationresist };
    if (combatAndWeaponOption.damageResistanceModifiers === undefined) {
      combatAndWeaponOption.damageResistanceModifiers = {};
    }
    combatAndWeaponOption.damageResistanceModifiers.radiationResistance =
      radiationResistance;
  }
  if ("sonicresist" in bonus && bonus.sonicresist !== undefined) {
    checkProp("sonicresist");
    const sonicResistance =
      typeof bonus.sonicresist === "number"
        ? bonus.sonicresist
        : { option: bonus.sonicresist };
    if (combatAndWeaponOption.damageResistanceModifiers === undefined) {
      combatAndWeaponOption.damageResistanceModifiers = {};
    }
    combatAndWeaponOption.damageResistanceModifiers.sonicResistance =
      sonicResistance;
  }
  if ("toxincontactresist" in bonus && bonus.toxincontactresist !== undefined) {
    checkProp("toxincontactresist");
    const toxinContactResist =
      typeof bonus.toxincontactresist === "number"
        ? bonus.toxincontactresist
        : { option: bonus.toxincontactresist };
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.toxinContactResist =
      toxinContactResist;
  }
  if (
    "pathogencontactresist" in bonus &&
    bonus.pathogencontactresist !== undefined
  ) {
    checkProp("pathogencontactresist");
    const pathogenContactResist =
      typeof bonus.pathogencontactresist === "number"
        ? bonus.pathogencontactresist
        : { option: bonus.pathogencontactresist };
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.pathogenContactResist =
      pathogenContactResist;
  }
  if ("toxincontactimmune" in bonus && bonus.toxincontactimmune !== undefined) {
    checkProp("toxincontactimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.toxinContactImmune = true;
  }
  if (
    "pathogencontactimmune" in bonus &&
    bonus.pathogencontactimmune !== undefined
  ) {
    checkProp("pathogencontactimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.pathogenContactImmune = true;
  }
  if (
    "toxininhalationresist" in bonus &&
    bonus.toxininhalationresist !== undefined
  ) {
    checkProp("toxininhalationresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const toxinInhalationResist =
      typeof bonus.toxininhalationresist === "number"
        ? bonus.toxininhalationresist
        : { option: bonus.toxininhalationresist };
    combatAndWeaponOption.toxinAndPathogen.toxinInhalationResist =
      toxinInhalationResist;
  }
  if (
    "pathogeninhalationresist" in bonus &&
    bonus.pathogeninhalationresist !== undefined
  ) {
    checkProp("pathogeninhalationresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const pathogenInhalationResist =
      typeof bonus.pathogeninhalationresist === "number"
        ? bonus.pathogeninhalationresist
        : { option: bonus.pathogeninhalationresist };
    combatAndWeaponOption.toxinAndPathogen.pathogenInhalationResist =
      pathogenInhalationResist;
  }
  if (
    "toxininhalationimmune" in bonus &&
    bonus.toxininhalationimmune !== undefined
  ) {
    checkProp("toxininhalationimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.toxinInhalationImmune = true;
  }
  if (
    "pathogeninhalationimmune" in bonus &&
    bonus.pathogeninhalationimmune !== undefined
  ) {
    checkProp("pathogeninhalationimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.pathogenInhalationImmune = true;
  }
  if (
    "toxiningestionresist" in bonus &&
    bonus.toxiningestionresist !== undefined
  ) {
    checkProp("toxiningestionresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const toxinIngestionResist =
      typeof bonus.toxiningestionresist === "number"
        ? bonus.toxiningestionresist
        : { option: bonus.toxiningestionresist };
    combatAndWeaponOption.toxinAndPathogen.toxinIngestionResist =
      toxinIngestionResist;
  }
  if (
    "pathogeningestionresist" in bonus &&
    bonus.pathogeningestionresist !== undefined
  ) {
    checkProp("pathogeningestionresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const pathogenIngestionResist =
      typeof bonus.pathogeningestionresist === "number"
        ? bonus.pathogeningestionresist
        : { option: bonus.pathogeningestionresist };
    combatAndWeaponOption.toxinAndPathogen.pathogenIngestionResist =
      pathogenIngestionResist;
  }
  if (
    "toxiningestionimmune" in bonus &&
    bonus.toxiningestionimmune !== undefined
  ) {
    checkProp("toxiningestionimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.toxinIngestionImmune = true;
  }
  if (
    "pathogeningestionimmune" in bonus &&
    bonus.pathogeningestionimmune !== undefined
  ) {
    checkProp("pathogeningestionimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.pathogenIngestionImmune = true;
  }
  if (
    "toxininjectionresist" in bonus &&
    bonus.toxininjectionresist !== undefined
  ) {
    checkProp("toxininjectionresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const toxinInjectionResist =
      typeof bonus.toxininjectionresist === "number"
        ? bonus.toxininjectionresist
        : { option: bonus.toxininjectionresist };
    combatAndWeaponOption.toxinAndPathogen.toxinInjectionResist =
      toxinInjectionResist;
  }
  if (
    "pathogeninjectionresist" in bonus &&
    bonus.pathogeninjectionresist !== undefined
  ) {
    checkProp("pathogeninjectionresist");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    const pathogenInjectionResist =
      typeof bonus.pathogeninjectionresist === "number"
        ? bonus.pathogeninjectionresist
        : { option: bonus.pathogeninjectionresist };
    combatAndWeaponOption.toxinAndPathogen.pathogenInjectionResist =
      pathogenInjectionResist;
  }
  if (
    "toxininjectionimmune" in bonus &&
    bonus.toxininjectionimmune !== undefined
  ) {
    checkProp("toxininjectionimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.toxinInjectionImmune = true;
  }
  if (
    "pathogeninjectionimmune" in bonus &&
    bonus.pathogeninjectionimmune !== undefined
  ) {
    checkProp("pathogeninjectionimmune");
    if (combatAndWeaponOption.toxinAndPathogen === undefined) {
      combatAndWeaponOption.toxinAndPathogen = {};
    }
    combatAndWeaponOption.toxinAndPathogen.pathogenInjectionImmune = true;
  }

  // Condition and Recovery
  // --------------------------------------------------------------------------------------------
  if ("conditionmonitor" in bonus && bonus.conditionmonitor !== undefined) {
    checkProp("conditionmonitor");
    const conditionMonitor = bonus.conditionmonitor;
    if (
      "sharedthresholdoffset" in conditionMonitor &&
      conditionMonitor.sharedthresholdoffset !== undefined
    ) {
      const ignoreConditionModifierNegativeEffects =
        typeof conditionMonitor.sharedthresholdoffset === "number"
          ? conditionMonitor.sharedthresholdoffset
          : { option: conditionMonitor.sharedthresholdoffset };
      conditionAndRecoveryOption.conditionModifierNegativeEffectsOffsetShared =
        ignoreConditionModifierNegativeEffects;
    }
    if (
      "thresholdoffset" in conditionMonitor &&
      conditionMonitor.thresholdoffset !== undefined
    ) {
      const ignoreConditionModifierNegativeEffects =
        typeof conditionMonitor.thresholdoffset === "number"
          ? conditionMonitor.thresholdoffset
          : { option: conditionMonitor.thresholdoffset };
      conditionAndRecoveryOption.conditionModifierNegativeEffectsOffsetPerTrack =
        ignoreConditionModifierNegativeEffects;
    }
    if (
      "threshold" in conditionMonitor &&
      conditionMonitor.threshold !== undefined
    ) {
      conditionAndRecoveryOption.conditionModifierBoxesPerLevelModifier =
        conditionMonitor.threshold;
    }
    if (
      "physical" in conditionMonitor &&
      conditionMonitor.physical !== undefined
    ) {
      if (conditionMonitor.physical === "Rating") {
        conditionAndRecoveryOption.addPhysicalTrackBoxes = {
          option: "Rating",
        };
      } else if (conditionMonitor.physical === "-Rating") {
        conditionAndRecoveryOption.addPhysicalTrackBoxes = {
          option: "-Rating",
        };
      } else {
        conditionAndRecoveryOption.addPhysicalTrackBoxes =
          conditionMonitor.physical;
      }
    }
    if ("stun" in conditionMonitor && conditionMonitor.stun !== undefined) {
      if (conditionMonitor.stun === "Rating") {
        conditionAndRecoveryOption.addStunTrackBoxes = {
          option: "Rating",
        };
      } else if (conditionMonitor.physical === "-Rating") {
        conditionAndRecoveryOption.addStunTrackBoxes = {
          option: "-Rating",
        };
      } else {
        conditionAndRecoveryOption.addStunTrackBoxes = conditionMonitor.stun;
      }
    }
    if (conditionMonitor.overflow !== undefined) {
      conditionAndRecoveryOption.addOverflowBoxes = conditionMonitor.overflow;
    }
  }
  if ("stuncmrecovery" in bonus && bonus.stuncmrecovery !== undefined) {
    checkProp("stuncmrecovery");
    const stunHealing =
      typeof bonus.stuncmrecovery === "number"
        ? bonus.stuncmrecovery
        : { option: bonus.stuncmrecovery };
    conditionAndRecoveryOption.stunConditionModifierHealingDiceModifier =
      stunHealing;
  }
  if ("physicalcmrecovery" in bonus && bonus.physicalcmrecovery !== undefined) {
    checkProp("physicalcmrecovery");
    const physicalHealing =
      typeof bonus.physicalcmrecovery === "number"
        ? bonus.physicalcmrecovery
        : { option: bonus.physicalcmrecovery };
    conditionAndRecoveryOption.physicalConditionModifierHealingDiceModifier =
      physicalHealing;
  }
  if (
    "addesstophysicalcmrecovery" in bonus &&
    bonus.addesstophysicalcmrecovery !== undefined
  ) {
    checkProp("addesstophysicalcmrecovery");
    conditionAndRecoveryOption.addEssenceToPhysicalConditionMonitorRecovery =
      true;
  }
  if (
    "addesstostuncmrecovery" in bonus &&
    bonus.addesstostuncmrecovery !== undefined
  ) {
    checkProp("addesstostuncmrecovery");
    conditionAndRecoveryOption.addEssenceToStunConditionMonitorRecovery = true;
  }
  // Addiction and Psychological Effects
  // -----------------------------------
  {
    // addiction scope
    let physiologicalInitial, physiologicalProgressing;
    let psychologicalInitial, psychologicalProgressing;

    if (
      "physiologicaladdictionfirsttime" in bonus &&
      bonus.physiologicaladdictionfirsttime !== undefined
    ) {
      checkProp("physiologicaladdictionfirsttime");
      physiologicalInitial = convertRatingUnion(
        bonus.physiologicaladdictionfirsttime
      );
    }
    if (
      "physiologicaladdictionalreadyaddicted" in bonus &&
      bonus.physiologicaladdictionalreadyaddicted !== undefined
    ) {
      checkProp("physiologicaladdictionalreadyaddicted");
      physiologicalProgressing = convertRatingUnion(
        bonus.physiologicaladdictionalreadyaddicted
      );
    }
    const physiological =
      physiologicalInitial !== undefined ||
      physiologicalProgressing !== undefined
        ? {
            initialTest:
              physiologicalInitial !== undefined ? physiologicalInitial : 0,
            progressingTest:
              physiologicalProgressing !== undefined
                ? physiologicalProgressing
                : 0,
          }
        : undefined;

    if (
      "psychologicaladdictionfirsttime" in bonus &&
      bonus.psychologicaladdictionfirsttime !== undefined
    ) {
      checkProp("psychologicaladdictionfirsttime");
      psychologicalInitial = convertRatingUnion(
        bonus.psychologicaladdictionfirsttime
      );
    }
    if (
      "psychologicaladdictionalreadyaddicted" in bonus &&
      bonus.psychologicaladdictionalreadyaddicted !== undefined
    ) {
      checkProp("psychologicaladdictionalreadyaddicted");
    }
    const psychological =
      psychologicalInitial !== undefined ||
      psychologicalProgressing !== undefined
        ? {
            initialTest:
              psychologicalInitial !== undefined ? psychologicalInitial : 0,
            progressingTest:
              psychologicalProgressing !== undefined
                ? psychologicalProgressing
                : 0,
          }
        : undefined;

    if (physiological !== undefined || psychological !== undefined) {
      conditionAndRecoveryOption.addictionResistance = {
        ...(physiological !== undefined && { physiological: physiological }),
        ...(psychological !== undefined && { psychological: psychological }),
      };
    }
  }

  // Movement and Lifestyle
  // --------------------------------------------------------------------------------------------
  if ("movementreplace" in bonus && bonus.movementreplace !== undefined) {
    checkProp("movementreplace");
    const movementReplaceList = Array.isArray(bonus.movementreplace)
      ? bonus.movementreplace
      : [bonus.movementreplace];
    for (const movement of movementReplaceList) {
      if (movement.category === "Ground") {
        movementAndLifestyleOption.groundBaseMovementReplacement =
          movementReplaceConverter(
            movement,
            movementAndLifestyleOption.groundBaseMovementReplacement
          );
      } else if (movement.category === "Swim") {
        movementAndLifestyleOption.swimBaseMovementReplacement =
          movementReplaceConverter(
            movement,
            movementAndLifestyleOption.swimBaseMovementReplacement
          );
      } else if (movement.category === "Fly") {
        movementAndLifestyleOption.flyBaseMovementReplacement =
          movementReplaceConverter(
            movement,
            movementAndLifestyleOption.flyBaseMovementReplacement
          );
      }
    }
  }
  if ("walkmultiplier" in bonus && bonus.walkmultiplier !== undefined) {
    checkProp("walkmultiplier");
    if (Array.isArray(bonus.walkmultiplier)) {
      assert(bonus.walkmultiplier.length === 2);

      let percentage: number;
      if (bonus.walkmultiplier[0].percent != null) {
        assert(bonus.walkmultiplier[0].val === undefined);
        percentage = bonus.walkmultiplier[0].percent;
      } else {
        assert(bonus.walkmultiplier[0].val !== undefined);
        assert(bonus.walkmultiplier[0].percent === undefined);
        percentage = bonus.walkmultiplier[0].val * 100;
      }
      if (bonus.walkmultiplier[0].category === "Swim") {
        movementAndLifestyleOption.swimSpeedPercentageModifier = percentage;
      } else {
        movementAndLifestyleOption.walkSpeedPercentageModifier = percentage;
      }

      // second multiplier
      if (bonus.walkmultiplier[1].percent != null) {
        assert(bonus.walkmultiplier[1].val === undefined);
        percentage = bonus.walkmultiplier[1].percent;
      } else {
        assert(bonus.walkmultiplier[1].val !== undefined);
        assert(bonus.walkmultiplier[1].percent === undefined);
        percentage = bonus.walkmultiplier[1].val * 100;
      }
      if (bonus.walkmultiplier[1].category === "Swim") {
        movementAndLifestyleOption.swimSpeedPercentageModifier = percentage;
      } else {
        movementAndLifestyleOption.walkSpeedPercentageModifier = percentage;
      }
    } else {
      let percentage: number;
      if (bonus.walkmultiplier.percent != null) {
        assert(bonus.walkmultiplier.val === undefined);
        percentage = bonus.walkmultiplier.percent;
      } else {
        assert(bonus.walkmultiplier.val !== undefined);
        assert(bonus.walkmultiplier.percent === undefined);
        percentage = bonus.walkmultiplier.val * 100;
      }
      if (bonus.walkmultiplier.category === "Swim") {
        movementAndLifestyleOption.swimSpeedPercentageModifier = percentage;
      } else {
        movementAndLifestyleOption.walkSpeedPercentageModifier = percentage;
      }
    }
  }
  if ("runmultiplier" in bonus && bonus.runmultiplier !== undefined) {
    checkProp("runmultiplier");
    let percentage: number;
    if (bonus.runmultiplier.percent != null) {
      assert(bonus.runmultiplier.val === undefined);
      percentage = bonus.runmultiplier.percent;
    } else {
      assert(bonus.runmultiplier.val !== undefined);
      assert(bonus.runmultiplier.percent === undefined);
      percentage = bonus.runmultiplier.val * 100;
    }
    movementAndLifestyleOption.runSpeedPercentageModifier = percentage;
  }
  if ("sprintbonus" in bonus && bonus.sprintbonus !== undefined) {
    checkProp("sprintbonus");
    let percentage: number;
    if (bonus.sprintbonus.percent != null) {
      assert(bonus.sprintbonus.val === undefined);
      percentage = bonus.sprintbonus.percent;
    } else {
      assert(bonus.sprintbonus.val !== undefined);
      assert(bonus.sprintbonus.percent === undefined);
      percentage = bonus.sprintbonus.val * 100;
    }
    movementAndLifestyleOption.sprintSpeedPercentageModifier = percentage;
  }
  if ("lifestylecost" in bonus && bonus.lifestylecost !== undefined) {
    checkProp("lifestylecost");
    const lifestyleCostArray = Array.isArray(bonus.lifestylecost)
      ? bonus.lifestylecost
      : [bonus.lifestylecost];
    assert(movementAndLifestyleOption.lifestyleCostModifierList == undefined);
    movementAndLifestyleOption.lifestyleCostModifierList =
      lifestyleCostArray.map((lifestyleCost) => {
        if (typeof lifestyleCost === "object") {
          return {
            lifestyle: lifestyleCost._lifestyle,
            cost: lifestyleCost.xmltext,
          };
        } else {
          return { cost: lifestyleCost };
        }
      });
  }
  if ("basiclifestylecost" in bonus && bonus.basiclifestylecost !== undefined) {
    checkProp("basiclifestylecost");
    if (movementAndLifestyleOption.lifestyleCostModifierList == undefined) {
      movementAndLifestyleOption.lifestyleCostModifierList = [];
    } else {
      movementAndLifestyleOption.lifestyleCostModifierList.push({
        basicLifestyle: true,
        cost: bonus.basiclifestylecost,
      });
    }
  }
  if ("availability" in bonus && bonus.availability !== undefined) {
    checkProp("availability");
    movementAndLifestyleOption.availabilityCondition =
      bonus.availability._condition === "career"
        ? bonusConditionEnum.CareerMode
        : bonusConditionEnum.CharacterCreation;
  }

  // Test and Resistance Bonuses
  // --------------------------------------------------------------------------------------------
  if ("composure" in bonus && bonus.composure !== undefined) {
    checkProp("composure");
    testAndResistanceOption.composure = bonus.composure;
  }
  if (
    "judgeintentionsdefense" in bonus &&
    bonus.judgeintentionsdefense !== undefined
  ) {
    checkProp("judgeintentionsdefense");
    const judgeIntentions = convertRatingUnion(bonus.judgeintentionsdefense);
    if (testAndResistanceOption.judgeIntentions === undefined) {
      testAndResistanceOption.judgeIntentions = { defense: judgeIntentions };
    } else {
      testAndResistanceOption.judgeIntentions.defense = judgeIntentions;
    }
  }
  if (
    "judgeintentionsoffense" in bonus &&
    bonus.judgeintentionsoffense !== undefined
  ) {
    checkProp("judgeintentionsoffense");
    const judgeIntentions = convertRatingUnion(bonus.judgeintentionsoffense);
    if (testAndResistanceOption.judgeIntentions === undefined) {
      testAndResistanceOption.judgeIntentions = { offense: judgeIntentions };
    } else {
      testAndResistanceOption.judgeIntentions.offense = judgeIntentions;
    }
  }
  if ("judgeintentions" in bonus && bonus.judgeintentions !== undefined) {
    checkProp("judgeintentions");
    const judgeIntentions = convertRatingUnion(bonus.judgeintentions);
    testAndResistanceOption.judgeIntentions = {
      defense: judgeIntentions,
      offense: judgeIntentions,
    };
  }
  if ("memory" in bonus && bonus.memory !== undefined) {
    checkProp("memory");
    testAndResistanceOption.memory = convertRatingUnion(bonus.memory);
  }
  if ("drainresist" in bonus && bonus.drainresist !== undefined) {
    checkProp("drainresist");
    testAndResistanceOption.drainResist = convertRatingUnion(bonus.drainresist);
  }
  if ("fadingresist" in bonus && bonus.fadingresist !== undefined) {
    checkProp("fadingresist");
    testAndResistanceOption.fadingResist = convertRatingUnion(
      bonus.fadingresist
    );
  }
  if ("spellresistance" in bonus && bonus.spellresistance !== undefined) {
    checkProp("spellresistance");
    testAndResistanceOption.allSpellResist = convertRatingUnion(
      bonus.spellresistance
    );
  }
  if (
    "directmanaspellresist" in bonus &&
    bonus.directmanaspellresist !== undefined
  ) {
    checkProp("directmanaspellresist");
    testAndResistanceOption.directManaResist = convertRatingUnion(
      bonus.directmanaspellresist
    );
  }
  if (
    "detectionspellresist" in bonus &&
    bonus.detectionspellresist !== undefined
  ) {
    checkProp("detectionspellresist");
    testAndResistanceOption.detectionResist = convertRatingUnion(
      bonus.detectionspellresist
    );
  }
  if ("manaillusionresist" in bonus && bonus.manaillusionresist !== undefined) {
    checkProp("manaillusionresist");
    testAndResistanceOption.manaIllusionResist = convertRatingUnion(
      bonus.manaillusionresist
    );
  }
  if (
    "physicalillusionresist" in bonus &&
    bonus.physicalillusionresist !== undefined
  ) {
    checkProp("physicalillusionresist");
    testAndResistanceOption.physicalIllusionResist = convertRatingUnion(
      bonus.physicalillusionresist
    );
  }
  if (
    "mentalmanipulationresist" in bonus &&
    bonus.mentalmanipulationresist !== undefined
  ) {
    checkProp("mentalmanipulationresist");
    testAndResistanceOption.mentalManipulationResist = convertRatingUnion(
      bonus.mentalmanipulationresist
    );
  }
  if ("decreasebodresist" in bonus && bonus.decreasebodresist !== undefined) {
    checkProp("decreasebodresist");
    testAndResistanceOption.decreaseBodyResist = convertRatingUnion(
      bonus.decreasebodresist
    );
  }
  if ("decreaseagiresist" in bonus && bonus.decreaseagiresist !== undefined) {
    checkProp("decreaseagiresist");
    testAndResistanceOption.decreaseAgilityResist = convertRatingUnion(
      bonus.decreaseagiresist
    );
  }
  if ("decreaserearesist" in bonus && bonus.decreaserearesist !== undefined) {
    checkProp("decreaserearesist");
    testAndResistanceOption.decreaseReasonanceResist = convertRatingUnion(
      bonus.decreaserearesist
    );
  }
  if ("decreasestrresist" in bonus && bonus.decreasestrresist !== undefined) {
    checkProp("decreasestrresist");
    testAndResistanceOption.decreaseStrengthResist = convertRatingUnion(
      bonus.decreasestrresist
    );
  }
  if ("decreasecharesist" in bonus && bonus.decreasecharesist !== undefined) {
    checkProp("decreasecharesist");
    testAndResistanceOption.decreaseCharismaResist = convertRatingUnion(
      bonus.decreasecharesist
    );
  }
  if ("decreaseintresist" in bonus && bonus.decreaseintresist !== undefined) {
    checkProp("decreaseintresist");
    testAndResistanceOption.decreaseIntuitionResist = convertRatingUnion(
      bonus.decreaseintresist
    );
  }
  if ("decreaselogresist" in bonus && bonus.decreaselogresist !== undefined) {
    checkProp("decreaselogresist");
    testAndResistanceOption.decreaseLogicResist = convertRatingUnion(
      bonus.decreaselogresist
    );
  }
  if ("decreasewilresist" in bonus && bonus.decreasewilresist !== undefined) {
    checkProp("decreasewilresist");
    testAndResistanceOption.decreaseWillpowerResist = convertRatingUnion(
      bonus.decreasewilresist
    );
  }
  if ("fatigueresist" in bonus && bonus.fatigueresist !== undefined) {
    checkProp("fatigueresist");
    const fatigueResist =
      typeof bonus.fatigueresist === "number"
        ? bonus.fatigueresist
        : { option: bonus.fatigueresist };
    testAndResistanceOption.fatigueResist = fatigueResist;
  }

  // Initiative and Matrix
  // --------------------------------------------------------------------------------------------
  if ("initiative" in bonus && bonus.initiative !== undefined) {
    checkProp("initiative");
    let initiative;
    if (typeof bonus.initiative === "number") {
      initiative = bonus.initiative;
    } else {
      assert(bonus.initiative.xmltext !== undefined);
      const initiativeText = bonus.initiative.xmltext;
      if (typeof initiativeText === "number") {
        initiative = initiativeText;
      } else {
        const match = NumberFixedRating.match(initiativeText);
        if (match.failed()) {
          assert(false, match.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        initiative = NumberFixedRatingSemantics(match).eval();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    initiativeOption.initiative = { bonus: initiative };
  }
  if ("initiativedice" in bonus && bonus.initiativedice !== undefined) {
    checkProp("initiativedice");
    initiativeOption.initiative = {
      bonusDice: bonus.initiativedice,
    };
  }
  if ("initiativepass" in bonus && bonus.initiativepass !== undefined) {
    checkProp("initiativepass");
    let initiative;
    if (typeof bonus.initiativepass === "number") {
      initiative = bonus.initiativepass;
    } else {
      assert(bonus.initiativepass.xmltext !== undefined);
      const initiativeText = bonus.initiativepass.xmltext;
      const match = NumberFixedRating.match(initiativeText.toString());
      if (match.failed()) {
        assert(false, match.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      initiative = NumberFixedRatingSemantics(match).eval();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    initiativeOption.initiative = { bonusDice: initiative };
  }
  if ("matrixinitiative" in bonus && bonus.matrixinitiative !== undefined) {
    checkProp("matrixinitiative");
    if (initiativeOption.matrixInitiative === undefined) {
      initiativeOption.matrixInitiative = {};
    }
    initiativeOption.matrixInitiative.scoreModifier = bonus.matrixinitiative;
  }
  if (
    "matrixinitiativedice" in bonus &&
    bonus.matrixinitiativedice !== undefined
  ) {
    checkProp("matrixinitiativedice");
    if (initiativeOption.matrixInitiative === undefined) {
      initiativeOption.matrixInitiative = {};
    }
    initiativeOption.matrixInitiative.bonusDice =
      bonus.matrixinitiativedice.xmltext;
  }
  if (
    "matrixinitiativediceadd" in bonus &&
    bonus.matrixinitiativediceadd !== undefined
  ) {
    checkProp("matrixinitiativediceadd");
    if (initiativeOption.matrixInitiative === undefined) {
      initiativeOption.matrixInitiative = {};
    } else {
      assert(initiativeOption.matrixInitiative.bonusDice === undefined);
    }
    initiativeOption.matrixInitiative.bonusDice = bonus.matrixinitiativediceadd;
  }
  if ("surprise" in bonus && bonus.surprise !== undefined) {
    checkProp("surprise");
    initiativeOption.surpriseTest = convertRatingCalculation(bonus.surprise);
  }

  // Gear and Vehicles
  // --------------------------------------------------------------------------------------------
  if ("addgear" in bonus && bonus.addgear !== undefined) {
    checkProp("addgear");
    const includedGearList = bonus.addgear.children?.child;
    gearAndVehicleOption.addGear = {
      name: bonus.addgear.name,
      category: bonus.addgear.category,
      ...(bonus.addgear.rating !== undefined && {
        rating: bonus.addgear.rating,
      }),
      ...(includedGearList !== undefined && {
        includedGearList: includedGearList,
      }),
    };
  }
  if ("restrictedgear" in bonus && bonus.restrictedgear !== undefined) {
    checkProp("restrictedgear");
    gearAndVehicleOption.addRestrictedGear = bonus.restrictedgear;
  }
  if ("devicerating" in bonus && bonus.devicerating !== undefined) {
    checkProp("devicerating");
    gearAndVehicleOption.deviceRatingBonus = bonus.devicerating;
  }
  if ("seats" in bonus && bonus.seats !== undefined) {
    checkProp("seats");
    gearAndVehicleOption.seatsModifier = convertRatingCalculation(bonus.seats);
  }
  if ("speed" in bonus && bonus.speed !== undefined) {
    checkProp("speed");
    gearAndVehicleOption.speedModifier = convertRatingCalculation(bonus.speed);
  }
  if ("offroadspeed" in bonus && bonus.offroadspeed !== undefined) {
    checkProp("offroadspeed");
    gearAndVehicleOption.offRoadSpeedModifier = convertRatingCalculation(
      bonus.offroadspeed
    );
  }
  if ("accel" in bonus && bonus.accel !== undefined) {
    checkProp("accel");
    gearAndVehicleOption.accelerationModifier = convertRatingCalculation(
      bonus.accel
    );
  }
  if ("offroadaccel" in bonus && bonus.offroadaccel !== undefined) {
    checkProp("offroadaccel");
    gearAndVehicleOption.offRoadAccelerationModifier = convertRatingCalculation(
      bonus.offroadaccel
    );
  }
  if ("handling" in bonus && bonus.handling !== undefined) {
    checkProp("handling");
    gearAndVehicleOption.handlingModifier = convertRatingCalculation(
      bonus.handling
    );
  }
  if ("offroadhandling" in bonus && bonus.offroadhandling !== undefined) {
    checkProp("offroadhandling");
    gearAndVehicleOption.offRoadHandlingModifier = convertRatingCalculation(
      bonus.offroadhandling
    );
  }
  if ("pilot" in bonus && bonus.pilot !== undefined) {
    checkProp("pilot");
    gearAndVehicleOption.pilotModifier = convertRatingCalculation(bonus.pilot);
  }
  if ("sensor" in bonus && bonus.sensor !== undefined) {
    checkProp("sensor");
    gearAndVehicleOption.sensorModifier = convertRatingCalculation(
      bonus.sensor
    );
  }
  if ("body" in bonus && bonus.body !== undefined) {
    checkProp("body");
    gearAndVehicleOption.bodyModifier = convertRatingCalculation(bonus.body);
  }

  // Essence and Augmentation
  // --------------------------------------------------------------------------------------------
  if ("selectcyberware" in bonus && bonus.selectcyberware !== undefined) {
    checkProp("selectcyberware");
    assert(essenceAndAugmentationOption.selectCyberware === undefined);
    const linkCyberware = bonus.selectcyberware;
    if (typeof linkCyberware === "string") {
      assert(linkCyberware === "");
      essenceAndAugmentationOption.selectCyberware = {
        restrictCategory: false,
      };
    } else {
      essenceAndAugmentationOption.selectCyberware = {
        restrictCategory: true,
        category: convertCyberwareCategory(
          linkCyberware.category as cyberwareXmlCategoryEnum
        ),
      };
    }
  }
  if ("selectside" in bonus && bonus.selectside !== undefined) {
    checkProp("selectside");
    assert(essenceAndAugmentationOption.selectSideOfBody === undefined);
    assert(bonus.selectside === "");
    essenceAndAugmentationOption.selectSideOfBody = true;
  }
  if ("addware" in bonus && bonus.addware !== undefined) {
    checkProp("addware");
    assert(essenceAndAugmentationOption.addAugmentation === undefined);
    let augmentationCategory;
    switch (bonus.addware.type) {
      case "Cyberware":
        augmentationCategory = augmentationCategoryEnum.Cyberware;
        break;
      case "Bioware":
        augmentationCategory = augmentationCategoryEnum.Bioware;
        break;
      case "Genetech":
        augmentationCategory = augmentationCategoryEnum.Genetech;
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        assert(false, `Unknown augmentation type: ${bonus.addware.type}`);
    }
    essenceAndAugmentationOption.addAugmentation = {
      name: bonus.addware.name,
      grade: convertAugmentationGrade(bonus.addware.grade),
      category: augmentationCategory,
    };
  }
  if (
    "genetechcostmultiplier" in bonus &&
    bonus.genetechcostmultiplier !== undefined
  ) {
    checkProp("genetechcostmultiplier");
    if (
      essenceAndAugmentationOption.augmentationCostModifierPercentage ===
      undefined
    ) {
      essenceAndAugmentationOption.augmentationCostModifierPercentage = {};
    }
    assert(
      essenceAndAugmentationOption.augmentationCostModifierPercentage
        .geneTech === undefined
    );
    essenceAndAugmentationOption.augmentationCostModifierPercentage.geneTech =
      bonus.genetechcostmultiplier;
  }
  if (
    "specialmodificationlimit" in bonus &&
    bonus.specialmodificationlimit !== undefined
  ) {
    checkProp("specialmodificationlimit");
    assert(essenceAndAugmentationOption.specialModificationLimit === undefined);
    essenceAndAugmentationOption.specialModificationLimit =
      bonus.specialmodificationlimit;
  }
  if ("essencemax" in bonus && bonus.essencemax !== undefined) {
    checkProp("essencemax");
    assert(essenceAndAugmentationOption.essenceMaxModifier === undefined);
    essenceAndAugmentationOption.essenceMaxModifier = bonus.essencemax;
  }
  if ("essencepenalty" in bonus && bonus.essencepenalty !== undefined) {
    checkProp("essencepenalty");
    assert(essenceAndAugmentationOption.essenceModifier === undefined);
    essenceAndAugmentationOption.essenceModifier = bonus.essencepenalty;
  }
  if ("essencepenaltyt100" in bonus && bonus.essencepenaltyt100 !== undefined) {
    checkProp("essencepenaltyt100");
    const match = EssenceCost.match(bonus.essencepenaltyt100.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.base ===
        undefined
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.base =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      essenceCostSemantics(match).eval();
  }
  if (
    "essencepenaltymagonlyt100" in bonus &&
    bonus.essencepenaltymagonlyt100 !== undefined
  ) {
    checkProp("essencepenaltymagonlyt100");
    const match = EssenceCost.match(bonus.essencepenaltymagonlyt100.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier
        .magOnly === undefined
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.magOnly =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      essenceCostSemantics(match).eval();
  }
  if (
    "cyberwaretotalessmultiplier" in bonus &&
    bonus.cyberwaretotalessmultiplier !== undefined
  ) {
    checkProp("cyberwaretotalessmultiplier");
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier
        .cyberwareOnly === undefined
    );
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.cyberwareOnly =
      [bonus.cyberwaretotalessmultiplier];
  }
  if (
    "cyberwareessmultiplier" in bonus &&
    bonus.cyberwareessmultiplier !== undefined
  ) {
    checkProp("cyberwareessmultiplier");
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier
        .cyberwareOnly === undefined
    );
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.cyberwareOnly =
      [bonus.cyberwareessmultiplier];
  }
  if (
    "biowareessmultiplier" in bonus &&
    bonus.biowareessmultiplier !== undefined
  ) {
    checkProp("biowareessmultiplier");
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier
        .biowareOnly === undefined
    );
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.biowareOnly =
      [bonus.biowareessmultiplier];
  }
  if (
    "genetechessmultiplier" in bonus &&
    bonus.genetechessmultiplier !== undefined
  ) {
    checkProp("genetechessmultiplier");
    if (
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier ===
      undefined
    ) {
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier = {};
    }
    assert(
      essenceAndAugmentationOption.essenceCostOngoingPercentageModifier
        .geneTechOnly === undefined
    );
    essenceAndAugmentationOption.essenceCostOngoingPercentageModifier.geneTechOnly =
      [bonus.genetechessmultiplier];
  }
  if ("disablebioware" in bonus && bonus.disablebioware !== undefined) {
    checkProp("disablebioware");
    if (essenceAndAugmentationOption.augmentationDisable === undefined) {
      essenceAndAugmentationOption.augmentationDisable = {};
    }
    assert(
      essenceAndAugmentationOption.augmentationDisable.disableBioware ===
        undefined
    );
    assert(bonus.disablebioware === "");
    essenceAndAugmentationOption.augmentationDisable.disableBioware = true;
  }
  if (
    "disablebiowaregrade" in bonus &&
    bonus.disablebiowaregrade !== undefined
  ) {
    checkProp("disablebiowaregrade");
    if (essenceAndAugmentationOption.augmentationDisable === undefined) {
      essenceAndAugmentationOption.augmentationDisable = {};
    }
    assert(
      essenceAndAugmentationOption.augmentationDisable
        .disableBiowareGradeList === undefined
    );
    const gradeList = Array.isArray(bonus.disablebiowaregrade)
      ? bonus.disablebiowaregrade
      : [bonus.disablebiowaregrade];
    essenceAndAugmentationOption.augmentationDisable.disableBiowareGradeList =
      gradeList
        .filter((grade) =>
          Object.values(augmentationGradeEnum).includes(
            grade as augmentationGradeEnum
          )
        )
        .map(
          (grade) =>
            augmentationGradeEnum[grade as keyof typeof augmentationGradeEnum]
        );
  }
  if (
    "disablecyberwaregrade" in bonus &&
    bonus.disablecyberwaregrade !== undefined
  ) {
    checkProp("disablecyberwaregrade");
    if (essenceAndAugmentationOption.augmentationDisable === undefined) {
      essenceAndAugmentationOption.augmentationDisable = {};
    }
    assert(
      essenceAndAugmentationOption.augmentationDisable
        .disableCyberwareGradeList === undefined
    );
    const gradeList = Array.isArray(bonus.disablecyberwaregrade)
      ? bonus.disablecyberwaregrade
      : [bonus.disablecyberwaregrade];
    essenceAndAugmentationOption.augmentationDisable.disableCyberwareGradeList =
      gradeList
        .filter((grade) =>
          Object.values(augmentationGradeEnum).includes(
            grade as augmentationGradeEnum
          )
        )
        .map(
          (grade) =>
            augmentationGradeEnum[grade as keyof typeof augmentationGradeEnum]
        );
  }

  // Contact and Reputation
  // --------------------------------------------------------------------------------------------
  if ("addcontact" in bonus && bonus.addcontact !== undefined) {
    checkProp("addcontact");
    const addContact = bonus.addcontact;
    const contact: { loyalty: number; connection: number; group?: true } = {
      loyalty: 0,
      connection: 0,
    };
    if (addContact.loyalty !== undefined) {
      contact.loyalty = addContact.loyalty;
    }
    if (addContact.connection !== undefined) {
      contact.connection = addContact.connection;
    }
    if (addContact.forcedloyalty !== undefined) {
      contact.loyalty = addContact.forcedloyalty;
    }
    if (addContact.group !== undefined) {
      contact.group = true;
    }
    if (addContact.forcegroup !== undefined) {
      contact.group = true;
    }
    if (addContact.free !== undefined) {
      // This is dumb... Lets assume they are always free
    }
    contactAndReputationOption.addContact = contact;
  }
  if ("selectcontact" in bonus && bonus.selectcontact !== undefined) {
    checkProp("selectcontact");
    assert(contactAndReputationOption.linkContact === undefined);
    contactAndReputationOption.linkContact = true;
  }
  if ("notoriety" in bonus && bonus.notoriety !== undefined) {
    checkProp("notoriety");
    assert(contactAndReputationOption.notorietyModifier === undefined);
    contactAndReputationOption.notorietyModifier = bonus.notoriety;
  }
  if ("astralreputation" in bonus && bonus.astralreputation !== undefined) {
    checkProp("astralreputation");
    assert(contactAndReputationOption.astralReputationModifier === undefined);
    contactAndReputationOption.astralReputationModifier =
      bonus.astralreputation;
  }
  if ("publicawareness" in bonus && bonus.publicawareness !== undefined) {
    checkProp("publicawareness");
    assert(contactAndReputationOption.publicAwarenessModifier === undefined);
    contactAndReputationOption.publicAwarenessModifier = bonus.publicawareness;
  }
  if (
    "streetcredmultiplier" in bonus &&
    bonus.streetcredmultiplier !== undefined
  ) {
    checkProp("streetcredmultiplier");
    assert(
      contactAndReputationOption.streetCredLifetimeKarmaModifier === undefined
    );
    contactAndReputationOption.streetCredLifetimeKarmaModifier =
      bonus.streetcredmultiplier;
  }
  if ("contactkarma" in bonus && bonus.contactkarma !== undefined) {
    checkProp("contactkarma");
    assert(contactAndReputationOption.contactKarmaCostModifier === undefined);
    contactAndReputationOption.contactKarmaCostModifier = bonus.contactkarma;
  }
  if (
    "contactkarmaminimum" in bonus &&
    bonus.contactkarmaminimum !== undefined
  ) {
    checkProp("contactkarmaminimum");
    assert(contactAndReputationOption.contactMinimumKarmaCost === undefined);
    contactAndReputationOption.contactMinimumKarmaCost =
      bonus.contactkarmaminimum;
  }

  // Quality
  // --------------------------------------------------------------------------------------------
  {
    // qualities scope
    let qualities: BonusGenericListType = [];
    if ("quality" in bonus && bonus.quality !== undefined) {
      checkProp("quality");
      const rating = Number(bonus.quality._rating);
      assert(!isNaN(rating));
      qualities = qualities.concat([
        { name: bonus.quality.xmltext, rating: rating },
      ]);
    }
    if ("addqualities" in bonus && bonus.addqualities !== undefined) {
      checkProp("addqualities");
      const addQuality = bonus.addqualities.addquality;
      const addQualityArray = Array.isArray(addQuality)
        ? addQuality
        : [addQuality];

      const qualityArray = addQualityArray.map((quality) => {
        if (typeof quality === "string") {
          return { name: quality };
        } else {
          // TODO: handle forced
          return { name: quality.xmltext };
        }
      });
      qualities = qualities.concat(qualityArray);
    }
    if (qualities.length > 0) {
      qualityOption.addQualityList = qualities;
    }
  }
  if ("freequality" in bonus && bonus.freequality !== undefined) {
    checkProp("freequality");

    const currentPath = import.meta.url;
    const xml_string = fs.readFileSync(
      fileURLToPath(
        path.dirname(currentPath) + "../../../../xmls/qualities.xml"
      ),
      "utf8"
    );
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      textNodeName: "xmltext",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const jObj: any = parser.parse(xml_string);
    // console.log(
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   jObj.chummer.qualities.quality
    // );

    const qualityListParsed = QualityListXmlSchema(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.qualities.quality
    );

    if (qualityListParsed instanceof type.errors) {
      console.log(qualityListParsed.summary);
      assert(false);
    }
    const qualityMatchedList = qualityListParsed.filter((fullQuality) => {
      return bonus.freequality === fullQuality.id;
    });
    assert(
      qualityMatchedList.length !== 0,
      `Unknown quality id: ${bonus.freequality}`
    );
    assert(
      qualityMatchedList.length === 1,
      `Multiple qualities matched id: ${bonus.freequality}`
    );
    const name = qualityMatchedList[0].name;

    assert(qualityOption.freeQuality === undefined && name !== undefined);
    qualityOption.freeQuality = name;
  }
  if ("selectquality" in bonus && bonus.selectquality !== undefined) {
    checkProp("selectquality");
    const selectQualityList = Array.isArray(bonus.selectquality.quality)
      ? bonus.selectquality.quality
      : [bonus.selectquality.quality];

    let reducedBonusQualityList;
    if (
      "discountqualities" in bonus.selectquality &&
      bonus.selectquality.discountqualities !== undefined
    ) {
      reducedBonusQualityList = Array.isArray(
        bonus.selectquality.discountqualities.quality
      )
        ? bonus.selectquality.discountqualities.quality
        : [bonus.selectquality.discountqualities.quality];
      reducedBonusQualityList = reducedBonusQualityList.map((quality) => {
        const discount = parseInt(quality._discount);
        return { name: quality.xmltext, karmaReduction: discount };
      });
    }
    assert(qualityOption.selectQualityFromList === undefined);
    qualityOption.selectQualityFromList = {
      bonusQualityList: selectQualityList.map((quality) => {
        const qualityName =
          typeof quality === "string" ? quality : quality.xmltext;
        return { name: qualityName };
      }),
      ...(reducedBonusQualityList !== undefined && {
        reducedBonusQualityList: reducedBonusQualityList,
      }),
    };
  }
  if ("metageniclimit" in bonus && bonus.metageniclimit !== undefined) {
    checkProp("metageniclimit");
    qualityOption.metagenicLimitIncrease = bonus.metageniclimit;
  }
  if ("disablequality" in bonus && bonus.disablequality !== undefined) {
    checkProp("disablequality");
    const disableQualities =
      typeof bonus.disablequality === "string"
        ? [{ name: bonus.disablequality }]
        : bonus.disablequality.map((quality) => {
            return { name: quality };
          });
    qualityOption.disableQualityList = disableQualities;
  }

  // specific qualities
  // --------------------------------------------------------------------------------------------
  if ("ambidextrous" in bonus && bonus.ambidextrous !== undefined) {
    checkProp("ambidextrous");
    specificQualityOption.ambidextrous = true as const;
  }
  if ("burnoutsway" in bonus && bonus.burnoutsway !== undefined) {
    checkProp("burnoutsway");
    assert(
      specificQualityOption.burnoutsWay === undefined &&
        bonus.burnoutsway === ""
    );
    specificQualityOption.burnoutsWay = true as const;
  }
  if (
    "friendsinhighplaces" in bonus &&
    bonus.friendsinhighplaces !== undefined
  ) {
    checkProp("friendsinhighplaces");
    assert(
      specificQualityOption.friendsInHighPlaces === undefined &&
        bonus.friendsinhighplaces === ""
    );
    specificQualityOption.friendsInHighPlaces = true as const;
  }
  if ("overclocker" in bonus && bonus.overclocker !== undefined) {
    checkProp("overclocker");
    assert(
      specificQualityOption.overclocker === undefined &&
        bonus.overclocker === ""
    );
    specificQualityOption.overclocker = true as const;
  }
  if ("trustfund" in bonus && bonus.trustfund !== undefined) {
    checkProp("trustfund");
    assert(
      specificQualityOption.trustfund === undefined &&
        typeof bonus.trustfund === "number"
    );
    specificQualityOption.trustfund = bonus.trustfund;
  }
  if (
    "prototypetranshuman" in bonus &&
    bonus.prototypetranshuman !== undefined
  ) {
    checkProp("prototypetranshuman");
    assert(
      specificQualityOption.prototypeTranshuman === undefined &&
        typeof bonus.prototypetranshuman === "number"
    );
    specificQualityOption.prototypeTranshuman = bonus.prototypetranshuman;
  }
  if ("excon" in bonus && bonus.excon !== undefined) {
    checkProp("excon");
    assert(specificQualityOption.excon === undefined && bonus.excon === "");
    specificQualityOption.excon = true as const;
  }
  if ("mademan" in bonus && bonus.mademan !== undefined) {
    checkProp("mademan");
    assert(specificQualityOption.mademan === undefined && bonus.mademan === "");
    specificQualityOption.mademan = true as const;
  }
  if (
    "magicianswaydiscount" in bonus &&
    bonus.magicianswaydiscount !== undefined
  ) {
    checkProp("magicianswaydiscount");
    assert(
      specificQualityOption.magiciansWayDiscount === undefined &&
        bonus.magicianswaydiscount === ""
    );
    specificQualityOption.magiciansWayDiscount = true as const;
  }
  if (
    "blackmarketdiscount" in bonus &&
    bonus.blackmarketdiscount !== undefined
  ) {
    checkProp("blackmarketdiscount");
    assert(
      specificQualityOption.blackmarketDiscount === undefined &&
        bonus.blackmarketdiscount === ""
    );
    specificQualityOption.blackmarketDiscount = true as const;
  }
  if ("erased" in bonus && bonus.erased !== undefined) {
    checkProp("erased");
    assert(specificQualityOption.erased === undefined && bonus.erased === "");
    specificQualityOption.erased = true as const;
  }
  if ("fame" in bonus && bonus.fame !== undefined) {
    checkProp("fame");
    assert(specificQualityOption.fame === undefined && bonus.fame === "");
    specificQualityOption.fame = true as const;
  }
  if (
    "selectinherentaiprogram" in bonus &&
    bonus.selectinherentaiprogram !== undefined
  ) {
    checkProp("selectinherentaiprogram");
    assert(
      specificQualityOption.selectInherentAiProgram === undefined &&
        bonus.selectinherentaiprogram === ""
    );
    specificQualityOption.selectInherentAiProgram = true as const;
  }
  if ("dealerconnection" in bonus && bonus.dealerconnection !== undefined) {
    checkProp("dealerconnection");
    assert(
      specificQualityOption.dealerConnection === undefined &&
        typeof bonus.dealerconnection === "object"
    );
    specificQualityOption.dealerConnection =
      bonus.dealerconnection.category.map((category) => {
        if (category === "Drones") {
          return vehicleCategoryEnum.Drone;
        }
        return category;
      });
  }
  if ("cyberadeptdaemon" in bonus && bonus.cyberadeptdaemon !== undefined) {
    checkProp("cyberadeptdaemon");
    assert(
      specificQualityOption.cyberAdeptDaemon === undefined &&
        bonus.cyberadeptdaemon === ""
    );
    specificQualityOption.cyberAdeptDaemon = true as const;
  }
  if ("uneducated" in bonus && bonus.uneducated !== undefined) {
    checkProp("uneducated");
    assert(
      specificQualityOption.uneducated === undefined && bonus.uneducated === ""
    );
    specificQualityOption.uneducated = true as const;
  }
  if ("cyberseeker" in bonus && bonus.cyberseeker !== undefined) {
    checkProp("cyberseeker");
    assert(specificQualityOption.cyberSeeker === undefined);
    const cyberSeekerXmlArray = Array.isArray(bonus.cyberseeker)
      ? bonus.cyberseeker
      : [bonus.cyberseeker];
    const cyberSeeker: {
      attributeList: Array<attributeTypeEnum>;
      loseOnePhysicalBoxInsteadOfGainingTwo?: true;
    } = { attributeList: [] };
    cyberSeekerXmlArray.forEach((ability: string) => {
      switch (ability) {
        case "BOD":
          cyberSeeker.attributeList.push(attributeTypeEnum.Body);
          break;
        case "AGI":
          cyberSeeker.attributeList.push(attributeTypeEnum.Agility);
          break;
        case "REA":
          cyberSeeker.attributeList.push(attributeTypeEnum.Reaction);
          break;
        case "STR":
          cyberSeeker.attributeList.push(attributeTypeEnum.Strength);
          break;
        case "CHA":
          cyberSeeker.attributeList.push(attributeTypeEnum.Charisma);
          break;
        case "INT":
          cyberSeeker.attributeList.push(attributeTypeEnum.Intuition);
          break;
        case "LOG":
          cyberSeeker.attributeList.push(attributeTypeEnum.Logic);
          break;
        case "WIL":
          cyberSeeker.attributeList.push(attributeTypeEnum.Willpower);
          break;
        case "BOX":
          cyberSeeker.loseOnePhysicalBoxInsteadOfGainingTwo = true as const;
          break;
        default:
          assert(false, `Unknown cyberseeker ability: ${ability}`);
      }
    });
    specificQualityOption.cyberSeeker = cyberSeeker;
  }
  if ("adapsin" in bonus && bonus.adapsin !== undefined) {
    checkProp("adapsin");
    specificQualityOption.adapsin = true;
  }
  if (
    "reflexrecorderoptimization" in bonus &&
    bonus.reflexrecorderoptimization !== undefined
  ) {
    checkProp("reflexrecorderoptimization");
    assert(
      specificQualityOption.reflexRecorderOptimisation === undefined &&
        bonus.reflexrecorderoptimization === ""
    );
    specificQualityOption.reflexRecorderOptimisation = true as const;
  }
  if (
    "quickeningmetamagic" in bonus &&
    bonus.quickeningmetamagic !== undefined
  ) {
    checkProp("quickeningmetamagic");
    assert(
      specificQualityOption.quickeningMetamagic === undefined &&
        bonus.quickeningmetamagic === ""
    );
    specificQualityOption.quickeningMetamagic = true as const;
  }
  if (
    "allowspritefettering" in bonus &&
    bonus.allowspritefettering !== undefined
  ) {
    checkProp("allowspritefettering");
    assert(
      specificQualityOption.allowSpriteFettering === undefined &&
        bonus.allowspritefettering === ""
    );
    specificQualityOption.allowSpriteFettering = true as const;
  }

  // Misc
  // --------------------------------------------------------------------------------------------
  if ("_unique" in bonus) {
    checkProp("_unique");
    assert(bonus._unique !== "");
    assert(miscellaneousOption.uniqueBonusCategory === undefined);
    miscellaneousOption.uniqueBonusCategory = bonus._unique;
  }
  if ("_mode" in bonus) {
    checkProp("_mode");
    assert(bonus._mode === "replace");
    assert(miscellaneousOption.replaceNonWireless === undefined);
    miscellaneousOption.replaceNonWireless = true;
  }
  if ("selecttext" in bonus && bonus.selecttext !== undefined) {
    checkProp("selecttext");
    const selectText = bonus.selecttext;
    let selection: BonusSelectionType = {};
    if (typeof selectText === "string") {
      assert(selectText === "");
      selection = { enterName: true };
    } else {
      if (selectText._allowedit !== undefined) {
        selection = { allowEdit: true };
      }
      const optionList = getListFromOtherFile(
        selectText._xml,
        selectText._xpath
      );
      selection = {
        optionList: optionList,
      };
    }
    assert(
      Object.keys(selection).length > 0,
      `bonus selecttext ${JSON.stringify(selectText)} not converted`
    );
    assert(miscellaneousOption.selection === undefined);
    miscellaneousOption.selection = selection;
  }
  if ("_useselected" in bonus) {
    checkProp("_useselected");
    assert(bonus._useselected == "False");
    assert(miscellaneousOption.displaySelection === undefined);
    miscellaneousOption.displaySelection = false;
  }
  if ("nuyenamt" in bonus && bonus.nuyenamt !== undefined) {
    checkProp("nuyenamt");
    if (miscellaneousOption.characterCreator === undefined) {
      miscellaneousOption.characterCreator = {};
    }
    assert(
      miscellaneousOption.characterCreator.nuyenForGearModifier === undefined
    );
    const nuyen =
      typeof bonus.nuyenamt === "number"
        ? bonus.nuyenamt
        : bonus.nuyenamt.xmltext;
    const stolen = typeof bonus.nuyenamt === "object";
    miscellaneousOption.characterCreator.nuyenForGearModifier = {
      nuyen: nuyen,
      ...(stolen && { gearPurchasedWithNuyenMarkedAsStolen: true as const }),
    };
  }
  if ("nuyenmaxbp" in bonus && bonus.nuyenmaxbp !== undefined) {
    checkProp("nuyenmaxbp");
    if (miscellaneousOption.characterCreator === undefined) {
      miscellaneousOption.characterCreator = {};
    }
    assert(
      miscellaneousOption.characterCreator
        .maxKarmaThatCanBeConvertedToNuyenModifier === undefined
    );
    miscellaneousOption.characterCreator.maxKarmaThatCanBeConvertedToNuyenModifier =
      bonus.nuyenmaxbp;
  }
  if ("selectrestricted" in bonus && bonus.selectrestricted !== undefined) {
    checkProp("selectrestricted");
    assert(miscellaneousOption.linkLicense === undefined);
    const linkLicense = bonus.selectrestricted;
    assert(linkLicense === "");
    miscellaneousOption.linkLicense = true;
  }
  if ("enabletab" in bonus && bonus.enabletab !== undefined) {
    checkProp("enabletab");
    // Note: This is ignored on purpose since it's only relevant to chummer UI
    // TODO: revisit this
  }
  if ("actiondicepool" in bonus && bonus.actiondicepool !== undefined) {
    checkProp("actiondicepool");
    assert(miscellaneousOption.dicePoolModifier === undefined);
    if ("_category" in bonus.actiondicepool) {
      miscellaneousOption.dicePoolModifier = {
        type: { selectFromMatrixActions: true as const },
        // This is unfortunately hardcoded since the XML doesn't provide any more detail
        modifier: 2,
      };
    } else {
      miscellaneousOption.dicePoolModifier = {
        type: { specificTest: bonus.actiondicepool.name },
        modifier: bonus.actiondicepool.val,
      };
    }
  }
  if ("addlimb" in bonus && bonus.addlimb !== undefined) {
    checkProp("addlimb");
    const limbSlot = convertLimbSlot(bonus.addlimb.limbslot);
    miscellaneousOption.addLimb = {
      limbSlot: limbSlot,
      numberOfLimbs: bonus.addlimb.val,
    };
  }

  const bonusObject: BonusType = {
    ...(Object.keys(attributeOption).length > 0 && {
      attribute: attributeOption,
    }),
    ...(Object.keys(skillOption).length > 0 && { skill: skillOption }),
    ...(Object.keys(powerOption).length > 0 && { power: powerOption }),
    ...(Object.keys(spellAndMagicOption).length > 0 && {
      spellAndMagic: spellAndMagicOption,
    }),
    ...(Object.keys(combatAndWeaponOption).length > 0 && {
      combatAndWeapon: combatAndWeaponOption,
    }),
    ...(Object.keys(conditionAndRecoveryOption).length > 0 && {
      conditionAndRecovery: conditionAndRecoveryOption,
    }),
    ...(Object.keys(movementAndLifestyleOption).length > 0 && {
      movementAndLifestyle: movementAndLifestyleOption,
    }),
    ...(Object.keys(testAndResistanceOption).length > 0 && {
      testAndResistance: testAndResistanceOption,
    }),
    ...(Object.keys(initiativeOption).length > 0 && {
      initiative: initiativeOption,
    }),
    ...(Object.keys(gearAndVehicleOption).length > 0 && {
      gearAndVehicle: gearAndVehicleOption,
    }),
    ...(Object.keys(essenceAndAugmentationOption).length > 0 && {
      essenceAndAugmentation: essenceAndAugmentationOption,
    }),
    ...(Object.keys(contactAndReputationOption).length > 0 && {
      contactAndReputation: contactAndReputationOption,
    }),
    ...(Object.keys(qualityOption).length > 0 && { quality: qualityOption }),
    ...(Object.keys(specificQualityOption).length > 0 && {
      specificQuality: specificQualityOption,
    }),
    ...(Object.keys(miscellaneousOption).length > 0 && {
      miscellaneous: miscellaneousOption,
    }),
  };
  // Check to ensure no props were missed
  const handledProps = Array.from(checkedProps);
  const inputProps = Object.keys(bonus).filter((k) => k !== "xmltext"); // ignore xmltext if needed
  const missedProps = inputProps.filter((prop) => !handledProps.includes(prop));
  assert(
    missedProps.length === 0,
    `Unhandled bonus properties: ${missedProps.join(", ")}`
  );
  assert(
    Object.keys(bonusObject).length > 0 || bonus.enabletab !== undefined,
    `bonusObject is empty: ${JSON.stringify(bonus)}`
  );
  return bonusObject;
}

export const bonusAttribute = function (
  attributeInput: GenericNameValueListType
) {
  const attributeList = Array.isArray(attributeInput)
    ? attributeInput
    : [attributeInput];
  return attributeList.map((attribute) => {
    assert("name" in attribute && attribute.name !== undefined);

    return {
      name: attribute.name,
    };
  });
};

export const bonusSkill = function (skillInput: SkillImprovementXMLListType) {
  const skillList = Array.isArray(skillInput) ? skillInput : [skillInput];
  return skillList.map((skill) => {
    return {
      name: skill.name,
    };
  });
};

function spellCategoryConversion(category: string) {
  if (category === "Rituals") {
    return spellCategoryEnum.Ritual;
  }
  const spellCategoryEnumSchema = type.valueOf(spellCategoryEnum);
  const categoryEnum = spellCategoryEnumSchema(category);
  assert(
    !(categoryEnum instanceof type.errors),
    `spellCategoryEnum not found: ${category}`
  );
  return categoryEnum;
}

function weaponTypeConversion(weaponType: string) {
  const weaponTypeEnumSchema = type.valueOf(weaponCategoryEnum);
  const typeEnum = weaponTypeEnumSchema(weaponType);
  assert(
    !(typeEnum instanceof type.errors),
    `weaponTypeEnum enum not found: ${weaponType}`
  );
  return typeEnum;
}

export function convertKarmaCost(karmaCost: GenericNameValueType) {
  assert(karmaCost.name !== undefined, karmaCost.name);
  const name = karmaCost.name as attributeXMLEnum;
  assert(
    Object.values(attributeXMLEnum).includes(name),
    JSON.stringify(karmaCost)
  );

  assert(typeof karmaCost.val === "number");

  return {
    name: convertAttribute(name),
    bonus: karmaCost.val,
  };
}

function convertRatingUnion(unionObject: NumberOrAnyRatingType) {
  if (typeof unionObject === "number") {
    return unionObject;
  } else {
    return { option: unionObject };
  }
}

function convertRatingAttributeUnion(
  unionObject: NumberOrRatingOrAttributeType
) {
  if (typeof unionObject === "number") {
    return unionObject;
  } else if (unionObject === "Rating" || unionObject === "-Rating") {
    return { option: unionObject };
  } else {
    return { option: convertAttribute(unionObject) };
  }
}

function getListFromOtherFile(
  _fileName: string,
  xmlNodePath: string
): Array<{
  base: listTypeEnum;
  modifier?: Array<BonusSelectionOptionModifierType>;
}> {
  // const fileName = `${fileNameInput}.xml`;
  // console.log(fileName);
  // const currentPath = import.meta.url;
  // const xml_string = fs.readFileSync(
  //   fileURLToPath(path.dirname(currentPath) + `../../../../xmls/${fileName}`),
  //   "utf8"
  // );
  // const parser = new XMLParser({
  //   ignoreAttributes: false,
  //   attributeNamePrefix: "_",
  //   textNodeName: "xmltext",
  // });
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const jObj: any = parser.parse(xml_string);
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.armors.armor[193].gears.usegear
  // );
  const nodePaths = xmlNodePath.split("|");
  // disable as eslint doesn't like the assert fail
  // eslint-disable-next-line array-callback-return
  return nodePaths.map((nodePath) => {
    let modifier;
    const regexInner = nodePath.match(/.*\[(.*?)\]/);
    if (regexInner !== null) {
      // console.log(regexInner[1]);
      // assert(false);
    }

    if (nodePath.includes("/chummer/vehicles/vehicle")) {
      return {
        base: listTypeEnum.Vehicle,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/weapons/weapon")) {
      return {
        base: listTypeEnum.Weapon,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/matrixattributes")) {
      return {
        base: listTypeEnum.MatrixAttribute,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/elements")) {
      return {
        base: listTypeEnum.Element,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/immunities")) {
      return {
        base: listTypeEnum.Immunity,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/spiritcategories/category")) {
      return {
        base: listTypeEnum.SpiritCategory,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/skills/skill")) {
      return {
        base: listTypeEnum.Skill,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/knowledgeskills/skill/")) {
      return {
        base: listTypeEnum.KnowledgeSkill,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/skillgroups")) {
      return {
        base: listTypeEnum.SkillGroup,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/metatypes/metatype")) {
      return {
        base: listTypeEnum.Heritage,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/qualities/quality")) {
      return {
        base: listTypeEnum.Quality,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/gears/gear")) {
      return {
        base: listTypeEnum.Gear,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/storybuilder/macros/mega/")) {
      return {
        base: listTypeEnum.Megacorp,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/storybuilder/macros/megadoublea")) {
      return {
        base: listTypeEnum.MegacorpDoubleA,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/spells/spell")) {
      return {
        base: listTypeEnum.Spell,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/spirits/spirit")) {
      return {
        base: listTypeEnum.Spirit,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/programs/program")) {
      return {
        base: listTypeEnum.Program,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else if (nodePath.includes("/chummer/actions/action")) {
      return {
        base: listTypeEnum.Action,
        ...(modifier !== undefined && { modifier: modifier }),
      };
    } else {
      assert(false, `Unknown xmlNodePath: ${nodePath}`);
    }
  });
}
function movementReplaceConverter(
  movement: MovementReplacementXmlType,
  movementReplacement: MovementReplacementType | undefined
) {
  switch (movement.speed) {
    case "walk":
      if (movementReplacement === undefined) {
        movementReplacement = {
          walk: movement.val,
        };
      } else {
        assert(movementReplacement.walk === undefined);
        movementReplacement.walk = movement.val;
      }
      break;
    case "run":
      if (movementReplacement === undefined) {
        movementReplacement = {
          run: movement.val,
        };
      } else {
        assert(movementReplacement.run === undefined);
        movementReplacement.run = movement.val;
      }
      break;
    case "sprint":
      if (movementReplacement === undefined) {
        movementReplacement = {
          sprint: movement.val,
        };
      } else {
        assert(movementReplacement.sprint === undefined);
        movementReplacement.sprint = movement.val;
      }
      break;
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      assert(false, `Unknown speed type: ${movement.speed}`);
  }
  return movementReplacement;
}

function convertRatingCalculation(
  bonus: StringOrNumberType
): RatingCalculationType {
  const match = RatingCalculation.match(bonus.toString());
  if (match.failed()) {
    assert(
      false,
      `Error RatingCalculation: ${
        match.message
      }, original bonus: ${JSON.stringify(bonus)}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
  return bonusRatingCalculationSemantics(match).eval();
}

function getSkillSelectionOptions(linkSkill: SelectSkillXMLType) {
  assert(linkSkill !== "");
  let skill:
    | {
        skillList: string[];
        limit: "Exclude" | "Only";
      }
    | undefined;
  let skillGroup:
    | {
        skillGroupList: string[];
        limit: "Exclude" | "Only";
      }
    | undefined;
  let skillCategory:
    | {
        skillCategoryList: string[];
        limit: "Exclude" | "Only";
      }
    | undefined;
  let attribute:
    | {
        attributeList: string[];
      }
    | undefined;
  let knowledgeSkillRestriction:
    | {
        limit: "Exclude" | "Only";
      }
    | undefined;
  if (linkSkill._limittoskill !== undefined) {
    assert(skill === undefined, JSON.stringify(skill));
    skill = {
      skillList: linkSkill._limittoskill.split(",").map((s) => s.trim()),
      limit: "Only" as const,
    };
  }
  if (linkSkill._excludeskill !== undefined) {
    assert(skill === undefined, JSON.stringify(skill));
    skill = {
      skillList: linkSkill._excludeskill.split(",").map((s) => s.trim()),
      limit: "Exclude" as const,
    };
  }
  if (linkSkill._skillgroup !== undefined) {
    assert(skillGroup === undefined, JSON.stringify(skillGroup));
    skillGroup = {
      skillGroupList: linkSkill._skillgroup.split(",").map((s) => s.trim()),
      limit: "Only" as const,
    };
  }
  if (linkSkill._excludecategory !== undefined) {
    assert(skillCategory === undefined, JSON.stringify(skillCategory));
    skillCategory = {
      skillCategoryList: linkSkill._excludecategory
        .split(",")
        .map((s) => s.trim()),
      limit: "Exclude" as const,
    };
  }
  if (linkSkill._skillcategory !== undefined) {
    if (skillCategory !== undefined) {
      assert(false, JSON.stringify(skillCategory));
    }
    skillCategory = {
      skillCategoryList: linkSkill._skillcategory
        .split(",")
        .map((s) => s.trim()),
      limit: "Only" as const,
    };
  }
  if (linkSkill.skillcategories !== undefined) {
    assert(skillCategory === undefined, JSON.stringify(skillCategory));
    skillCategory = {
      skillCategoryList: linkSkill.skillcategories.category,
      limit: "Only" as const,
    };
  }

  if (linkSkill._limittoattribute !== undefined) {
    attribute = {
      attributeList: linkSkill._limittoattribute
        .split(",")
        .map((s) => s.trim()),
    };
  }
  if (linkSkill._knowledgeskills !== undefined) {
    knowledgeSkillRestriction = {
      limit:
        linkSkill._knowledgeskills === "True"
          ? ("Only" as const)
          : ("Exclude" as const),
    };
  }
  const selectSkillBase = {
    restriction: {
      ...(skill !== undefined && {
        skillList: skill,
      }),
      ...(skillGroup !== undefined && {
        skillGroupList: skillGroup,
      }),
      ...(skillCategory !== undefined && {
        skillCategoryList: skillCategory,
      }),
      ...(attribute !== undefined && {
        attributeList: attribute,
      }),
      ...(knowledgeSkillRestriction !== undefined && {
        knowledgeSkillRestriction: knowledgeSkillRestriction,
      }),
    },
    ...(linkSkill._maximumrating !== undefined && {
      maximumRating: parseInt(linkSkill._maximumrating),
    }),
    ...(linkSkill._minimumrating !== undefined && {
      minimumRating: parseInt(linkSkill._minimumrating),
    }),
  };
  return selectSkillBase;
}

function convertSpecificAttribute(
  attribute: GenericNameValueType
): SpecificAttributeBonusType {
  assert("name" in attribute, JSON.stringify(attribute));
  let value;
  if ("val" in attribute) {
    assert(!("value" in attribute), JSON.stringify(attribute));
    value = attribute.val;
  } else {
    value = attribute.value;
  }

  const name = attribute.name as attributeXMLEnum;
  assert(
    Object.values(attributeXMLEnum).includes(name),
    JSON.stringify(attribute)
  );

  let min, max, aug;
  if (value !== undefined) {
    const match = NumberFixedRating.match(value.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    value = NumberFixedRatingSemantics(match).eval();
  }
  if (attribute.min !== undefined) {
    const match = NumberFixedRating.match(attribute.min.toString());
    if (match.failed()) {
      assert(false, match.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    min = NumberFixedRatingSemantics(match).eval();
  }
  if (attribute.max !== undefined) {
    const match = NumberFixedRating.match(attribute.max.toString());
    if (match.failed()) {
      assert(false, match.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    max = NumberFixedRatingSemantics(match).eval();
  }
  if (attribute.aug !== undefined) {
    const match = NumberFixedRating.match(attribute.aug.toString());
    if (match.failed()) {
      assert(false, match.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    aug = NumberFixedRatingSemantics(match).eval();
  }
  // Todo: add other attributes
  return {
    linkType: {
      linkedAttribute: convertAttribute(name),
    },
    ...(value !== undefined && {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      attributeIncrease: value,
    }),
    ...(min !== undefined && {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      minimumIncrease: min,
    }),
    ...(max !== undefined && {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      maximumIncrease: max,
    }),
    ...(aug !== undefined && {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      augmentatedIncrease: aug,
    }),
  };
}

function convertSkill(skill: SkillImprovementXMLType) {
  let bonus;
  if (skill.bonus !== undefined) {
    assert(skill.val === undefined);
    bonus = skill.bonus;
  } else {
    assert(skill.val !== undefined);
    bonus = skill.val;
  }

  let condition;
  if (skill.condition !== undefined) {
    condition = convertCondition(skill.condition);
  }
  let modifierType;
  if (skill.applytorating !== undefined) {
    modifierType =
      skill.applytorating === "True"
        ? (bonusSkillModifierTypeEnum.ApplyBonusToLevel as const)
        : (bonusSkillModifierTypeEnum.DicePoolIncrease as const);
  } else {
    modifierType = bonusSkillModifierTypeEnum.DicePoolIncrease as const;
  }

  return {
    name: skill.name,
    bonus: convertRatingUnion(bonus),
    ...(skill._precedence !== undefined && { precedence: skill._precedence }),
    ...(condition !== undefined && { condition: condition }),
    ...(skill.exclude !== undefined && { exclude: skill.exclude }),
    modifierType: modifierType,
  };
}

function convertCondition(conditionXML: string) {
  let condition;
  if (conditionXML.includes("LimitCondition")) {
    const currentPath = import.meta.url;
    const xml_string = fs.readFileSync(
      fileURLToPath(path.dirname(currentPath) + "../../../../xmls/en-us.xml"),
      "utf8"
    );
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      textNodeName: "xmltext",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const jObj: any = parser.parse(xml_string);
    // console.dir(
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   jObj.chummer.strings.string[120],
    //   { depth: Infinity }
    // );
    const englishTranslationListParsed = EnglishTranslationsXMLSchema(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.strings
    );

    if (englishTranslationListParsed instanceof type.errors) {
      assert(false, englishTranslationListParsed.summary);
    }
    condition = englishTranslationListParsed.string.find((item) => {
      return item.key === conditionXML;
    });

    assert(condition !== undefined, conditionXML);
    assert(typeof condition.text === "string", JSON.stringify(condition));
    condition = condition.text;
  } else {
    condition = conditionXML;
  }
  return condition;
}

function convertSelectAttribute(
  selectAttribute:
    | { excludeattribute: attributeXMLEnum | attributeXMLEnum[]; max?: number }
    | {
        attribute: attributeXMLEnum | attributeXMLEnum[];
        val?: number | "Rating";
      }
) {
  let element;
  if ("excludeattribute" in selectAttribute) {
    const attributeList = Array.isArray(selectAttribute.excludeattribute)
      ? selectAttribute.excludeattribute
      : [selectAttribute.excludeattribute];

    const increase = selectAttribute.max;
    element = {
      linkType: {
        exclude: attributeList.map((attribute) => {
          return convertAttribute(attribute);
        }),
      },
      ...(increase !== undefined && { maximumIncrease: increase }),
    };
  }
  if ("attribute" in selectAttribute) {
    const attributeList = Array.isArray(selectAttribute.attribute)
      ? selectAttribute.attribute
      : [selectAttribute.attribute];

    const increase =
      selectAttribute.val !== undefined
        ? typeof selectAttribute.val === "number"
          ? selectAttribute.val
          : { option: selectAttribute.val }
        : undefined;
    element = {
      linkType: {
        include: attributeList.map((attribute) => {
          return convertAttribute(attribute);
        }),
      },
      ...(increase !== undefined && { attributeIncrease: increase }),
    };
  }
  assert(element !== undefined);
  return element;
}

function convertWeaponSkillAccuracy(
  weaponSkillAccuracy: WeaponSkillAccuracyXMLType
) {
  let skill: WeaponAccuracySkillListSkillSelectionType;
  if (weaponSkillAccuracy.selectskill !== undefined) {
    const linkSkill = weaponSkillAccuracy.selectskill;
    assert(linkSkill !== "");
    const selectSkillBase = getSkillSelectionOptions(linkSkill);

    assert(
      linkSkill.disablespecializationeffects === undefined,
      linkSkill.disablespecializationeffects
    );
    assert(linkSkill._prompt === undefined, linkSkill._prompt);
    assert(linkSkill.applytorating === undefined, linkSkill.applytorating);
    assert(linkSkill.max === undefined, `${linkSkill.max}`);
    assert(linkSkill.val === undefined, `${linkSkill.val}`);
    skill = {
      selectSkill: true,
      selectionOptions: selectSkillBase,
    };
  } else {
    assert(weaponSkillAccuracy.name !== undefined);
    skill = {
      selectSkill: false,
      name: weaponSkillAccuracy.name,
    };
  }
  return skill;
}
