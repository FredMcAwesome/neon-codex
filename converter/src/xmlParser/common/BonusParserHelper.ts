import { z as zod } from "zod";
import {
  damageTypeEnum,
  mathOperatorEnum,
  spellCategoryEnum,
  weaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  BonusType,
  BonusQualityListType,
  SelectSkillType,
} from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import assert from "assert";
import type {
  GenericNameValueListType,
  GenericNameValueType,
  NumberOrAnyRatingType,
  SkillListType,
} from "./ParserCommonDefines.js";
import { attributeXMLEnum } from "./ParserCommonDefines.js";
import Bonus from "../../grammar/bonus.ohm-bundle.js";
import {
  initiativeSemantics,
  skillKarmaCostSemantics,
} from "./ParserSemanticsHelper.js";
import { convertAttribute, convertLimbSlot } from "./ParserHelper.js";
import type { BonusXmlType } from "./BonusParserSchemas.js";
const Initiative = Bonus.Initiative;
const SkillKarmaCost = Bonus.SkillKarmaCost;
import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
import { essenceCostSemantics } from "../bodyModification/augmentationParserHelper.js";
const EssenceCost = Augmentation.EssenceCost;

// TODO: handle bonus correctly
export function convertXmlBonus(bonus: BonusXmlType) {
  if (typeof bonus == "string") {
    assert(bonus === "");
    return undefined;
  }
  const bonusObject: BonusType = {};
  if ("selecttext" in bonus && bonus.selecttext !== undefined) {
    const selectText = bonus.selecttext;
    if (typeof selectText === "string") {
      assert(selectText === "");
      bonusObject.enterName = true;
    } else {
      if (selectText._allowedit !== undefined) {
      }
      // const optionList = getListFromOtherFile(selectText._xml, selectText._xpath)
    }
  }
  if ("selectweapon" in bonus && bonus.selectweapon !== undefined) {
    const linkWeapon = bonus.selectweapon;
    if (typeof linkWeapon === "string") {
      assert(linkWeapon === "");
      bonusObject.linkWeapon = true;
    } else {
      // TODO: handle weapondetails... :(
      linkWeapon._weapondetails;
      bonusObject.linkWeapon = true;
    }
  }
  if ("selectarmor" in bonus && bonus.selectarmor !== undefined) {
    bonusObject.linkArmour = true;
  }
  if ("selectskill" in bonus && bonus.selectskill !== undefined) {
    const linkSkill = bonus.selectskill;
    if (typeof linkSkill === "string") {
      assert(linkSkill === "");
      bonusObject.linkSkill = true;
    } else {
      // TODO: handle
    }
  }
  if ("selectattribute" in bonus && bonus.selectattribute !== undefined) {
    // TODO: handle
  }
  if ("selectpowers" in bonus && bonus.selectpowers !== undefined) {
    const linkPower = bonus.selectpowers;
    if (typeof linkPower === "string") {
      assert(linkPower === "");
      bonusObject.linkPower = true;
    } else {
      // TODO: handle
    }
  }
  if ("selecttradition" in bonus && bonus.selecttradition !== undefined) {
    const linkTradition = bonus.selecttradition;
    if (typeof linkTradition === "string") {
      assert(linkTradition === "");
      bonusObject.linkTradition = true;
    } else {
      // TODO: handle
    }
  }
  if ("selectrestricted" in bonus && bonus.selectrestricted !== undefined) {
    const linkLicense = bonus.selectrestricted;
    assert(linkLicense === "");
    bonusObject.linkLicense = true;
  }
  if ("selectcyberware" in bonus && bonus.selectcyberware !== undefined) {
    const linkCyberware = bonus.selectcyberware;
    if (typeof linkCyberware === "string") {
      assert(linkCyberware === "");
      bonusObject.linkCyberware = true;
    } else {
      // TODO: handle
    }
  }
  if ("skillcategory" in bonus && bonus.skillcategory !== undefined) {
    const skillCategoryList = Array.isArray(bonus.skillcategory)
      ? bonus.skillcategory
      : [bonus.skillcategory];
    bonusObject.skillCategories = skillCategoryList.map((category) => {
      return {
        category: category.name,
        bonus: convertRatingUnion(category.bonus),
      };
    });
  }
  if ("skillgroup" in bonus && bonus.skillgroup !== undefined) {
    const skillGroupList = Array.isArray(bonus.skillgroup)
      ? bonus.skillgroup
      : [bonus.skillgroup];
    bonusObject.skillGroups = skillGroupList.map((group) => {
      return {
        group: group.name,
        bonus: convertRatingUnion(group.bonus),
      };
    });
  }
  if ("activesoft" in bonus && bonus.activesoft !== undefined) {
    const activeSoft = bonus.activesoft;
    bonusObject.activeSoft = { option: activeSoft.val };
  }
  if ("skillsoft" in bonus && bonus.skillsoft !== undefined) {
    const skillSoft = bonus.skillsoft;
    bonusObject.skillSoft = {
      bonus: {
        option: skillSoft.val,
      },
      excludedCategory: skillSoft._excludecategory,
      specificCategory: skillSoft._skillcategory,
    };
  }
  if ("skillsoftaccess" in bonus && bonus.skillsoftaccess !== undefined) {
    const skillsoftaccess = bonus.skillsoftaccess;
    bonusObject.skillSoftMaxRating = {
      bonus: {
        option: skillsoftaccess.xmltext,
      },
    };
  }
  if ("skillwire" in bonus && bonus.skillwire !== undefined) {
    // const skillwire = bonus.skillwire;
    // let activeSoftMaxRating;
    // if (typeof skillwire === "string") activeSoftMaxRating = skillwire;
    // else activeSoftMaxRating = skillwire
    // bonusObject.activeSoftMaxRating = {
    //   bonus: skillwire,
    // };
  }
  if ("hardwires" in bonus && bonus.hardwires !== undefined) {
    const hardwire = bonus.hardwires;
    if ("_knowledgeskill" in hardwire) {
      bonusObject.skillSoftMaxRating = {
        bonus: {
          option: hardwire.xmltext,
        },
      };
    } else {
      bonusObject.activeSoftMaxRating = {
        // TODO: add exclude categories
        option: hardwire.xmltext,
      };
    }
  }
  if ("limit" in bonus && bonus.limit !== undefined) {
    // const limitList = Array.isArray(bonus.limit)
    //   ? bonus.limit
    //   : [bonus.limit];
    // limitList.map((limit) => {
    //   bonus: {
    //     option: skillsoftaccess.xmltext,
    //   },
    // };
  }
  if ("limitmodifier" in bonus && bonus.limitmodifier !== undefined) {
    // const limitModifierList = Array.isArray(bonus.limitmodifier)
    //   ? bonus.limitmodifier
    //   : [bonus.limitmodifier];
    // limitModifierList.map((limit) => {
    //   return {
    //     bonus: {
    //       option: limit.value,
    //     },
    //     limitCategory: limit.limit,
    //     condition: limit.condition,
    //   };
    // });
  }
  if ("attribute" in bonus && bonus.attribute !== undefined) {
    // bonusObject.attribute = bonusAttribute(bonus.attribute);
  }
  if ("specificattribute" in bonus && bonus.specificattribute !== undefined) {
    // bonusObject.attribute = bonusAttribute(bonus.specificattribute);
  }
  if ("specificskill" in bonus && bonus.specificskill !== undefined) {
    // bonusObject.skill = bonusSkill(bonus.specificskill);
  }
  if ("skillattribute" in bonus && bonus.skillattribute !== undefined) {
    // bonusObject.skill = bonusSkill(bonus.skillattribute);
  }
  if (
    "skilllinkedattribute" in bonus &&
    bonus.skilllinkedattribute !== undefined
  ) {
    // bonusObject.skill = bonusSkill(bonus.skilllinkedattribute);
  }
  if ("spellcategory" in bonus && bonus.spellcategory !== undefined) {
    const spellCategory = bonus.spellcategory;
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
    bonusObject.spellCategory = {
      limitCategory: category,
      bonus: value,
    };
  }
  if ("essencepenaltyt100" in bonus && bonus.essencepenaltyt100 !== undefined) {
    const match = EssenceCost.match(bonus.essencepenaltyt100.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    // TODO: fix this! the schema is wrong
    bonusObject.essenceCostTimes100 = essenceCostSemantics(match).eval();
  }
  if ("weaponspecificdice" in bonus && bonus.weaponspecificdice !== undefined) {
    const specificWeaponBonus =
      bonus.weaponspecificdice.xmltext === "Rating"
        ? { option: bonus.weaponspecificdice.xmltext }
        : bonus.weaponspecificdice.xmltext;
    bonusObject.specificWeapon = {
      bonus: specificWeaponBonus,
      weaponType: weaponTypeConversion(bonus.weaponspecificdice._type),
    };
  }
  if ("weaponaccuracy" in bonus && bonus.weaponaccuracy !== undefined) {
    bonusObject.weaponAccuracy = {
      weapon: bonus.weaponaccuracy.name,
      bonus: bonus.weaponaccuracy.value,
    };
  }
  if (
    "weaponskillaccuracy" in bonus &&
    bonus.weaponskillaccuracy !== undefined
  ) {
    const weaponSkillAccuracy = bonus.weaponskillaccuracy;
    let skill: SelectSkillType;
    if (weaponSkillAccuracy.selectskill !== undefined) {
      let exceptions: Array<string> = [];
      if (weaponSkillAccuracy.selectskill._knowledgeskills !== undefined) {
        exceptions.push("Knowledge Skills Disallowed");
      }
      const excludedCategory = weaponSkillAccuracy.selectskill._exludecategory;
      if (excludedCategory !== undefined) {
        exceptions.push(`No category: ${excludedCategory}`);
      }
      const skillCategory = weaponSkillAccuracy.selectskill._skillcategory;
      if (skillCategory !== undefined) {
        exceptions.push(`No category: ${skillCategory}`);
      }
      const excludeSkill = weaponSkillAccuracy.selectskill._excludeskill;
      if (excludeSkill !== undefined) {
        exceptions.push(`No skill: ${excludeSkill}`);
      }
      skill = {
        selectSkill: true,
        exceptions: exceptions,
      };
    } else {
      assert(weaponSkillAccuracy.name !== undefined);
      skill = {
        selectSkill: false,
        name: weaponSkillAccuracy.name,
      };
    }
    bonusObject.weaponSkillAccuracy = {
      skill: skill,
      bonus: weaponSkillAccuracy.value,
    };
  }
  if ("smartlink" in bonus && bonus.smartlink !== undefined) {
    bonusObject.smartlinkAccuracy = bonus.smartlink;
  }
  if ("initiative" in bonus && bonus.initiative !== undefined) {
    let initiative;
    if (typeof bonus.initiative === "number") {
      initiative = bonus.initiative;
    } else {
      assert(bonus.initiative.xmltext !== undefined);
      const initiativeText = bonus.initiative.xmltext;
      if (typeof initiativeText === "number") {
        initiative = initiativeText;
      } else {
        const match = Initiative.match(initiativeText);
        if (match.failed()) {
          assert(false, match.message);
        }
        initiative = initiativeSemantics(match).eval();
      }
    }
    bonusObject.initiative = { bonus: initiative };
  }
  if ("initiativedice" in bonus && bonus.initiativedice !== undefined) {
    bonusObject.initiative = {
      bonusDice: bonus.initiativedice,
    };
  }
  if ("initiativepass" in bonus && bonus.initiativepass !== undefined) {
    let initiative;
    if (typeof bonus.initiativepass === "number") {
      initiative = bonus.initiativepass;
    } else {
      assert(bonus.initiativepass.xmltext !== undefined);
      const initiativeText = bonus.initiativepass.xmltext;
      const match = Initiative.match(initiativeText.toString());
      if (match.failed()) {
        assert(false, match.message);
      }
      initiative = initiativeSemantics(match).eval();
    }
    bonusObject.initiative = { bonusDice: initiative };
  }
  if (
    "matrixinitiativedice" in bonus &&
    bonus.matrixinitiativedice !== undefined
  ) {
    bonusObject.matrixInitiative = {
      bonusDice: bonus.matrixinitiativedice.xmltext,
    };
  }
  if ("toxincontactresist" in bonus && bonus.toxincontactresist !== undefined) {
    const toxinContactResist =
      typeof bonus.toxincontactresist === "number"
        ? bonus.toxincontactresist
        : { option: bonus.toxincontactresist };
    bonusObject.toxinContactResist = toxinContactResist;
  }
  if (
    "pathogencontactresist" in bonus &&
    bonus.pathogencontactresist !== undefined
  ) {
    const pathogenContactResist =
      typeof bonus.pathogencontactresist === "number"
        ? bonus.pathogencontactresist
        : { option: bonus.pathogencontactresist };
    bonusObject.pathogenContactResist = pathogenContactResist;
  }
  if ("toxincontactimmune" in bonus && bonus.toxincontactimmune !== undefined) {
    bonusObject.toxinContactImmune = true;
  }
  if (
    "pathogencontactimmune" in bonus &&
    bonus.pathogencontactimmune !== undefined
  ) {
    bonusObject.pathogenContactImmune = true;
  }
  if (
    "toxininhalationresist" in bonus &&
    bonus.toxininhalationresist !== undefined
  ) {
    const toxinInhalationResist =
      typeof bonus.toxininhalationresist === "number"
        ? bonus.toxininhalationresist
        : { option: bonus.toxininhalationresist };
    bonusObject.toxinInhalationResist = toxinInhalationResist;
  }
  if (
    "pathogeninhalationresist" in bonus &&
    bonus.pathogeninhalationresist !== undefined
  ) {
    const pathogenInhalationResist =
      typeof bonus.pathogeninhalationresist === "number"
        ? bonus.pathogeninhalationresist
        : { option: bonus.pathogeninhalationresist };
    bonusObject.pathogenInhalationResist = pathogenInhalationResist;
  }
  if (
    "toxininhalationimmune" in bonus &&
    bonus.toxininhalationimmune !== undefined
  ) {
    bonusObject.toxinInhalationImmune = true;
  }
  if (
    "pathogeninhalationimmune" in bonus &&
    bonus.pathogeninhalationimmune !== undefined
  ) {
    bonusObject.pathogenInhalationImmune = true;
  }
  if (
    "toxiningestionresist" in bonus &&
    bonus.toxiningestionresist !== undefined
  ) {
    const toxinIngestionResist =
      typeof bonus.toxiningestionresist === "number"
        ? bonus.toxiningestionresist
        : { option: bonus.toxiningestionresist };
    bonusObject.toxinIngestionResist = toxinIngestionResist;
  }
  if (
    "pathogeningestionresist" in bonus &&
    bonus.pathogeningestionresist !== undefined
  ) {
    const pathogenIngestionResist =
      typeof bonus.pathogeningestionresist === "number"
        ? bonus.pathogeningestionresist
        : { option: bonus.pathogeningestionresist };
    bonusObject.pathogenIngestionResist = pathogenIngestionResist;
  }
  if (
    "toxiningestionimmune" in bonus &&
    bonus.toxiningestionimmune !== undefined
  ) {
    bonusObject.toxinIngestionImmune = true;
  }
  if (
    "pathogeningestionimmune" in bonus &&
    bonus.pathogeningestionimmune !== undefined
  ) {
    bonusObject.pathogenIngestionImmune = true;
  }
  if (
    "toxininjectionresist" in bonus &&
    bonus.toxininjectionresist !== undefined
  ) {
    const toxinInjectionResist =
      typeof bonus.toxininjectionresist === "number"
        ? bonus.toxininjectionresist
        : { option: bonus.toxininjectionresist };
    bonusObject.toxinInjectionResist = toxinInjectionResist;
  }
  if (
    "pathogeninjectionresist" in bonus &&
    bonus.pathogeninjectionresist !== undefined
  ) {
    const pathogenInjectionResist =
      typeof bonus.pathogeninjectionresist === "number"
        ? bonus.pathogeninjectionresist
        : { option: bonus.pathogeninjectionresist };
    bonusObject.pathogenInjectionResist = pathogenInjectionResist;
  }
  if (
    "toxininjectionimmune" in bonus &&
    bonus.toxininjectionimmune !== undefined
  ) {
    bonusObject.toxinInjectionImmune = true;
  }
  if (
    "pathogeninjectionimmune" in bonus &&
    bonus.pathogeninjectionimmune !== undefined
  ) {
    bonusObject.pathogenInjectionImmune = true;
  }
  if ("fatigueresist" in bonus && bonus.fatigueresist !== undefined) {
    const fatigueResist =
      typeof bonus.fatigueresist === "number"
        ? bonus.fatigueresist
        : { option: bonus.fatigueresist };
    bonusObject.fatigueResist = fatigueResist;
  }
  if ("sociallimit" in bonus && bonus.sociallimit !== undefined) {
    bonusObject.socialLimit = convertRatingUnion(bonus.sociallimit);
  }
  if ("physicallimit" in bonus && bonus.physicallimit !== undefined) {
    const physicalLimit =
      typeof bonus.physicallimit === "number"
        ? bonus.physicallimit
        : { option: bonus.physicallimit };
    bonusObject.physicalLimit = physicalLimit;
  }
  if ("mentallimit" in bonus && bonus.mentallimit !== undefined) {
    const mentalLimit =
      typeof bonus.mentallimit === "number"
        ? bonus.mentallimit
        : { option: bonus.mentallimit };
    bonusObject.mentalLimit = mentalLimit;
  }
  {
    // qualities scope
    let qualities: BonusQualityListType = [];
    if ("quality" in bonus && bonus.quality !== undefined) {
      const rating = Number(bonus.quality._rating);
      assert(!isNaN(rating));
      qualities = qualities.concat([
        { name: bonus.quality.xmltext, rating: rating },
      ]);
    }
    if ("addqualities" in bonus && bonus.addqualities !== undefined) {
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
      bonusObject.qualities = qualities;
    }
  }
  if ("disablequality" in bonus && bonus.disablequality !== undefined) {
    const disableQualities =
      typeof bonus.disablequality === "string"
        ? [{ name: bonus.disablequality }]
        : bonus.disablequality.map((quality) => {
            return { name: quality };
          });
    bonusObject.disableQualities = disableQualities;
  }
  if ("damageresistance" in bonus && bonus.damageresistance !== undefined) {
    const damageResistance =
      typeof bonus.damageresistance === "number"
        ? bonus.damageresistance
        : { option: bonus.damageresistance };
    bonusObject.damageResistance = damageResistance;
  }
  if ("radiationresist" in bonus && bonus.radiationresist !== undefined) {
    const radiationResistance =
      typeof bonus.radiationresist === "number"
        ? bonus.radiationresist
        : { option: bonus.radiationresist };
    bonusObject.radiationResistance = radiationResistance;
  }
  if ("sonicresist" in bonus && bonus.sonicresist !== undefined) {
    const sonicResistance =
      typeof bonus.sonicresist === "number"
        ? bonus.sonicresist
        : { option: bonus.sonicresist };
    bonusObject.sonicResistance = sonicResistance;
  }
  if ("unarmeddvphysical" in bonus && bonus.unarmeddvphysical !== undefined) {
    bonusObject.unarmedDamageType = damageTypeEnum.Physical;
  }
  if ("attributekarmacost" in bonus && bonus.attributekarmacost !== undefined) {
    const karmaCost = Array.isArray(bonus.attributekarmacost)
      ? bonus.attributekarmacost.map((karmaCost) => {
          return convertKarmaCost(karmaCost);
        })
      : [convertKarmaCost(bonus.attributekarmacost)];
    bonusObject.modifyAttributeImprovementKarmaCost = karmaCost;
  }
  if (
    "knowledgeskillkarmacost" in bonus &&
    bonus.knowledgeskillkarmacost !== undefined
  ) {
    const karmaCostArray = Array.isArray(bonus.knowledgeskillkarmacost)
      ? bonus.knowledgeskillkarmacost
      : [bonus.knowledgeskillkarmacost];
    bonusObject.modifySkillImprovementKarmaCost = karmaCostArray.map(
      (karmaCost) => {
        assert("val" in karmaCost, JSON.stringify(karmaCost));
        const conditionalBonus = karmaCost.val;
        assert(conditionalBonus !== undefined);
        const match = SkillKarmaCost.match(conditionalBonus.toString());
        if (match.failed()) {
          assert(false, match.message);
        }
        let skillRating;
        if ("min" in karmaCost) {
          assert(typeof karmaCost.min === "number");
          skillRating = {
            minimum: karmaCost.min,
          };
        } else {
          assert(typeof karmaCost.max === "number");
          skillRating = {
            maximum: karmaCost.max,
          };
        }
        return {
          skillRating: skillRating,
          conditionalBonus: skillKarmaCostSemantics(match).eval(),
        };
      }
    );
  }
  if ("conditionmonitor" in bonus && bonus.conditionmonitor !== undefined) {
    const conditionMonitor = bonus.conditionmonitor;
    if (
      "sharedthresholdoffset" in conditionMonitor &&
      conditionMonitor.sharedthresholdoffset !== undefined
    ) {
      const ignoreConditionModifierNegativeEffects =
        typeof conditionMonitor.sharedthresholdoffset === "number"
          ? conditionMonitor.sharedthresholdoffset
          : { option: conditionMonitor.sharedthresholdoffset };
      bonusObject.ignoreConditionModifierNegativeEffects =
        ignoreConditionModifierNegativeEffects;
    }
    if (
      "physical" in conditionMonitor &&
      conditionMonitor.physical !== undefined
    ) {
      bonusObject.addPhysicalBoxes = conditionMonitor.physical;
    }
  }
  if ("walkmultiplier" in bonus && bonus.walkmultiplier !== undefined) {
    if (Array.isArray(bonus.walkmultiplier)) {
      assert(bonus.walkmultiplier.length === 2);

      let percentage: number;
      if (bonus.walkmultiplier[0].percent) {
        assert(bonus.walkmultiplier[0].val === undefined);
        percentage = bonus.walkmultiplier[0].percent;
      } else {
        assert(bonus.walkmultiplier[0].val !== undefined);
        assert(bonus.walkmultiplier[0].percent === undefined);
        percentage = bonus.walkmultiplier[0].val * 100;
      }
      if (bonus.walkmultiplier[0].category === "Swim") {
        bonusObject.swimSpeedPercentageModifier = percentage;
      } else {
        bonusObject.walkSpeedPercentageModifier = percentage;
      }

      // second multiplier
      if (bonus.walkmultiplier[1].percent) {
        assert(bonus.walkmultiplier[1].val === undefined);
        percentage = bonus.walkmultiplier[1].percent;
      } else {
        assert(bonus.walkmultiplier[1].val !== undefined);
        assert(bonus.walkmultiplier[1].percent === undefined);
        percentage = bonus.walkmultiplier[1].val * 100;
      }
      if (bonus.walkmultiplier[1].category === "Swim") {
        bonusObject.swimSpeedPercentageModifier = percentage;
      } else {
        bonusObject.walkSpeedPercentageModifier = percentage;
      }
    } else {
      let percentage: number;
      if (bonus.walkmultiplier.percent) {
        assert(bonus.walkmultiplier.val === undefined);
        percentage = bonus.walkmultiplier.percent;
      } else {
        assert(bonus.walkmultiplier.val !== undefined);
        assert(bonus.walkmultiplier.percent === undefined);
        percentage = bonus.walkmultiplier.val * 100;
      }
      if (bonus.walkmultiplier.category === "Swim") {
        bonusObject.swimSpeedPercentageModifier = percentage;
      } else {
        bonusObject.walkSpeedPercentageModifier = percentage;
      }
    }
  }
  if ("runmultiplier" in bonus && bonus.runmultiplier !== undefined) {
    let percentage: number;
    if (bonus.runmultiplier.percent) {
      assert(bonus.runmultiplier.val === undefined);
      percentage = bonus.runmultiplier.percent;
    } else {
      assert(bonus.runmultiplier.val !== undefined);
      assert(bonus.runmultiplier.percent === undefined);
      percentage = bonus.runmultiplier.val * 100;
    }
    bonusObject.runSpeedPercentageModifier = percentage;
  }
  if ("sprintbonus" in bonus && bonus.sprintbonus !== undefined) {
    let percentage: number;
    if (bonus.sprintbonus.percent) {
      assert(bonus.sprintbonus.val === undefined);
      percentage = bonus.sprintbonus.percent;
    } else {
      assert(bonus.sprintbonus.val !== undefined);
      assert(bonus.sprintbonus.percent === undefined);
      percentage = bonus.sprintbonus.val * 100;
    }
    bonusObject.sprintSpeedPercentageModifier = percentage;
  }
  if ("lifestylecost" in bonus && bonus.lifestylecost !== undefined) {
    const lifestyleCostArray = Array.isArray(bonus.lifestylecost)
      ? bonus.lifestylecost
      : [bonus.lifestylecost];
    bonusObject.lifestyleCostModifier = lifestyleCostArray.map(
      (lifestyleCost) => {
        if (typeof lifestyleCost === "object") {
          return {
            lifestyle: lifestyleCost._lifestyle,
            cost: lifestyleCost.xmltext,
          };
        } else {
          return { cost: lifestyleCost };
        }
      }
    );
  }
  if ("stuncmrecovery" in bonus && bonus.stuncmrecovery !== undefined) {
    const stunHealing =
      typeof bonus.stuncmrecovery === "number"
        ? bonus.stuncmrecovery
        : { option: bonus.stuncmrecovery };
    bonusObject.stunHealing = stunHealing;
  }
  if ("physicalcmrecovery" in bonus && bonus.physicalcmrecovery !== undefined) {
    const physicalHealing =
      typeof bonus.physicalcmrecovery === "number"
        ? bonus.physicalcmrecovery
        : { option: bonus.physicalcmrecovery };
    bonusObject.physicalHealing = physicalHealing;
  }
  if ("armor" in bonus && bonus.armor !== undefined) {
    const armour =
      typeof bonus.armor === "number"
        ? bonus.armor
        : typeof bonus.armor === "string"
        ? { option: "Rating" as const }
        : typeof bonus.armor.xmltext === "number"
        ? bonus.armor.xmltext
        : { option: bonus.armor.xmltext };

    bonusObject.armour = {
      bonus: armour,
      ...(typeof bonus.armor === "object" && { nonStacking: true }),
    };
  }
  if ("firearmor" in bonus && bonus.firearmor !== undefined) {
    const fireArmour =
      typeof bonus.firearmor === "number"
        ? bonus.firearmor
        : { option: bonus.firearmor };
    bonusObject.fireArmour = fireArmour;
  }
  if ("electricityarmor" in bonus && bonus.electricityarmor !== undefined) {
    const electricityArmour =
      typeof bonus.electricityarmor === "number"
        ? bonus.electricityarmor
        : { option: bonus.electricityarmor };
    bonusObject.electricityArmour = electricityArmour;
  }
  if ("coldarmor" in bonus && bonus.coldarmor !== undefined) {
    const coldArmour =
      typeof bonus.coldarmor === "number"
        ? bonus.coldarmor
        : { option: bonus.coldarmor };
    bonusObject.coldArmour = coldArmour;
  }
  if ("dodge" in bonus && bonus.dodge !== undefined) {
    bonusObject.dodge = convertRatingUnion(bonus.dodge);
  }
  if ("unarmedreach" in bonus && bonus.unarmedreach !== undefined) {
    bonusObject.unarmedReach = bonus.unarmedreach;
  }
  {
    // addiction scope
    let physiologicalInitial, physiologicalProgressing;
    let psychologicalInitial, psychologicalProgressing;

    if (
      "physiologicaladdictionfirsttime" in bonus &&
      bonus.physiologicaladdictionfirsttime !== undefined
    ) {
      physiologicalInitial = convertRatingUnion(
        bonus.physiologicaladdictionfirsttime
      );
    }
    if (
      "physiologicaladdictionalreadyaddicted" in bonus &&
      bonus.physiologicaladdictionalreadyaddicted !== undefined
    ) {
      physiologicalProgressing = convertRatingUnion(
        bonus.physiologicaladdictionalreadyaddicted
      );
    }
    const physiological =
      physiologicalInitial !== undefined ||
      physiologicalProgressing !== undefined
        ? {
            initialTest:
              physiologicalInitial !== undefined ? physiologicalInitial : [0],
            progressingTest:
              physiologicalProgressing !== undefined
                ? physiologicalProgressing
                : [0],
          }
        : undefined;

    if (
      "psychologicaladdictionfirsttime" in bonus &&
      bonus.psychologicaladdictionfirsttime !== undefined
    ) {
      psychologicalInitial = convertRatingUnion(
        bonus.psychologicaladdictionfirsttime
      );
    }
    if (
      "psychologicaladdictionalreadyaddicted" in bonus &&
      bonus.psychologicaladdictionalreadyaddicted !== undefined
    ) {
    }
    const psychological =
      psychologicalInitial !== undefined ||
      psychologicalProgressing !== undefined
        ? {
            initialTest:
              psychologicalInitial !== undefined ? psychologicalInitial : [0],
            progressingTest:
              psychologicalProgressing !== undefined
                ? psychologicalProgressing
                : [0],
          }
        : undefined;

    if (physiological !== undefined || psychological !== undefined) {
      bonusObject.addictionResistance = {
        ...(physiological !== undefined && { physiological: physiological }),
        ...(psychological !== undefined && { psychological: psychological }),
      };
    }
  }
  if ("composure" in bonus && bonus.composure !== undefined) {
    bonusObject.composure = bonus.composure;
  }
  if (
    "judgeintentionsdefense" in bonus &&
    bonus.judgeintentionsdefense !== undefined
  ) {
    bonusObject.judgeIntentionsDefense = convertRatingUnion(
      bonus.judgeintentionsdefense
    );
  }
  if ("memory" in bonus && bonus.memory !== undefined) {
    bonusObject.memory = convertRatingUnion(bonus.memory);
  }
  if ("drainresist" in bonus && bonus.drainresist !== undefined) {
    bonusObject.drainResist = convertRatingUnion(bonus.drainresist);
  }
  if ("fadingresist" in bonus && bonus.fadingresist !== undefined) {
    bonusObject.fadingResist = convertRatingUnion(bonus.fadingresist);
  }
  if (
    "directmanaspellresist" in bonus &&
    bonus.directmanaspellresist !== undefined
  ) {
    bonusObject.directManaResist = convertRatingUnion(
      bonus.directmanaspellresist
    );
  }
  if (
    "detectionspellresist" in bonus &&
    bonus.detectionspellresist !== undefined
  ) {
    bonusObject.detectionResist = convertRatingUnion(
      bonus.detectionspellresist
    );
    bonus.detectionspellresist;
  }
  if ("manaillusionresist" in bonus && bonus.manaillusionresist !== undefined) {
    bonusObject.manaIllusionResist = convertRatingUnion(
      bonus.manaillusionresist
    );
    bonus.manaillusionresist;
  }
  if (
    "mentalmanipulationresist" in bonus &&
    bonus.mentalmanipulationresist !== undefined
  ) {
    bonusObject.mentalManipulationResist = convertRatingUnion(
      bonus.mentalmanipulationresist
    );
  }
  if ("decreasebodresist" in bonus && bonus.decreasebodresist !== undefined) {
    bonusObject.decreaseBodyResist = convertRatingUnion(
      bonus.decreasebodresist
    );
  }
  if ("decreaseagiresist" in bonus && bonus.decreaseagiresist !== undefined) {
    bonusObject.decreaseAgilityResist = convertRatingUnion(
      bonus.decreaseagiresist
    );
  }
  if ("decreaserearesist" in bonus && bonus.decreaserearesist !== undefined) {
    bonusObject.decreaseReasonanceResist = convertRatingUnion(
      bonus.decreaserearesist
    );
  }
  if ("decreasestrresist" in bonus && bonus.decreasestrresist !== undefined) {
    bonusObject.decreaseStrengthResist = convertRatingUnion(
      bonus.decreasestrresist
    );
  }
  if ("decreasecharesist" in bonus && bonus.decreasecharesist !== undefined) {
    bonusObject.decreaseCharismaResist = convertRatingUnion(
      bonus.decreasecharesist
    );
  }
  if ("decreaseintresist" in bonus && bonus.decreaseintresist !== undefined) {
    bonusObject.decreaseIntuitionResist = convertRatingUnion(
      bonus.decreaseintresist
    );
  }
  if ("decreaselogresist" in bonus && bonus.decreaselogresist !== undefined) {
    bonusObject.decreaseLogicResist = convertRatingUnion(
      bonus.decreaselogresist
    );
  }
  if ("decreasewilresist" in bonus && bonus.decreasewilresist !== undefined) {
    bonusObject.decreaseWillpowerResist = convertRatingUnion(
      bonus.decreasewilresist
    );
  }
  if ("addlimb" in bonus && bonus.addlimb !== undefined) {
    const limbSlot = convertLimbSlot(bonus.addlimb.limbslot);
    bonusObject.addLimb = {
      limbSlot: limbSlot,
      numberOfLimbs: bonus.addlimb.val,
    };
  }
  if ("addspirit" in bonus && bonus.addspirit !== undefined) {
    // const addSpirits = Array.isArray(bonus.addspirit)
    // ? bonus.addspirit
    // : [bonus.addspirit];
    //TODO: handle
  }
  if ("adapsin" in bonus && bonus.adapsin !== undefined) {
    bonusObject.adapsin = true;
  }
  // TODO: Reflex is not defined
  // if ("reflex" in bonus && bonus.reflex !== undefined) {
  //   bonusObject.reflex = true;
  // }
  if ("ambidextrous" in bonus && bonus.ambidextrous !== undefined) {
    bonusObject.ambidextrous = true;
  }
  if (Object.keys(bonusObject).length === 0) {
    return undefined;
  }
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

export const bonusSkill = function (skillInput: SkillListType) {
  const skillList = Array.isArray(skillInput) ? skillInput : [skillInput];
  return skillList.map((skill) => {
    return {
      name: skill.name,
    };
  });
};

const spellCategoryConversion = function (category: string) {
  const spellCategoryEnumSchema = zod.nativeEnum(spellCategoryEnum);
  const categoryEnum = spellCategoryEnumSchema.safeParse(category);
  assert(categoryEnum.success, `spellCategoryEnum not found: ${category}`);
  return categoryEnum.data;
};

const weaponTypeConversion = function (type: string) {
  const weaponTypeEnumSchema = zod.nativeEnum(weaponTypeEnum);
  const typeEnum = weaponTypeEnumSchema.safeParse(type);
  assert(typeEnum.success, `weaponTypeEnum enum not found: ${type}`);
  return typeEnum.data;
};

export const convertKarmaCost = function (karmaCost: GenericNameValueType) {
  assert(karmaCost.name !== undefined);
  const name = karmaCost.name as attributeXMLEnum;
  assert(Object.values(attributeXMLEnum).includes(name));

  assert(typeof karmaCost.val === "number");

  return {
    name: convertAttribute(name),
    bonus: karmaCost.val,
  };
};

const convertRatingUnion = function (unionObject: NumberOrAnyRatingType) {
  if (typeof unionObject === "number") {
    return [unionObject];
  } else {
    if (unionObject === "-Rating") {
      return [
        -1,
        { operator: mathOperatorEnum.Multiply },
        { option: "Rating" as const },
      ];
    } else {
      return [{ option: unionObject }];
    }
  }
};

// const getListFromOtherFile = function (fileName: string, xmlNodePath: string) {
//   const currentPath = import.meta.url;
//   const xml_string = fs.readFileSync(
//     fileURLToPath(path.dirname(currentPath) + `../../../../xmls/${fileName}`),
//     "utf8"
//   );
//   const parser = new XMLParser({
//     ignoreAttributes: false,
//     attributeNamePrefix: "_",
//     textNodeName: "xmltext",
//   });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const jObj: any = parser.parse(xml_string);
//   // console.log(
//   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   //   jObj.chummer.armors.armor[193].gears.usegear
//   // );
//   const nodePaths = xmlNodePath.split("|")
//   nodePaths.forEach((nodePath)=>{
//     nodePath
//   })

//   const armourListParsed = ArmourListXmlSchema.safeParse(
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     jObj.chummer.armors.armor
//   );
// };
