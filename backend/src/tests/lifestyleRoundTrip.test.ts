/**
 * lifestyleRoundTrip.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Lifestyles,
  LifestylesBonuses,
  LifestyleRequirements,
  LifestyleForbidden,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertLifestyleDBToDTO } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  gridCategoryEnum,
  sourceBookEnum,
  commonRequirementTypeEnum,
  type BonusType,
  type LifestyleType,
  type RequirementsType,
} from "@neon-codex/common";
import { assertAllProperties } from "./testHelpers.js";

describe("Lifestyle Round-Trip Verification", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("should correctly round-trip a Lifestyle DTO with ALL properties", async () => {
    const em = orm.em.fork();

    const lifestyleName = "Lifestyle RT Luxury";

    const lifestyleScalars = {
      name: lifestyleName,
      cost: { amount: 100000 } as any,
      lifestylePoints: 10,
      allowBonusLifestylePoints: true as const,
      freegridList: [gridCategoryEnum.GlobalGrid],
      dice: 4,
      startingNuyenMultiplier: 100,
      costIncreasePerCategoryLevelIncrease: { amount: 5000 } as any,
      lifestyleCategoryDefaults: { comfort: 5 } as any,
      source: sourceBookEnum.Shadowrun5,
      page: 373,
      description: "Luxury lifestyle for testing",
    };

    let lifestyle = await em.findOne(Lifestyles, { name: lifestyleName });
    if (!lifestyle) {
      lifestyle = new Lifestyles(lifestyleScalars as any);
      em.persist(lifestyle);
    }
    await em.flush();

    // 1. Bonus
    const bonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 1 } },
    };
    const bonusEntity = new LifestylesBonuses(ref(lifestyle), bonusDto);
    lifestyle.bonus = ref(bonusEntity);
    em.persist(bonusEntity);
    await linkBonusEntity(em, bonusDto, bonusEntity, lifestyleName);

    // 2. Requirements
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: { type: "essenceMinimum" as any, value: 1 },
        },
      ],
    };
    const reqEntity = new LifestyleRequirements();
    reqEntity.lifestyle = ref(lifestyle);
    lifestyle.requirements = ref(reqEntity);
    em.persist(reqEntity);
    await linkRequirementEntity(em, requirementsDto, reqEntity);

    // 3. Forbidden
    const forbiddenDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: { type: "magicEnabled" as any, value: false },
        },
      ],
    };
    const forbiddenEntity = new LifestyleForbidden();
    forbiddenEntity.lifestyle = ref(lifestyle);
    lifestyle.forbidden = ref(forbiddenEntity);
    em.persist(forbiddenEntity);
    await linkRequirementEntity(em, forbiddenDto, forbiddenEntity);

    await em.flush();
    const id = lifestyle.id;
    em.clear();

    const loaded = await em.findOne(Lifestyles, { id }, { populate: ["*"] });
    expect(loaded).not.toBeNull();

    const resultDto = await convertLifestyleDBToDTO(loaded!);
    const expectedDto: LifestyleType = {
      ...lifestyleScalars,
      bonus: bonusDto,
      requirements: requirementsDto,
      forbidden: forbiddenDto,
    };

    assertAllProperties(resultDto, expectedDto);
  });
});
