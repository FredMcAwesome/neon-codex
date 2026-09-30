/** Generic parent requirements (noParent / name / equipment category). */
import { equipmentTypeEnum } from "../../enums.js";
import {
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  type EquipmentCategoryType,
  type ParentGenericRequirementSubType,
  type ParentGenericRequirementType,
} from "../../schemas/shared/requiredSchemas.js";
import type { RequirementEvaluationContextType } from "../../schemas/shared/requirementEvaluationSchemas.js";
import {
  combineAllOf,
  combineOneOf,
  nearestAncestorInDomain,
} from "./comparisonUtils.js";
import type { InternalEvalResult } from "./evaluationTypes.js";

// Evaluates a generic parent requirement. `generic` is the discriminated
// union from the schema, so `generic.value` narrows automatically per case.
export function evaluateParentGeneric(
  generic: ParentGenericRequirementSubType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  switch (generic.type) {
    case genericRequirementTypeEnum.NoParent: {
      const isRoot = context.parent === undefined || context.isRoot === true;
      const matches = generic.value === isRoot;
      return {
        matches,
        reason: matches
          ? undefined
          : generic.value
            ? "Must be added standalone (no parent item)"
            : "Must be added to a parent item",
      };
    }
    case genericRequirementTypeEnum.Name: {
      const { name: requiredName, partialName } = generic.value;
      const parentName = context.parent?.name;
      if (parentName === undefined) {
        return {
          matches: false,
          reason: `Parent item must be named "${requiredName}"`,
        };
      }
      const matches =
        partialName === true
          ? parentName.toLowerCase().includes(requiredName.toLowerCase())
          : parentName.toLowerCase() === requiredName.toLowerCase();
      return {
        matches,
        reason: matches ? undefined : `Parent item must be "${requiredName}"`,
      };
    }
    case genericRequirementTypeEnum.Equipment: {
      return evaluateParentEquipmentCategory(
        generic.value,
        context,
        "Parent item"
      );
    }
  }
}

// Shared equipment-category matcher for generic Equipment requirements.
// The requirement carries a general category plus an optional specific
// subtype. Two-level domains expose both via dedicated parent fields
// (weaponCategory, vehicleCategory, augmentationCategory); single-level
// domains (gear, armour) reuse subtype as the category.
function evaluateParentEquipmentCategory(
  value: EquipmentCategoryType,
  context: RequirementEvaluationContextType,
  label: string
): InternalEvalResult {
  const parent = nearestAncestorInDomain(context, value.equipmentType);
  if (parent === undefined) {
    return {
      matches: false,
      reason: `${label} must be ${value.equipmentType}`,
    };
  }
  const parentCategory = parent.category;
  if (parentCategory !== value.equipmentType) {
    const subtype = "subtype" in value ? String(value.subtype) : undefined;
    return {
      matches: false,
      reason: `${label} must be ${subtype ?? String(value.category)}`,
    };
  }
  const requiredCategory = String(value.category);
  let parentGeneral: string | undefined;
  if (parent.category === equipmentTypeEnum.Weapon) {
    parentGeneral =
      "weaponCategory" in parent ? parent.weaponCategory : undefined;
  } else if (parent.category === equipmentTypeEnum.Vehicle) {
    parentGeneral =
      "vehicleCategory" in parent ? parent.vehicleCategory : undefined;
  } else if (parent.category === equipmentTypeEnum.Augmentation) {
    parentGeneral =
      "augmentationCategory" in parent
        ? parent.augmentationCategory
        : undefined;
  } else if ("subtype" in parent) {
    parentGeneral = parent.subtype;
  }
  let matches =
    parentGeneral !== undefined &&
    parentGeneral.toLowerCase() === requiredCategory.toLowerCase();
  if (matches && "subtype" in value) {
    const parentSpecific = "subtype" in parent ? parent.subtype : undefined;
    matches =
      parentSpecific !== undefined &&
      parentSpecific.toLowerCase() === String(value.subtype).toLowerCase();
  }
  if (matches) {
    return { matches: true };
  }
  const subtype = "subtype" in value ? String(value.subtype) : undefined;
  return {
    matches: false,
    reason: `${label} must be ${subtype ?? requiredCategory}`,
  };
}

export function evaluateParentGenericWrapper(
  wrapper: ParentGenericRequirementType,
  context: RequirementEvaluationContextType
): InternalEvalResult {
  const inner = wrapper.generic;
  if (inner.type === commonRequirementTypeEnum.AllOf) {
    return combineAllOf(
      inner.allOf.map((sub) => evaluateParentGenericWrapper(sub, context))
    );
  }
  if (inner.type === commonRequirementTypeEnum.OneOf) {
    return combineOneOf(
      inner.oneOf.map((sub) => evaluateParentGenericWrapper(sub, context))
    );
  }
  return evaluateParentGeneric(inner, context);
}
