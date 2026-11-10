/** Weapon-domain parent requirements (ammo, mounts, conceal, skill, ...). */
import {
  equipmentTypeEnum,
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  weaponRequirementTypeEnum,
} from "../../enums.js";
import type {
  ParentWeaponRequirementSubType,
  ParentWeaponRequirementType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import {
  combineAllOf,
  combineOneOf,
  evaluateMathComparison,
  listContains,
  nearestAncestorInDomain,
} from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";
import { evaluateParentGeneric } from "./parentGeneric.js";

// Evaluates a weapon parent leaf. Generic leaves (name/noParent/equipment)
// are part of the weapon sub-union and delegate back to the generic
// evaluator; every other case narrows `value` to its schema shape.
function evaluateParentWeaponSub(
  sub: ParentWeaponRequirementSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  if (
    sub.type === genericRequirementTypeEnum.NoParent ||
    sub.type === genericRequirementTypeEnum.Name ||
    sub.type === genericRequirementTypeEnum.Equipment
  ) {
    return evaluateParentGeneric(sub, context);
  }
  // Remaining leaves are weapon-specific: a present ancestor of another
  // domain fails here instead of against individual weapon fields.
  const parent = nearestAncestorInDomain(context, equipmentTypeEnum.Weapon);
  if (parent !== undefined && parent.category !== equipmentTypeEnum.Weapon) {
    return { matches: false, reason: "Requires weapon parent" };
  }
  switch (sub.type) {
    case weaponRequirementTypeEnum.AmmoType: {
      const matches = parent?.ammoTypes?.includes(sub.value) ?? false;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon with ammunition type: ${sub.value}`,
      };
    }
    case weaponRequirementTypeEnum.AmmoCategory: {
      const classification = parent?.ammoWeaponClassification;
      const parentAmmoCategory = parent?.ammoCategory;
      const subtypeMatches =
        (classification !== undefined &&
          classification.subtype.toLowerCase() ===
            sub.value.subtype.toLowerCase()) ||
        (parentAmmoCategory !== undefined &&
          parentAmmoCategory.toLowerCase() === sub.value.subtype.toLowerCase());
      const categoryMatches =
        classification !== undefined &&
        classification.category.toLowerCase() ===
          sub.value.category.toLowerCase();
      const matches = subtypeMatches && categoryMatches;
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon with ammo category: ${sub.value.subtype}`,
      };
    }
    case weaponRequirementTypeEnum.Subtype: {
      const parentSubtype =
        parent !== undefined && "subtype" in parent
          ? parent.subtype
          : undefined;
      const matches =
        parentSubtype !== undefined &&
        parentSubtype.toLowerCase() === sub.value.subtype.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon subtype: ${sub.value.subtype}`,
      };
    }
    case weaponRequirementTypeEnum.Category: {
      const parentCategory =
        parent !== undefined && "weaponCategory" in parent
          ? parent.weaponCategory
          : undefined;
      const matches =
        parentCategory !== undefined &&
        parentCategory.toLowerCase() === sub.value.toLowerCase();
      return {
        matches,
        reason: matches ? undefined : `Requires weapon category: ${sub.value}`,
      };
    }
    case weaponRequirementTypeEnum.AccessoryMount: {
      const matches = parent?.mountsAvailable?.includes(sub.value) ?? false;
      return {
        matches,
        reason: matches ? undefined : `Requires available ${sub.value} mount`,
      };
    }
    case weaponRequirementTypeEnum.Conceal: {
      const conceal = parent?.concealability ?? 0;
      const matches = evaluateMathComparison(
        conceal,
        sub.value.comparison,
        sub.value.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon concealment ${sub.value.comparison} ${sub.value.value}`,
      };
    }
    case weaponRequirementTypeEnum.Skill: {
      const skillValue = sub.value;
      if ("noOverride" in skillValue) {
        return { matches: true };
      }
      const targetSkill = skillValue.skill;
      if (targetSkill === undefined) {
        return {
          matches: false,
          reason: "Unsupported weapon skill requirement",
        };
      }
      const matches = listContains(parent?.skills, targetSkill);
      return {
        matches,
        reason: matches ? undefined : `Requires weapon skill: ${targetSkill}`,
      };
    }
    case weaponRequirementTypeEnum.Damage: {
      const damageList = parent?.damage ?? [];
      const matches = damageList.some(
        (entry) =>
          entry.type === sub.value.type &&
          (sub.value.annotation === undefined ||
            entry.annotation === sub.value.annotation)
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon damage type: ${sub.value.type}${sub.value.annotation === undefined ? "" : ` (${sub.value.annotation})`}`,
      };
    }
    case weaponRequirementTypeEnum.Mode: {
      const modes = parent?.modes ?? [];
      const matches = modes.some(
        (mode) => mode.toLowerCase() === sub.value.toLowerCase()
      );
      return {
        matches,
        reason: matches ? undefined : `Requires weapon fire mode: ${sub.value}`,
      };
    }
  }
}

// Evaluates a weapon parent wrapper (`{ type: inner, weapon: … }`).
// The inner node is itself a discriminated union of leaf | allOf | oneOf.
export function evaluateParentWeaponWrapper(
  wrapper: ParentWeaponRequirementType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const inner = wrapper.weapon;
  if (inner.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      inner.allOf.map((sub) => evaluateParentWeaponWrapper(sub, context))
    );
  }
  if (inner.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      inner.oneOf.map((sub) => evaluateParentWeaponWrapper(sub, context))
    );
  }
  return evaluateParentWeaponSub(inner, context);
}
