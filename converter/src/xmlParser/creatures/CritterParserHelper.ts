import assert from "assert";
import Critters from "../../grammar/critters.ohm-bundle.js";
import {
  critterAttributePowerEnum,
  critterCategoryEnum,
  mathOperatorEnum,
} from "@neon-codex/common";
import type {
  CritterRatingNonArrayType,
  IncludedComplexFormListType,
  IncludedCritterPowerListType,
} from "@neon-codex/common";
import type { XmlPowerListType } from "../common/ParserCommonDefines.js";
import type {
  CritterIncludedBiowareListType,
  CritterIncludedComplexFormType,
} from "./CritterParserSchemas.js";
import type { BonusGenericListType } from "@neon-codex/common";
const Rating = Critters;

const ratingSemantics = Rating.createSemantics();
ratingSemantics.addOperation("eval", {
  Variable(_) {
    return [{ option: "Variable" }];
  },
  MulDiv_multiply(str, _, range) {
    return [
      {
        subnumbers: str
          .eval()
          .concat([{ operator: mathOperatorEnum.Multiply }], range.eval()),
      },
    ];
  },
  MulDiv_divide(str, _, range) {
    return [
      {
        subnumbers: str
          .eval()
          .concat([{ operator: mathOperatorEnum.Divide }], range.eval()),
      },
    ];
  },
  AddSub_add(str, _, range) {
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Add }], range.eval());
  },
  AddSub_subtract(str, _, range) {
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Subtract }], range.eval());
  },
  // TODO: is this array check needed anymore with subnumbers implemented?
  SubCalculation_parenthesis(_a, str, _b) {
    let inner = str.eval();
    if (!Array.isArray(inner)) inner = [inner];
    return inner;
  },
  SubCalculation_variable(str, _, dice) {
    return [
      {
        subnumbers: [
          str.eval(),
          { operator: mathOperatorEnum.Multiply },
          dice.eval(),
        ],
      },
    ];
  },
  RatingValue(str) {
    return [str.eval()];
  },
  Force(_) {
    // This is generic and then changed later
    return { option: "Power" };
  },
  Number_negative(_, range) {
    return -range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal) {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range) {
    return parseInt(range.sourceString);
  },
});

type ratingSemanticsSubOutputType =
  | { option: "Power" }
  | { option: "Variable" }
  | { operator: mathOperatorEnum }
  | number;

type ratingSemanticsNonArrayOutputType =
  | ratingSemanticsSubOutputType
  | { subnumbers: ratingSemanticsOutputType };

type ratingSemanticsOutputType = Array<ratingSemanticsNonArrayOutputType>;

export function convertCritterRating(
  rating: string | number,
  category: critterCategoryEnum
) {
  const match = Rating.match(rating.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const ratingConverted: ratingSemanticsOutputType =
    ratingSemantics(match).eval();
  return ratingConverted.map((convertedRating) => {
    return convertRating(convertedRating, category);
  });
}

function convertRating(
  rating: ratingSemanticsNonArrayOutputType,
  category: critterCategoryEnum
): CritterRatingNonArrayType {
  if (typeof rating === "object") {
    if ("option" in rating) {
      if (rating.option === "Variable") {
        return { option: critterAttributePowerEnum.Variable as const };
      }
      return convertCritterPowerSource(category);
    } else if ("subnumbers" in rating) {
      return {
        subnumbers: rating.subnumbers.map((subrating) => {
          return convertRating(subrating, category);
        }),
      };
    }
  }
  return rating;
}

function convertCritterPowerSource(category: critterCategoryEnum) {
  switch (category) {
    case critterCategoryEnum.Spirits:
    case critterCategoryEnum.InsectSpirits:
    case critterCategoryEnum.ShadowSpirits:
    case critterCategoryEnum.ToxicSpirits:
    case critterCategoryEnum.NecroSpirits:
    case critterCategoryEnum.Shedim:
    case critterCategoryEnum.ExtraplanarTravelers:
    case critterCategoryEnum.Ritual:
      return { option: critterAttributePowerEnum.Force as const };
    case critterCategoryEnum.Sprites:
      return { option: critterAttributePowerEnum.Level as const };
    case critterCategoryEnum.AIs:
    case critterCategoryEnum.Dracoforms:
    case critterCategoryEnum.EntropicSprites:
    case critterCategoryEnum.Fey:
    case critterCategoryEnum.Ghost_Haunt:
    case critterCategoryEnum.Harbingers:
    case critterCategoryEnum.Imps:
    case critterCategoryEnum.Infected:
    case critterCategoryEnum.MundaneCritters:
    case critterCategoryEnum.MutantCritters:
    case critterCategoryEnum.ParanormalCritters:
    case critterCategoryEnum.PrimordialSpirits:
    case critterCategoryEnum.Protosapients:
    case critterCategoryEnum.Technocritters:
    case critterCategoryEnum.ToxicCritters:
    case critterCategoryEnum.Warforms:
      assert(false, `Unexpected Power with category: ${category}`);
  }
}

export const convertIncludedCritterPowers = function (
  powers: XmlPowerListType
): IncludedCritterPowerListType {
  return powers.map((power) => {
    if (typeof power !== "object") {
      assert(power !== "");
      return {
        name: power,
      };
    }
    let rating;
    if (power._rating !== undefined) {
      rating = parseInt(power._rating);
      if (isNaN(rating)) {
        assert(power._rating === "F", `Rating ${power._rating} is unexpected`);
        rating = { power: true as const };
      }
    }
    return {
      name: power.xmltext,
      ...(power._select !== undefined && { selectText: power._select }),
      ...(rating !== undefined && { rating: rating }),
    };
  });
};

export const convertIncludedBiowareList = function (
  biowareList: CritterIncludedBiowareListType
): BonusGenericListType {
  return biowareList.map((bioware) => {
    if (typeof bioware !== "object") {
      assert(bioware !== "");
      return {
        name: bioware,
      };
    }
    let rating;
    if (bioware._rating !== undefined) {
      rating = parseInt(bioware._rating);
      assert(!isNaN(rating));
    }
    return {
      name: bioware.xmltext,
      ...(rating !== undefined && { rating: rating }),
    };
  });
};

export const convertIncludedComplexForms = function (
  complexFormList: CritterIncludedComplexFormType
): IncludedComplexFormListType {
  return complexFormList.map((complexForm) => {
    if (typeof complexForm !== "object") {
      assert(complexForm !== "");
      return {
        name: complexForm,
      };
    }
    return {
      name: complexForm.xmltext,
      select: complexForm._select,
    };
  });
};

export { ratingSemantics as attributeSemantics };
