/** Shared internal result/attribute types for requirement evaluation. */
import type { RequirementGearParentContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";

export type MatrixAttributeValue = NonNullable<
  RequirementGearParentContextType["attack"]
>;

export interface InternalEvalResult {
  readonly matches: boolean;
  readonly reason?: string | undefined;
  readonly childReasons?: readonly string[] | undefined;
}
