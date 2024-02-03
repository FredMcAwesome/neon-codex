import { restrictionEnum } from "../enums.js";
import type { AvailabilityRatingType } from "../schemas/commonSchemas.js";

export function formatRating(
  unformattedRating: AvailabilityRatingType
): string {
  let ratingFormatted = "";
  for (const ratingValue of unformattedRating) {
    if (typeof ratingValue === "number") {
      ratingFormatted += ratingValue.toString();
    } else if ("option" in ratingValue) {
      ratingFormatted += ratingValue.option;
    } else if ("operator" in ratingValue) {
      ratingFormatted += ratingValue.operator;
    } else {
      ratingFormatted += formatRating(ratingValue.subnumbers);
    }
  }
  return ratingFormatted;
}

export function formatLegality(unformattedLegality: restrictionEnum) {
  switch (unformattedLegality) {
    case restrictionEnum.Legal:
      return "Legal";
    case restrictionEnum.Restricted:
      return "Restricted";
    case restrictionEnum.Forbidden:
      return "Forbidden";
  }
}
