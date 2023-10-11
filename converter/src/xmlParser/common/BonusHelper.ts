import { z as zod } from "zod";
import {
  damageTypeEnum,
  limbSlotEnum,
  mathOperatorEnum,
  spellCategoryEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import {
  BonusType,
  QualityListType,
  SelectSkillType,
} from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import assert from "assert";
import {
  attributeXMLEnum,
  GenericNameValueListType,
  GenericNameValueType,
  limbSlotXmlEnum,
  SkillListType,
} from "./ParserCommonDefines.js";
import Bonus from "../../grammar/bonus.ohm-bundle.js";
import {
  essenceCostSemantics,
  initiativeSemantics,
  skillKarmaCostSemantics,
} from "./ParserSemanticsHelper.js";
import { convertAttribute } from "./ParserHelper.js";
import type { BonusXmlType } from "./BonusParserSchemas.js";
const EssenceCost = Bonus.EssenceCost;
const Initiative = Bonus.Initiative;
const SkillKarmaCost = Bonus.SkillKarmaCost;

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
      const bonus =
        typeof category.bonus === "number"
          ? category.bonus
          : { option: category.bonus };
      return {
        category: category.name,
        bonus: bonus,
      };
    });
  }
  if ("skillgroup" in bonus && bonus.skillgroup !== undefined) {
    const skillGroupList = Array.isArray(bonus.skillgroup)
      ? bonus.skillgroup
      : [bonus.skillgroup];
    bonusObject.skillGroups = skillGroupList.map((group) => {
      const bonus =
        typeof group.bonus === "number" ? group.bonus : { option: group.bonus };
      return {
        group: group.name,
        bonus: bonus,
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
    const category = spellCategoryConversion(spellCategory.name);
    bonusObject.spellCategory = {
      limitCategory: category,
      bonus: {
        option: "Rating",
      },
    };
  }
  if ("essencepenaltyt100" in bonus && bonus.essencepenaltyt100 !== undefined) {
    const match = EssenceCost.match(bonus.essencepenaltyt100);
    if (match.failed()) {
      throw match.message;
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
          throw match.message;
        }
        // TODO: fix this! the schema is wrong
        initiative = initiativeSemantics(match).eval();
      }
    }
    bonusObject.initiative = { bonus: initiative };
  }
  if ("initiativedice" in bonus && bonus.initiativedice !== undefined) {
    bonusObject.initiative = {
      bonusDice: [bonus.initiativedice],
    };
  }
  if ("initiativepass" in bonus && bonus.initiativepass !== undefined) {
    let initiative;
    if (typeof bonus.initiativepass === "number") {
      initiative = [bonus.initiativepass];
    } else {
      assert(bonus.initiativepass.xmltext !== undefined);
      const initiativeText = bonus.initiativepass.xmltext;
      if (typeof initiativeText === "number") {
        initiative = [initiativeText];
      } else {
        const match = Initiative.match(initiativeText);
        if (match.failed()) {
          throw match.message;
        }
        // TODO: fix this! the schema is wrong
        initiative = initiativeSemantics(match).eval();
      }
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
    // fix this weird type error... Also create an enum for rating
    const temp: "Rating" = "Rating";
    let socialLimit;
    if (typeof bonus.sociallimit === "number") {
      socialLimit = [bonus.sociallimit];
    } else if (bonus.sociallimit === "Rating") {
      socialLimit = [{ option: temp }];
    } else {
      assert(bonus.sociallimit === "-Rating");
      socialLimit = [
        -1,
        { operator: mathOperatorEnum.Multiply },
        { option: temp },
      ];
    }
    bonusObject.socialLimit = socialLimit;
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
    const qualities: QualityListType = [];
    if ("quality" in bonus && bonus.quality !== undefined) {
      const rating = Number(bonus.quality._rating);
      assert(!isNaN(rating));
      qualities.concat([{ name: bonus.quality.xmltext, rating: rating }]);
    }
    if ("addqualities" in bonus && bonus.addqualities !== undefined) {
      const qualityArray =
        typeof bonus.addqualities.addquality === "string"
          ? [{ name: bonus.addqualities.addquality }]
          : bonus.addqualities.addquality.map((quality) => {
              return { name: quality };
            });
      qualities.concat(qualityArray);
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
    assert("val" in bonus.knowledgeskillkarmacost);
    const conditionalBonus = bonus.knowledgeskillkarmacost.val;
    assert(conditionalBonus !== undefined);
    const match = SkillKarmaCost.match(conditionalBonus.toString());
    if (match.failed()) {
      throw match.message;
    }
    let skillRating;
    if ("min" in bonus.knowledgeskillkarmacost) {
      assert(typeof bonus.knowledgeskillkarmacost.min === "number");
      skillRating = {
        minimum: bonus.knowledgeskillkarmacost.min,
      };
    } else {
      assert(typeof bonus.knowledgeskillkarmacost.max === "number");
      skillRating = {
        maximum: bonus.knowledgeskillkarmacost.max,
      };
    }
    bonusObject.modifySkillImprovementKarmaCost = {
      skillRating: skillRating,
      conditionalBonus: skillKarmaCostSemantics(match).eval(),
    };
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
    bonusObject.lifestyleCostModifier = bonus.lifestylecost;
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
        ? { option: bonus.armor }
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
    bonusObject.dodge = bonus.dodge;
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
      physiologicalInitial =
        typeof bonus.physiologicaladdictionfirsttime === "number"
          ? bonus.physiologicaladdictionfirsttime
          : { option: bonus.physiologicaladdictionfirsttime };
    }
    if (
      "physiologicaladdictionalreadyaddicted" in bonus &&
      bonus.physiologicaladdictionalreadyaddicted !== undefined
    ) {
      physiologicalProgressing =
        typeof bonus.physiologicaladdictionalreadyaddicted === "number"
          ? bonus.physiologicaladdictionalreadyaddicted
          : { option: bonus.physiologicaladdictionalreadyaddicted };
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
      psychologicalInitial =
        typeof bonus.psychologicaladdictionfirsttime === "number"
          ? bonus.psychologicaladdictionfirsttime
          : { option: bonus.psychologicaladdictionfirsttime };
    }
    if (
      "psychologicaladdictionalreadyaddicted" in bonus &&
      bonus.psychologicaladdictionalreadyaddicted !== undefined
    ) {
      psychologicalProgressing =
        typeof bonus.psychologicaladdictionalreadyaddicted === "number"
          ? bonus.psychologicaladdictionalreadyaddicted
          : { option: bonus.psychologicaladdictionalreadyaddicted };
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
    bonusObject.judgeIntentionsDefense = bonus.judgeintentionsdefense;
  }
  if ("memory" in bonus && bonus.memory !== undefined) {
    const memory =
      typeof bonus.memory === "number"
        ? bonus.memory
        : { option: bonus.memory };
    bonusObject.memory = memory;
  }
  if ("drainresist" in bonus && bonus.drainresist !== undefined) {
    bonusObject.drainResist = bonus.drainresist;
  }
  if ("fadingresist" in bonus && bonus.fadingresist !== undefined) {
    bonusObject.fadingResist = bonus.fadingresist;
  }
  if (
    "directmanaspellresist" in bonus &&
    bonus.directmanaspellresist !== undefined
  ) {
    bonusObject.directManaResist = bonus.directmanaspellresist;
  }
  if (
    "detectionspellresist" in bonus &&
    bonus.detectionspellresist !== undefined
  ) {
    bonusObject.detectionResist = bonus.detectionspellresist;
  }
  if ("manaillusionresist" in bonus && bonus.manaillusionresist !== undefined) {
    bonusObject.manaIllusionResist = bonus.manaillusionresist;
  }
  if (
    "mentalmanipulationresist" in bonus &&
    bonus.mentalmanipulationresist !== undefined
  ) {
    bonusObject.mentalManipulationResist = bonus.mentalmanipulationresist;
  }
  if ("decreasebodresist" in bonus && bonus.decreasebodresist !== undefined) {
    bonusObject.decreaseBodyResist = bonus.decreasebodresist;
  }
  if ("decreaseagiresist" in bonus && bonus.decreaseagiresist !== undefined) {
    bonusObject.decreaseAgilityResist = bonus.decreaseagiresist;
  }
  if ("decreaserearesist" in bonus && bonus.decreaserearesist !== undefined) {
    bonusObject.decreaseReasonanceResist = bonus.decreaserearesist;
  }
  if ("decreasestrresist" in bonus && bonus.decreasestrresist !== undefined) {
    bonusObject.decreaseStrengthResist = bonus.decreasestrresist;
  }
  if ("decreasecharesist" in bonus && bonus.decreasecharesist !== undefined) {
    bonusObject.decreaseCharismaResist = bonus.decreasecharesist;
  }
  if ("decreaseintresist" in bonus && bonus.decreaseintresist !== undefined) {
    bonusObject.decreaseIntuitionResist = bonus.decreaseintresist;
  }
  if ("decreaselogresist" in bonus && bonus.decreaselogresist !== undefined) {
    bonusObject.decreaseLogicResist = bonus.decreaselogresist;
  }
  if ("decreasewilresist" in bonus && bonus.decreasewilresist !== undefined) {
    bonusObject.decreaseWillpowerResist = bonus.decreasewilresist;
  }
  if ("addlimb" in bonus && bonus.addlimb !== undefined) {
    let limbSlot;
    switch (bonus.addlimb.limbslot) {
      case limbSlotXmlEnum.LEG:
        limbSlot = limbSlotEnum.Leg;
        break;
      case limbSlotXmlEnum.ARM:
        limbSlot = limbSlotEnum.Leg;
        break;
      case limbSlotXmlEnum.SKULL:
        limbSlot = limbSlotEnum.Skull;
        break;
      case limbSlotXmlEnum.TORSO:
        limbSlot = limbSlotEnum.Torso;
        break;
      default:
        assert(false);
    }
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
  if ("reflex" in bonus && bonus.reflex !== undefined) {
    bonusObject.reflex = true;
  }
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
