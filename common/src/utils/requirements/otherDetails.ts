/** Character-level (otherDetails) requirements: qualities, skills, essence, magic, ... */
import {
  otherRequirementTypeEnum,
  type RequirementOtherSubType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import { listContains } from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";

// Evaluates otherDetails (character qualities, metatype, skills, installed
// items). Each `case` narrows `otherDetails.value` to its schema shape via
// the discriminant, replacing the old getStringProperty/getNumberProperty
// helpers.
export function evaluateOtherDetails(
  otherDetails: RequirementOtherSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const character = context.character;
  const parent = context.parent;

  switch (otherDetails.type) {
    case otherRequirementTypeEnum.Quality: {
      const { quality: qualityName } = otherDetails.value;
      const hasPositive = listContains(
        character?.positiveQualities,
        qualityName
      );
      const hasNegative = listContains(
        character?.negativeQualities,
        qualityName
      );
      const matches = hasPositive || hasNegative;
      return {
        matches,
        reason: matches ? undefined : `Requires quality: ${qualityName}`,
      };
    }
    case otherRequirementTypeEnum.MartialArt: {
      const matches = listContains(
        character?.installedMartialArts,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires martial art: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.MartialTechnique: {
      const matches = listContains(
        character?.installedMartialTechniques,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires martial art technique: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Metatype: {
      const matches =
        character?.metatype?.toLowerCase() === otherDetails.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires metatype: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.MetatypeCategory: {
      const matches =
        character?.metatypeCategory?.toLowerCase() ===
        otherDetails.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires metatype category: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Accessory: {
      // Accessory can be installed on current parent weapon or in general inventory
      const weaponParent =
        parent !== undefined && "installedAccessories" in parent
          ? parent
          : undefined;
      const inParent = listContains(
        weaponParent?.installedAccessories,
        otherDetails.value
      );
      const inGear = listContains(character?.installedGear, otherDetails.value);
      const matches = inParent || inGear;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires accessory: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Cyberware: {
      const { name: targetName, partialName } = otherDetails.value;
      const installed = character?.installedCyberware ?? [];
      const matches =
        partialName === true
          ? installed.some((item) =>
              item.toLowerCase().includes(targetName.toLowerCase())
            )
          : listContains(installed, targetName);
      return {
        matches,
        reason: matches ? undefined : `Requires cyberware: ${targetName}`,
      };
    }
    case otherRequirementTypeEnum.Bioware: {
      const matches = listContains(
        character?.installedBioware,
        otherDetails.value
      );
      return {
        matches,
        reason: matches ? undefined : `Requires bioware: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.ArmourMod: {
      const { name: modName, sameParent } = otherDetails.value;
      const modParent =
        parent !== undefined && "installedMods" in parent ? parent : undefined;
      const inParent = listContains(modParent?.installedMods, modName);
      if (sameParent === true) {
        return {
          matches: inParent,
          reason: inParent
            ? undefined
            : `Requires armour modification on same item: ${modName}`,
        };
      }
      const inArmour = listContains(character?.installedArmourMods, modName);
      const matches = inParent || inArmour;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires armour modification: ${modName}`,
      };
    }
    case otherRequirementTypeEnum.Gear: {
      const { name: gearName, minimumRating } = otherDetails.value;
      const nameMatches = listContains(character?.installedGear, gearName);
      if (minimumRating === undefined) {
        return {
          matches: nameMatches,
          reason: nameMatches ? undefined : `Requires gear: ${gearName}`,
        };
      }
      // When ratings are tracked, enforce them; otherwise fall back to name match
      const trackedRating = character?.installedGearRatings?.[gearName];
      if (trackedRating !== undefined) {
        const matches = trackedRating >= minimumRating;
        return {
          matches,
          reason: matches
            ? undefined
            : `Requires gear: ${gearName} (rating ${minimumRating}+)`,
        };
      }
      return {
        matches: nameMatches,
        reason: nameMatches ? undefined : `Requires gear: ${gearName}`,
      };
    }
    case otherRequirementTypeEnum.Skill: {
      const { name: skillName, value: minimumRating } = otherDetails.value;
      // Skill keys vary in casing between data sources, so compare
      // case-insensitively like attributes.
      const wanted = skillName.toLowerCase();
      let rating = 0;
      const skills = character?.skills;
      if (skills !== undefined) {
        for (const [key, value] of Object.entries(skills)) {
          if (key.toLowerCase() === wanted) {
            rating = value;
            break;
          }
        }
      }
      const matches = rating >= minimumRating;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires skill: ${skillName} (rating ${minimumRating}+)`,
      };
    }
    case otherRequirementTypeEnum.Attribute: {
      const { name: attributeName, minimumRating } = otherDetails.value;
      // State keys use mixed casing, so compare case-insensitively.
      const wanted = attributeName.toLowerCase();
      let actual = 0;
      const attributes = character?.attributes;
      if (attributes !== undefined) {
        for (const [key, rating] of Object.entries(attributes)) {
          if (key.toLowerCase() === wanted) {
            actual = rating;
            break;
          }
        }
      }
      const matches = actual >= minimumRating;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires attribute: ${attributeName} (rating ${minimumRating}+)`,
      };
    }
    case otherRequirementTypeEnum.Program: {
      const matches = listContains(character?.programs, otherDetails.value);
      return {
        matches,
        reason: matches ? undefined : `Requires program: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Lifestyle: {
      const matches = listContains(character?.lifestyles, otherDetails.value);
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires lifestyle: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.LifestyleQuality: {
      const matches = listContains(
        character?.lifestyleQualities,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires lifestyle quality: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.GameplayOption: {
      const matches =
        character?.gameplayOption?.toLowerCase() ===
        otherDetails.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires gameplay option: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.SpecialModificationLimit: {
      // Weapons count only special-modification accessories; other hosts
      // fall back to their installed mod lists. The downstream ?? absorbs
      // an absent count, so no undefined check is needed here.
      const specialCount =
        parent !== undefined && "specialModificationCount" in parent
          ? parent.specialModificationCount
          : undefined;
      const modParent =
        parent !== undefined && "installedMods" in parent ? parent : undefined;
      const currentMods = specialCount ?? modParent?.installedMods?.length ?? 0;
      const matches = currentMods < otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : `Exceeds modification limit of ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.EssenceMinimum: {
      const essence = character?.essence ?? 6;
      const matches = essence >= otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires minimum essence of ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.EssenceLoss: {
      const { loss } = otherDetails.value;
      // Essence loss derives from current essence: all characters begin
      // at 6 essence, so loss equals 6 minus remaining essence.
      const actualLoss = 6 - (character?.essence ?? 6);
      const matches = actualLoss >= loss;
      return {
        matches,
        reason: matches ? undefined : `Requires essence loss of ${loss}`,
      };
    }
    case otherRequirementTypeEnum.MagicEnabled: {
      const matches = (character?.magicEnabled ?? false) === otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : otherDetails.value
            ? "Requires Awakened character"
            : "Requires mundane (non-Awakened) character",
      };
    }
    case otherRequirementTypeEnum.ResonanceEnabled: {
      const matches =
        (character?.resonanceEnabled ?? false) === otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : otherDetails.value
            ? "Requires Emerged/Resonance character"
            : "Requires non-Emerged character",
      };
    }
    case otherRequirementTypeEnum.DepthEnabled: {
      const matches = (character?.depthEnabled ?? false) === otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : otherDetails.value
            ? "Requires Depth character"
            : "Requires non-Depth character",
      };
    }
    case otherRequirementTypeEnum.MinimumInitiateGrade: {
      const actual = character?.initiateGrade ?? 0;
      const matches = actual >= otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires initiate grade ${otherDetails.value}+`,
      };
    }
    case otherRequirementTypeEnum.MinimumSubmersionGrade: {
      const actual = character?.submersionGrade ?? 0;
      const matches = actual >= otherDetails.value;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires submersion grade ${otherDetails.value}+`,
      };
    }
    case otherRequirementTypeEnum.Tradition: {
      const matches =
        character?.tradition?.toLowerCase() ===
        otherDetails.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires tradition: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Metamagic: {
      const matches = listContains(character?.metamagics, otherDetails.value);
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires metamagic: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.MetamagicArt: {
      const matches = listContains(
        character?.metamagicArts,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires metamagic art: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.Spell: {
      const matches = listContains(character?.spells, otherDetails.value);
      return {
        matches,
        reason: matches ? undefined : `Requires spell: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.SpellCategory: {
      const { category, spellsInCategory: required } = otherDetails.value;
      const actual = character?.spellsByCategory?.[category] ?? 0;
      const matches = actual >= required;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires ${required} spell(s) in category: ${category}`,
      };
    }
    case otherRequirementTypeEnum.SpellDescriptor: {
      const { name: descriptorName, count: required } = otherDetails.value;
      const actual = character?.spellsByDescriptor?.[descriptorName] ?? 0;
      const matches = actual >= required;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires ${required} spell(s) with descriptor: ${descriptorName}`,
      };
    }
    case otherRequirementTypeEnum.AdeptPower: {
      const matches = listContains(character?.adeptPowers, otherDetails.value);
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires adept power: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.CritterPower: {
      const matches = listContains(
        character?.critterPowers,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires critter power: ${otherDetails.value}`,
      };
    }
    case otherRequirementTypeEnum.TraditionSpiritForm: {
      const matches = listContains(
        character?.traditionSpiritForms,
        otherDetails.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires tradition spirit: ${otherDetails.value}`,
      };
    }
  }
}
