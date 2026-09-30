/** Gear-domain parent requirements (cyberdeck, attribute array, matrix attrs). */
import { equipmentTypeEnum } from "../../enums.js";
import {
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  gearRequirementTypeEnum,
  type ParentGearRequirementSubType,
  type ParentGearRequirementType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import {
  combineAllOf,
  combineOneOf,
  evaluateFixedAttribute,
  nearestAncestorInDomain,
} from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";
import { evaluateParentGeneric } from "./parentGeneric.js";

function evaluateParentGearSub(
  sub: ParentGearRequirementSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  if (
    sub.type === genericRequirementTypeEnum.NoParent ||
    sub.type === genericRequirementTypeEnum.Name ||
    sub.type === genericRequirementTypeEnum.Equipment
  ) {
    return evaluateParentGeneric(sub, context);
  }
  // Remaining leaves are gear-specific: a present ancestor of another
  // domain fails here instead of against individual matrix fields.
  const parent = nearestAncestorInDomain(context, equipmentTypeEnum.Gear);
  if (parent !== undefined && parent.category !== equipmentTypeEnum.Gear) {
    return { matches: false, reason: "Requires gear parent" };
  }
  switch (sub.type) {
    case gearRequirementTypeEnum.IsCyberdeck: {
      const isDeck = parent?.isCyberdeck ?? false;
      const matches = isDeck === sub.value;
      return {
        matches,
        reason: matches
          ? undefined
          : sub.value
            ? "Requires parent item to be a cyberdeck"
            : "Parent item must not be a cyberdeck",
      };
    }
    case gearRequirementTypeEnum.AttributeArray: {
      const hasAttr = parent?.hasAttributeArray ?? false;
      const matches = hasAttr === sub.exists;
      return {
        matches,
        reason: matches
          ? undefined
          : sub.exists
            ? "Requires parent item to have an attribute array"
            : "Requires parent item with no attribute array",
      };
    }
    case gearRequirementTypeEnum.Attack:
      return evaluateFixedAttribute(parent?.attack, sub.value, "attack");
    case gearRequirementTypeEnum.Sleaze:
      return evaluateFixedAttribute(parent?.sleaze, sub.value, "sleaze");
    case gearRequirementTypeEnum.DataProcessing:
      return evaluateFixedAttribute(
        parent?.dataProcessing,
        sub.value,
        "data processing"
      );
    case gearRequirementTypeEnum.Firewall:
      return evaluateFixedAttribute(parent?.firewall, sub.value, "firewall");
  }
}

export function evaluateParentGearWrapper(
  wrapper: ParentGearRequirementType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const inner = wrapper.gear;
  if (inner.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      inner.allOf.map((sub) => evaluateParentGearWrapper(sub, context))
    );
  }
  if (inner.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      inner.oneOf.map((sub) => evaluateParentGearWrapper(sub, context))
    );
  }
  return evaluateParentGearSub(inner, context);
}
