/** Weapon-mount-domain parent requirements (control, flexibility, visibility). */
import {
  commonRequirementTypeEnum,
  weaponMountRequirementTypeEnum,
  type ParentWeaponMountRequirementType,
  type ParentWeaponMountSubType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import { weaponMountParentCategory } from "../../schemas/shared/requirementEvaluationSchemas.js";
import {
  combineAllOf,
  combineOneOf,
  nearestAncestorInDomain,
} from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";

function evaluateParentWeaponMountSub(
  sub: ParentWeaponMountSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  // Mount leaves only apply to mount ancestors: a present ancestor of
  // another domain fails here instead of against individual mount fields.
  const parent = nearestAncestorInDomain(context, weaponMountParentCategory);
  if (parent !== undefined && parent.category !== weaponMountParentCategory) {
    return { matches: false, reason: "Requires weapon mount parent" };
  }
  switch (sub.type) {
    case weaponMountRequirementTypeEnum.Control: {
      const parentControl = parent?.control;
      const matches =
        parentControl !== undefined &&
        parentControl.toLowerCase() === sub.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon mount control: ${sub.value}`,
      };
    }
    case weaponMountRequirementTypeEnum.Flexibility: {
      const parentFlexibility = parent?.flexibility;
      const matches =
        parentFlexibility !== undefined &&
        parentFlexibility.toLowerCase() === sub.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon mount flexibility: ${sub.value}`,
      };
    }
    case weaponMountRequirementTypeEnum.Visibility: {
      const parentVisibility = parent?.visibility;
      const matches =
        parentVisibility !== undefined &&
        parentVisibility.toLowerCase() === sub.value.toLowerCase();
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires weapon mount visibility: ${sub.value}`,
      };
    }
  }
}

export function evaluateParentWeaponMountWrapper(
  wrapper: ParentWeaponMountRequirementType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const inner = wrapper.weaponMount;
  if (inner.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      inner.allOf.map((sub) => evaluateParentWeaponMountWrapper(sub, context))
    );
  }
  if (inner.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      inner.oneOf.map((sub) => evaluateParentWeaponMountWrapper(sub, context))
    );
  }
  return evaluateParentWeaponMountSub(inner, context);
}
