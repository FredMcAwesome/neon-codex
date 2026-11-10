/**
 * Requirement evaluation entry point (public API unchanged).
 *
 * Domain evaluators live in sibling modules; this file only orchestrates
 * the AST recursion (evaluateNode) and the requirements/forbidden
 * semantics (evaluateItemCompatibility).
 */
import { commonRequirementTypeEnum } from "../../enums.js";
import type { NonTopRequirementsType } from "../../schemas/shared/requiredSchemas.js";
import type {
  RequirementCompatibilityType,
  RequirementEvaluationContextType,
} from "../../schemas/shared/requirementEvaluationSchemas.js";
import { combineAllOf, combineOneOf } from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";
import { toRequirementNode } from "./normalizeRequirements.js";
import { evaluateOtherDetails } from "./otherDetails.js";
import { evaluateParentDetails } from "./parentDetails.js";

// Recursively evaluates a validated AST node (AllOf, OneOf, or Inner leaf).
// Stray leaves without parentDetails/otherDetails are empty (handled by
// isEmptyRequirementNode) and evaluate to true.
function evaluateNode(
  node: NonTopRequirementsType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  // AllOf: Every child must pass
  if (node.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      node.allOf.map((child) => evaluateNode(child, context))
    );
  }

  // OneOf: At least one child must pass
  if (node.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      node.oneOf.map((child) => evaluateNode(child, context))
    );
  }

  // Inner leaf: checks parentDetails and otherDetails
  let parentResult: InternalEvalResult = { matches: true };
  let otherResult: InternalEvalResult = { matches: true };

  if (node.parentDetails !== undefined) {
    parentResult = evaluateParentDetails(node.parentDetails, context);
  }
  if (node.otherDetails !== undefined) {
    otherResult = evaluateOtherDetails(node.otherDetails, context);
  }

  if (parentResult.matches && otherResult.matches) {
    return { matches: true };
  }
  const reasons: string[] = [];
  const parentChildReasons = parentResult.childReasons;
  if (parentChildReasons !== undefined && parentChildReasons.length > 0) {
    for (const childReason of parentChildReasons) {
      reasons.push(childReason);
    }
  } else if (parentResult.reason !== undefined) {
    reasons.push(parentResult.reason);
  }
  const otherChildReasons = otherResult.childReasons;
  if (otherChildReasons !== undefined && otherChildReasons.length > 0) {
    for (const childReason of otherChildReasons) {
      reasons.push(childReason);
    }
  } else if (otherResult.reason !== undefined) {
    reasons.push(otherResult.reason);
  }
  const [firstReason] = reasons;
  return { matches: false, reason: firstReason, childReasons: reasons };
}

/**
 * Evaluates requirements and forbidden rules for an item against the current
 * context.
 *
 * Inputs are schema-typed (`NonTopRequirementsType`) so `value` narrows by
 * discriminant in every evaluator below — no per-leaf string extraction.
 * Untrusted JSON still flows through safely: it is normalized and validated
 * once in `toRequirementNode`, with invalid blocks failing closed
 * (requirements block compatibility; invalid forbidden blocks are ignored
 * because a forbidden rule must be proven to match before it blocks).
 *
 * @param requirements The requirement AST (allOf, oneOf, inner)
 * @param forbidden The forbidden AST (allOf, oneOf, inner)
 * @param context The evaluation context (parent item attributes, character state)
 * @returns RequirementCompatibilityType { isCompatible: boolean, unmetReasons: string[] }
 */
export function evaluateItemCompatibility(
  requirements?: NonTopRequirementsType,
  forbidden?: NonTopRequirementsType,
  context: RequirementEvaluationContextType = {}
): RequirementCompatibilityType {
  const unmetReasons: string[] = [];

  // 1. Check forbidden rules: if forbidden evaluates to true (matches), the item is NOT compatible.
  // Empty forbidden blocks are ignored.
  const forbiddenNormalized = toRequirementNode(forbidden);
  if (forbiddenNormalized.kind === "valid") {
    const forbiddenResult = evaluateNode(forbiddenNormalized.node, context);
    if (forbiddenResult.matches) {
      const reasonText =
        forbiddenResult.reason === undefined
          ? "Incompatible with current equipment or character state"
          : `Incompatible: ${forbiddenResult.reason}`;
      unmetReasons.push(reasonText);
    }
  }

  // 2. Check requirements: must evaluate to true (matches).
  // Empty requirements blocks are ignored; invalid blocks fail closed.
  const requirementsNormalized = toRequirementNode(requirements);
  if (requirementsNormalized.kind === "invalid") {
    unmetReasons.push("Unsupported requirement");
  } else if (requirementsNormalized.kind === "valid") {
    const reqResult = evaluateNode(requirementsNormalized.node, context);
    if (reqResult.matches === false) {
      if (
        reqResult.childReasons !== undefined &&
        reqResult.childReasons.length > 0
      ) {
        unmetReasons.push(...reqResult.childReasons);
      } else if (reqResult.reason !== undefined) {
        unmetReasons.push(reqResult.reason);
      } else {
        unmetReasons.push("Requirements not met");
      }
    }
  }

  // Deduplicate reasons
  const uniqueReasons: string[] = Array.from(new Set(unmetReasons));

  return {
    isCompatible: uniqueReasons.length === 0,
    unmetReasons: uniqueReasons,
  };
}
