/**
 * qualityKarmaDiscountRoundTrip.test.ts
 *
 * DB leg for karmaDiscount.requirements FK promotion (previously a raw JSON
 * blob with no integrity): a Quality with karmaDiscount seeds its value
 * column plus a QualityKarmaDiscountRequirements entity via
 * linkRequirementEntity, and getQualities() reconstructs an equal DTO.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Qualities,
  QualityKarmaDiscountRequirements,
} from "@neon-codex/database";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { getQualities } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  commonRequirementTypeEnum,
  otherRequirementTypeEnum,
  qualityCategoryEnum,
  sourceBookEnum,
  type RequirementsType,
} from "@neon-codex/common";

describe("Quality karmaDiscount round-trip", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("round-trips karmaDiscount value plus FK-linked requirements", async () => {
    const em = orm.em.fork();

    const referencedName = "Karma RT Aware";
    let referenced = await em.findOne(Qualities, { name: referencedName });
    if (!referenced) {
      referenced = new Qualities({
        name: referencedName,
        description: "Referenced quality for karma discount round-trip",
        category: qualityCategoryEnum.Positive,
        karma: 4,
        source: sourceBookEnum.Shadowrun5,
        page: 100,
      } as any);
      em.persist(referenced);
    }

    const qualityName = "Karma RT Blind-ish";
    let quality = await em.findOne(Qualities, { name: qualityName });
    if (!quality) {
      quality = new Qualities({
        name: qualityName,
        description: "Quality with karma discount for round-trip",
        category: qualityCategoryEnum.Negative,
        karma: -15,
        karmaDiscount: { value: -10 },
        source: sourceBookEnum.Shadowrun5,
        page: 100,
      } as any);
      em.persist(quality);
    }
    await em.flush();

    // Mirrors Blind's karmaDiscount shape (oneOf referenced qualities).
    const discountRequirements: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: {
            type: otherRequirementTypeEnum.Quality,
            value: { quality: referencedName },
          },
        },
      ],
    };

    const reqEntity = new QualityKarmaDiscountRequirements();
    reqEntity.quality = ref(quality);
    quality.karmaDiscountRequirements = ref(reqEntity);
    em.persist(reqEntity);
    await linkRequirementEntity(em, discountRequirements, reqEntity);
    await em.flush();
    em.clear();

    const response = await getQualities();
    expect(response).toHaveLength(2);
    const result = response.find((q) => q.name === qualityName);
    expect(result).toBeDefined();
    expect(result?.karmaDiscount).toEqual({
      value: -10,
      requirements: discountRequirements,
    });
    // The referenced quality itself carries no discount.
    const refResult = response.find((q) => q.name === referencedName);
    expect(refResult?.karmaDiscount).toBeUndefined();
  });
});
