/**
 * critterPowerRoundTrip.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  CritterPowers,
  CritterPowersBonuses,
  CritterPowerRequirements,
  CritterPowerForbidden,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertCritterPowerDBToDTO } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  actionEnum,
  augmentationCategoryEnum,
  augmentationGradeEnum,
  critterPowerCategoryEnum,
  durationEnum,
  sourceBookEnum,
  spellPowerRangeEnum,
  spellPowerTargetEnum,
  spellTypeEnum,
  type AugmentationType,
  type BonusType,
  type CritterPowerType,
  commonRequirementTypeEnum,
  type RequirementsType,
} from "@neon-codex/common";
import { assertAllProperties } from "./testHelpers.js";

describe("CritterPower Round-Trip Verification", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("should correctly round-trip a CritterPower DTO with ALL properties", async () => {
    const em = orm.em.fork();

    const powerName = "Power RT Regeneration";

    const powerScalars = {
      name: powerName,
      category: critterPowerCategoryEnum.Paranormal,
      type: spellTypeEnum.Physical,
      action: actionEnum.Auto,
      range: {
        value: spellPowerRangeEnum.Self,
        target: spellPowerTargetEnum.Target,
      },
      duration: durationEnum.Always,
      source: sourceBookEnum.Shadowrun5,
      page: 399,
      description: "Regeneration for testing",
    };

    let power = await em.findOne(CritterPowers, { name: powerName });
    if (!power) {
      power = new CritterPowers(powerScalars as any);
      em.persist(power);
    }
    await em.flush();

    // 1. Bonus
    const bonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 3 } },
    };
    const bonusEntity = new CritterPowersBonuses(ref(power), bonusDto);
    power.bonus = ref(bonusEntity);
    em.persist(bonusEntity);
    await linkBonusEntity(em, bonusDto, bonusEntity, powerName);

    // 2. Requirements
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: { type: "essenceMinimum" as any, value: 2 },
        },
      ],
    };
    const reqEntity = new CritterPowerRequirements();
    reqEntity.critterPower = ref(power);
    power.requirements = ref(reqEntity);
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
    const forbiddenEntity = new CritterPowerForbidden();
    forbiddenEntity.critterPower = ref(power);
    power.forbidden = ref(forbiddenEntity);
    em.persist(forbiddenEntity);
    await linkRequirementEntity(em, forbiddenDto, forbiddenEntity);

    await em.flush();
    const id = power.id;
    em.clear();

    const loaded = await em.findOne(CritterPowers, { id }, { populate: ["*"] });
    expect(loaded).not.toBeNull();

    const resultDto = await convertCritterPowerDBToDTO(loaded!);
    const expectedDto: CritterPowerType = {
      ...powerScalars,
      bonus: bonusDto,
      requirements: requirementsDto,
      forbidden: forbiddenDto,
    };

    assertAllProperties(resultDto, expectedDto);
  });
});
