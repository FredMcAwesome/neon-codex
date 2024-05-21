import assert from "assert";
import Critters from "../../grammar/critters.ohm-bundle.js";
import {
  critterAttributePowerEnum,
  critterTypeEnum,
  mathOperatorEnum,
} from "@neon-codex/common/build/enums.js";
import type { CritterRatingNonArrayType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
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
  category: critterTypeEnum
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
  category: critterTypeEnum
): CritterRatingNonArrayType {
  if (typeof rating === "object") {
    if ("option" in rating) {
      if (rating.option === "Variable") {
        return { option: critterAttributePowerEnum.Variable as const };
      }
      return convertCritterPower(category);
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

export function convertCritterPower(category: critterTypeEnum) {
  switch (category) {
    case critterTypeEnum.Spirits:
    case critterTypeEnum.InsectSpirits:
    case critterTypeEnum.ShadowSpirits:
    case critterTypeEnum.ToxicSpirits:
    case critterTypeEnum.NecroSpirits:
    case critterTypeEnum.Shedim:
    case critterTypeEnum.ExtraplanarTravelers:
    case critterTypeEnum.Ritual:
      return { option: critterAttributePowerEnum.Force as const };
    case critterTypeEnum.Sprites:
      return { option: critterAttributePowerEnum.Level as const };
    case critterTypeEnum.AIs:
    case critterTypeEnum.Dracoforms:
    case critterTypeEnum.EntropicSprites:
    case critterTypeEnum.Fey:
    case critterTypeEnum.Ghost_Haunt:
    case critterTypeEnum.Harbingers:
    case critterTypeEnum.Imps:
    case critterTypeEnum.Infected:
    case critterTypeEnum.MundaneCritters:
    case critterTypeEnum.MutantCritters:
    case critterTypeEnum.ParanormalCritters:
    case critterTypeEnum.PrimordialSpirits:
    case critterTypeEnum.Protosapients:
    case critterTypeEnum.Technocritters:
    case critterTypeEnum.ToxicCritters:
    case critterTypeEnum.Warforms:
      assert(false, `Unexpected Power with category: ${category}`);
  }
}

export { ratingSemantics as attributeSemantics };
