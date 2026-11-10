/** Vehicle-domain parent requirements (body, seats). */
import {
  equipmentTypeEnum,
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  vehicleRequirementTypeEnum,
} from "../../enums.js";
import type {
  ParentVehicleRequirementSubType,
  ParentVehicleRequirementType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import {
  combineAllOf,
  combineOneOf,
  evaluateMathComparison,
  nearestAncestorInDomain,
} from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";
import { evaluateParentGeneric } from "./parentGeneric.js";

function evaluateParentVehicleSub(
  sub: ParentVehicleRequirementSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  if (
    sub.type === genericRequirementTypeEnum.NoParent ||
    sub.type === genericRequirementTypeEnum.Name ||
    sub.type === genericRequirementTypeEnum.Equipment
  ) {
    return evaluateParentGeneric(sub, context);
  }
  // Remaining leaves are vehicle-specific: a present ancestor of another
  // domain fails here instead of against individual vehicle fields.
  const parent = nearestAncestorInDomain(context, equipmentTypeEnum.Vehicle);
  if (parent !== undefined && parent.category !== equipmentTypeEnum.Vehicle) {
    return { matches: false, reason: "Requires vehicle parent" };
  }
  switch (sub.type) {
    case vehicleRequirementTypeEnum.Body: {
      const bodyValue = parent?.body ?? 0;
      const matches = evaluateMathComparison(
        bodyValue,
        sub.value.comparison,
        sub.value.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires vehicle body ${sub.value.comparison} ${sub.value.value}`,
      };
    }
    case vehicleRequirementTypeEnum.Seats: {
      const seatValue = parent?.seats ?? 0;
      const matches = evaluateMathComparison(
        seatValue,
        sub.value.comparison,
        sub.value.value
      );
      return {
        matches,
        reason: matches
          ? undefined
          : `Requires vehicle seats ${sub.value.comparison} ${sub.value.value}`,
      };
    }
  }
}

export function evaluateParentVehicleWrapper(
  wrapper: ParentVehicleRequirementType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const inner = wrapper.vehicle;
  if (inner.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      inner.allOf.map((sub) => evaluateParentVehicleWrapper(sub, context))
    );
  }
  if (inner.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      inner.oneOf.map((sub) => evaluateParentVehicleWrapper(sub, context))
    );
  }
  return evaluateParentVehicleSub(inner, context);
}
