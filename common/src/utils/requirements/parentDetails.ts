/** Dispatches parent requirements to the domain evaluator by wrapper key. */
import type { ParentRequirementsType } from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import type { InternalEvalResult } from "./evaluationTypes.js";
import { evaluateParentGearWrapper } from "./parentGear.js";
import { evaluateParentGenericWrapper } from "./parentGeneric.js";
import { evaluateParentVehicleWrapper } from "./parentVehicle.js";
import { evaluateParentWeaponWrapper } from "./parentWeapon.js";
import { evaluateParentWeaponMountWrapper } from "./parentWeaponMount.js";

// Evaluates parent requirements. The union discriminates on which wrapper
// key is present (`weapon` | `vehicle` | `gear` | `weaponMount` |
// `generic`), so no stringly-typed dispatch is needed.
export function evaluateParentDetails(
  parentDetails: ParentRequirementsType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  if ("weapon" in parentDetails) {
    return evaluateParentWeaponWrapper(parentDetails, context);
  }
  if ("vehicle" in parentDetails) {
    return evaluateParentVehicleWrapper(parentDetails, context);
  }
  if ("gear" in parentDetails) {
    return evaluateParentGearWrapper(parentDetails, context);
  }
  if ("weaponMount" in parentDetails) {
    return evaluateParentWeaponMountWrapper(parentDetails, context);
  }
  return evaluateParentGenericWrapper(parentDetails, context);
}
