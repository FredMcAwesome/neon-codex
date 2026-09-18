/**
 * augmentationRoundTrip.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Augmentations,
  Cyberwares,
  AugmentationsBonuses,
  AugmentationRequirements,
  AugmentationForbidden,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertAugmentationDBToDTO } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  augmentationCategoryEnum,
  cyberwareCategoryEnum,
  augmentationGradeEnum,
  sourceBookEnum,
  commonRequirementTypeEnum,
  type AugmentationType,
  type BonusType,
  type RequirementsType,
} from "@neon-codex/common";
import { assertAllProperties } from "./testHelpers.js";

describe("Augmentation Round-Trip Verification", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("should correctly round-trip an Augmentation DTO with ALL properties", async () => {
    const em = orm.em.fork();

    const augName = "Aug RT Cyberware";

    const augScalars = {
      name: augName,
      category: augmentationCategoryEnum.Cyberware,
      subtype: cyberwareCategoryEnum.Bodyware,
      rating: 3 as any,
      essenceCost: [1.5] as any,
      capacity: "[5]",
      availability: { availability: 12, resistance: "R" } as any,
      cost: 50000 as any,
      source: sourceBookEnum.Shadowrun5,
      page: 450,
      description: "Cyberware for testing",
    };

    let aug = await em.findOne(Augmentations, { name: augName });
    if (!aug) {
      aug = new Cyberwares(augScalars as any);
      em.persist(aug);
    }
    await em.flush();

    // 1. Bonus
    const bonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 2 } },
    };
    const bonusEntity = new AugmentationsBonuses(ref(aug), bonusDto);
    aug.bonus = ref(bonusEntity);
    em.persist(bonusEntity);
    await linkBonusEntity(em, bonusDto, bonusEntity, augName);

    // 2. Requirements
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: { type: "essenceMinimum" as any, value: 0.5 },
        },
      ],
    };
    const reqEntity = new AugmentationRequirements();
    reqEntity.augmentation = ref(aug);
    aug.requirements = ref(reqEntity);
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
    const forbiddenEntity = new AugmentationForbidden();
    forbiddenEntity.augmentation = ref(aug);
    aug.forbidden = ref(forbiddenEntity);
    em.persist(forbiddenEntity);
    await linkRequirementEntity(em, forbiddenDto, forbiddenEntity);

    await em.flush();
    const id = aug.id;
    em.clear();

    const loaded = await em.findOne(Augmentations, { id }, { populate: ["*"] });
    expect(loaded).not.toBeNull();

    const resultDto = await convertAugmentationDBToDTO(loaded!);
    const expectedDto: AugmentationType = {
      ...augScalars,
      bonus: bonusDto,
      requirements: requirementsDto,
      forbidden: forbiddenDto,
      pairIncludeList: [],
      allowedGearList: [],
      includedGearList: [],
    };

    assertAllProperties(resultDto, expectedDto);
  });
});
