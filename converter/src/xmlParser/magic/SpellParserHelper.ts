import assert from "assert";
import { damageTypeEnum, spellCategoryEnum } from "@shadowrun/common";
import {
  durationEnum,
  spellDescriptorEnum,
  spellRangeEnum,
  spellTargetEnum,
  spellTypeEnum,
} from "@shadowrun/common/build/enums.js";
import {
  spellXmlCategoryEnum,
  SpellXmlDamageType,
  SpellXmlDurationType,
  SpellXmlRangeType,
} from "./SpellParserSchemas.js";
import Spells from "../../grammar/spells.ohm-bundle.js";
const Damage = Spells.Damage;

export const convertSpellCategory = function (category: spellXmlCategoryEnum) {
  switch (category) {
    case spellXmlCategoryEnum.Combat:
      return spellCategoryEnum.Combat;
      break;
    case spellXmlCategoryEnum.Detection:
      return spellCategoryEnum.Detection;
      break;
    case spellXmlCategoryEnum.Health:
      return spellCategoryEnum.Health;
      break;
    case spellXmlCategoryEnum.Illusion:
      return spellCategoryEnum.Illusion;
      break;
    case spellXmlCategoryEnum.Manipulation:
      return spellCategoryEnum.Manipulation;
      break;
    case spellXmlCategoryEnum.Enchantments:
      return spellCategoryEnum.Enchantment;
      break;
    case spellXmlCategoryEnum.Rituals:
      return spellCategoryEnum.Ritual;
      break;
  }
};

export const convertSpellDamageType = function (damage: SpellXmlDamageType) {
  switch (damage) {
    case 0:
      return damageTypeEnum.None;
    case "P":
      return damageTypeEnum.Physical;
    case "S":
      return damageTypeEnum.Stun;
    case "Special":
      return damageTypeEnum.Special;
  }
};

export const convertSpellRange = function (range: SpellXmlRangeType) {
  switch (range) {
    case "S":
      return {
        value: spellRangeEnum.Self,
        target: spellTargetEnum.Target,
      };
    case "S (A)":
      return {
        value: spellRangeEnum.Self,
        target: spellTargetEnum.Area,
      };
    case "T":
      return {
        value: spellRangeEnum.Touch,
        target: spellTargetEnum.Target,
      };
    case "T (A)":
      return {
        value: spellRangeEnum.Touch,
        target: spellTargetEnum.Area,
      };
    case "LOS":
      return {
        value: spellRangeEnum.LineOfSight,
        target: spellTargetEnum.Target,
      };
    case "LOS (A)":
      return {
        value: spellRangeEnum.LineOfSight,
        target: spellTargetEnum.Area,
      };
    case "Special":
      return {
        value: spellRangeEnum.Special,
        target: spellTargetEnum.Target,
      };
  }
};

export const convertSpellDuration = function (duration: SpellXmlDurationType) {
  switch (duration) {
    case "I":
      return durationEnum.Instantaneous;
    case "S":
      return durationEnum.Sustained;
    case "P":
      return durationEnum.Permanent;
    case "Special":
      return durationEnum.Special;
  }
};

export const convertSpellDescriptors = function (descriptors: string) {
  if (descriptors.length === 0) {
    return [];
  }
  const descriptorList = descriptors.split(",");
  return descriptorList.map((descriptor) => {
    switch (descriptor.trim()) {
      case "Direct":
        return spellDescriptorEnum.Direct;
      case "Indirect":
        return spellDescriptorEnum.Indirect;
      case "Active":
        return spellDescriptorEnum.Active;
      case "Passive":
        return spellDescriptorEnum.Passive;
      case "Area":
        return spellDescriptorEnum.Area;
      case "Extended Area":
        return spellDescriptorEnum.ExtendedArea;
      case "Directional":
        return spellDescriptorEnum.Directional;
      case "Psychic":
        return spellDescriptorEnum.Psychic;
      case "Essence":
        return spellDescriptorEnum.Essence;
      case "Negative":
        return spellDescriptorEnum.Negative;
      case "Physical":
        return spellDescriptorEnum.Physical;
      case "Mental":
        return spellDescriptorEnum.Mental;
      case "Environmental":
        return spellDescriptorEnum.Environmental;
      case "Material Link":
        return spellDescriptorEnum.MaterialLink;
      case "Spotter":
        return spellDescriptorEnum.Spotter;
      case "Anchored":
        return spellDescriptorEnum.Anchored;
      case "Blood":
        return spellDescriptorEnum.Blood;
      case "Elemental":
        return spellDescriptorEnum.Elemental;
      case "Realistic":
        return spellDescriptorEnum.Realistic;
      case "Single-Sense":
        return spellDescriptorEnum.SingleSense;
      case "Multi-Sense":
        return spellDescriptorEnum.MultiSense;
      case "Obvious":
        return spellDescriptorEnum.Obvious;
      case "Damaging":
        return spellDescriptorEnum.Damaging;
      case "Spell":
        return spellDescriptorEnum.Spell;
      case "Minion":
        return spellDescriptorEnum.Minion;
      case "Mana":
        return spellDescriptorEnum.Mana;
      case "Contractual":
        return spellDescriptorEnum.Contractual;
      case "Adept":
        return spellDescriptorEnum.Adept;
      case "Organic Link":
        return spellDescriptorEnum.OrganicLink;
      case "Geomancy":
        return spellDescriptorEnum.Geomancy;
      case "Object":
        return spellDescriptorEnum.Object;
      default:
        assert(false, descriptor);
    }
  });
};

export const convertSpellType = function (damage: "M" | "P") {
  switch (damage) {
    case "P":
      return spellTypeEnum.Physical;
    case "M":
      return spellTypeEnum.Mana;
  }
};

const damageSpellSemantics = Damage.createSemantics();
damageSpellSemantics.addOperation("eval", {
  Exp(damage) {
    return damage.eval();
  },
  Damage_add(_, damage) {
    return parseInt(damage.sourceString);
  },
  Damage_minus(_, damage) {
    return parseInt(damage.sourceString);
  },
  Damage_base(_) {
    return 0;
  },
  Special(_) {
    return { option: "Special" };
  },
});

export { damageSpellSemantics };
