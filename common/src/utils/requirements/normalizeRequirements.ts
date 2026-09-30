/** Validation boundary: normalize + schema-check untrusted requirement input once. */
import { type as arktype } from "arktype";
import { attributeTypeEnum, mathComparisonEnum } from "../../enums.js";
import {
  commonRequirementTypeEnum,
  NonTopRequirementsSchema,
  otherRequirementTypeEnum,
  type NonTopRequirementsType,
} from "../../schemas/shared/requiredSchemas.js";

// Returns true when a requirement/forbidden AST carries no actual rules.
// Empty AllOf/OneOf arrays and inner leaves without parentDetails or
// otherDetails are ignored, preventing an empty forbidden block from
// marking an item incompatible.
function isEmptyRequirementNode(
  node: NonTopRequirementsType | undefined
): boolean {
  if (node === undefined) return true;
  if (
    node.type === commonRequirementTypeEnum.AllOf &&
    node.allOf.length === 0
  ) {
    return true;
  }
  if (
    node.type === commonRequirementTypeEnum.OneOf &&
    node.oneOf.length === 0
  ) {
    return true;
  }
  if (
    node.type === commonRequirementTypeEnum.Inner &&
    node.parentDetails === undefined &&
    node.otherDetails === undefined
  ) {
    return true;
  }
  return false;
}

const attributeCanonicalByLower = new Map<string, attributeTypeEnum>(
  Object.values(attributeTypeEnum).map((canonical) => [
    canonical.toLowerCase(),
    canonical,
  ])
);

// Pre-validates untrusted input without mutating the caller: maps the legacy "=" comparison alias to "==" and canonicalizes attribute names
// case-insensitively ("body" -> "Body") so hand-built fixtures validate against the schema. Everything else passes through untouched.
function normalizeUntrustedInput(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((entry) => normalizeUntrustedInput(entry));
  }
  if (typeof input === "object" && input !== null) {
    const record = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, rawValue] of Object.entries(record)) {
      if (key === "comparison" && rawValue === "=") {
        out[key] = mathComparisonEnum.Equals;
        continue;
      }
      out[key] = normalizeUntrustedInput(rawValue);
    }
    // Canonicalize attribute requirement names: { type: "attribute",
    // value: { name: "body", … } } -> { …, name: "Body" }.
    if (
      record["type"] === otherRequirementTypeEnum.Attribute &&
      typeof out["value"] === "object" &&
      out["value"] !== null &&
      !Array.isArray(out["value"])
    ) {
      const valueRecord = out["value"] as Record<string, unknown>;
      const name = valueRecord["name"];
      if (typeof name === "string") {
        const canonical = attributeCanonicalByLower.get(name.toLowerCase());
        if (canonical !== undefined) {
          valueRecord["name"] = canonical;
        }
      }
    }
    return out;
  }
  return input;
}

export type NormalizedRequirement =
  | { readonly kind: "empty" }
  | { readonly kind: "valid"; readonly node: NonTopRequirementsType }
  | { readonly kind: "invalid" };

// Single validation boundary: untrusted requirement/forbidden input is normalized then checked once against NonTopRequirementsSchema.
// Valid nodes flow into the fully-typed evaluators below; invalid nodes fail closed at the call site instead of per-leaf string probing.
export function toRequirementNode(
  input?: NonTopRequirementsType | unknown
): NormalizedRequirement {
  if (input === undefined || input === null) {
    return { kind: "empty" };
  }
  const normalized = normalizeUntrustedInput(input);
  const parsed = NonTopRequirementsSchema(normalized);
  if (parsed instanceof arktype.errors) {
    return { kind: "invalid" };
  }
  const node: NonTopRequirementsType = parsed;
  if (isEmptyRequirementNode(node)) {
    return { kind: "empty" };
  }
  return { kind: "valid", node };
}
