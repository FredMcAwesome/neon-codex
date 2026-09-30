/** Pure comparison/aggregation helpers shared by all parent evaluators. */
import { equipmentTypeEnum, mathComparisonEnum } from "../../enums.js";
import type {
  RequirementEvaluationContextType,
  RequirementParentContextType,
} from "../../schemas/shared/requirementEvaluationSchemas.js";
import { weaponMountParentCategory } from "../../schemas/shared/requirementEvaluationSchemas.js";
import type { FixedAttributeType } from "../../schemas/shared/requiredSchemas.js";
import type {
  InternalEvalResult,
  MatrixAttributeValue,
} from "./evaluationTypes.js";

// Evaluates a mathematical comparison. Closed over mathComparisonEnum so the switch stays exhaustive
// Untrusted strings are normalized to the enum before evaluation (see normalizeComparisonAlias).
export function evaluateMathComparison(
  actual: number,
  comparison: mathComparisonEnum,
  expected: number
): boolean {
  switch (comparison) {
    case mathComparisonEnum.GreaterThan:
      return actual > expected;
    case mathComparisonEnum.GreaterThanOrEqual:
      return actual >= expected;
    case mathComparisonEnum.Equals:
      return actual === expected;
    case mathComparisonEnum.LessThanOrEqual:
      return actual <= expected;
    case mathComparisonEnum.LessThan:
      return actual < expected;
  }
}

// Checks if a string list contains a target string (case-insensitive).
// Used for user-facing names (qualities, spells, traditions) where casing
// varies between data sources.
export function listContains(
  list: string[] | undefined,
  target: string
): boolean {
  if (list === undefined || list.length === 0) return false;
  const lowerTarget = target.toLowerCase();
  return list.some((item) => item.toLowerCase() === lowerTarget);
}

// Shared helper for AllOf child-result aggregation. Flattens nested childReasons so multi-failure branches all surface instead of only the first reason per branch.
export function combineAllOf(
  results: readonly InternalEvalResult[]
): InternalEvalResult {
  let allPass = true;
  const reasons: string[] = [];
  for (const result of results) {
    if (result.matches === false) {
      allPass = false;
      const childReasons = result.childReasons;
      if (childReasons !== undefined && childReasons.length > 0) {
        for (const childReason of childReasons) {
          reasons.push(childReason);
        }
      } else if (result.reason !== undefined) {
        reasons.push(result.reason);
      }
    }
  }
  const [firstReason] = reasons;
  return { matches: allPass, reason: firstReason, childReasons: reasons };
}

// Shared helper for OneOf child-result aggregation.
export function combineOneOf(
  results: readonly InternalEvalResult[]
): InternalEvalResult {
  let anyPass = false;
  const reasons: string[] = [];
  for (const result of results) {
    if (result.matches) {
      anyPass = true;
    } else {
      const childReasons = result.childReasons;
      if (childReasons !== undefined && childReasons.length > 0) {
        for (const childReason of childReasons) {
          reasons.push(childReason);
        }
      } else if (result.reason !== undefined) {
        reasons.push(result.reason);
      }
    }
  }
  const [firstReason] = reasons;
  return {
    matches: anyPass,
    reason: anyPass ? undefined : firstReason,
    childReasons: reasons,
  };
}

// Matrix device attributes are `number | { option } | undefined`.
// Present means defined; numeric zero means absent for `nonZeroAttribute` checks.
export function hasMatrixAttribute(
  value: MatrixAttributeValue | undefined
): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "number") return value !== 0;
  return true;
}

// Evaluates a FixedAttribute requirement. The discriminated union
// `{ noAttribute: true } | { nonZeroAttribute: true }` narrows via `in`,
// so no runtime shape probing is needed.
export function evaluateFixedAttribute(
  actual: MatrixAttributeValue | undefined,
  value: FixedAttributeType,
  label: string
): InternalEvalResult {
  const present = hasMatrixAttribute(actual);
  if ("noAttribute" in value) {
    const matches = present === false;
    return {
      matches,
      reason: matches
        ? undefined
        : `Requires parent item with no ${label} attribute`,
    };
  }
  const matches = present;
  return {
    matches,
    reason: matches
      ? undefined
      : `Requires parent item with ${label} attribute`,
  };
}

// Nearest ancestor of the requested domain: the direct parent wins; the grandparent is consulted when the direct parent is absent or of another domain
// (a weapon mount transparently exposes its host vehicle, an accessory its host weapon). Falls back to the direct parent so failure reasons stay specific
// to what is actually being configured. Name, standalone and character-level checks never use this helper.
export function nearestAncestorInDomain(
  context: RequirementEvaluationContextType,
  domain: equipmentTypeEnum | typeof weaponMountParentCategory
): RequirementParentContextType | undefined {
  const { parent, grandparent } = context;
  if (parent !== undefined && parent.category === domain) {
    return parent;
  }
  if (grandparent !== undefined && grandparent.category === domain) {
    return grandparent;
  }
  return parent;
}
