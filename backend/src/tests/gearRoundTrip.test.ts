/**
 * gearRoundTrip.test.ts
 *
 * Full pipeline round-trip for the Gear entity.
 * Each test seeds a Gears row with EVERY field from GearType filled in,
 * links a GearsBonuses + GearRequirements + GearForbidden, loads the row
 * back from a clean EntityManager, converts it via convertGearDBToDTO, and
 * uses assertAllProperties to verify that no property was silently dropped.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Gears,
  GearsBonuses,
  GearRequirements,
  GearForbidden,
  Skills,
  AdeptPowers,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertGearDBToDTO } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  attributeTypeEnum,
  commonRequirementTypeEnum,
  gearCategoryEnum,
  gearDeviceRatingEnum,
  gearRatingEnum,
  mathOperatorEnum,
  otherRequirementTypeEnum,
  personaFormEnum,
  ratingMeaningEnum,
  restrictionEnum,
  sourceBookEnum,
  skillCategoryEnum,
  bonusSkillModifierTypeEnum,
  type BonusType,
  type GearType,
  type RequirementsType,
} from "@neon-codex/common";
import { assertAllProperties } from "./testHelpers.js";

describe("Gear Round-Trip Verification", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("should correctly round-trip a Gear DTO with ALL properties (bonus + requirements + forbidden)", async () => {
    const em = orm.em.fork();

    // ----------------------------------------------------------------
    // 1. Create supporting entities referenced by bonus / requirements
    // ----------------------------------------------------------------
    const skillName = "Gear RT Stealth";
    const adeptPowerName = "Gear RT Kinesics";

    let skill = await em.findOne(Skills, { name: skillName });
    if (!skill) {
      skill = new Skills({
        name: skillName,
        isKnowledgeSkill: false,
        attribute: attributeTypeEnum.Agility,
        category: skillCategoryEnum.Physical,
        default: true,
        exotic: false,
        source: sourceBookEnum.Shadowrun5,
        page: 155,
        description: "Test skill for gear round-trip",
      } as any);
      em.persist(skill);
    }

    let adeptPower = await em.findOne(AdeptPowers, { name: adeptPowerName });
    if (!adeptPower) {
      adeptPower = new AdeptPowers({
        name: adeptPowerName,
        pointCost: 0.5,
        levels: false,
        limit: 0,
        source: sourceBookEnum.Shadowrun5,
        page: 309,
        description: "Test adept power for gear round-trip",
      } as any);
      em.persist(adeptPower);
    }

    await em.flush();

    // ----------------------------------------------------------------
    // 2. Seed a Gears entity with EVERY GearType field populated
    // ----------------------------------------------------------------
    const gearName = "Gear RT Commlink Alpha";

    // Keep all scalar / JSON properties in one object so we can reference
    // them later when building the expected DTO.
    const gearScalars = {
      name: gearName,
      description: "A test commlink for full round-trip verification",
      category: gearCategoryEnum.CommunicationsAndCountermeasures,
      minRating: 1 as const,
      maxRating: { option: gearRatingEnum.Rating } as const,
      ratingMeaning: ratingMeaningEnum.Rating,
      allowCategoryList: [gearCategoryEnum.Commlinks] as [gearCategoryEnum],
      purchaseQuantity: 1,
      weaponBonus: { accuracy: 1 } as any,
      isFlechetteAmmo: true as const,
      flechetteWeaponBonus: { dicePool: 2 } as any,
      ammoForWeaponType: [{ type: "Pistol" as any, count: 10 }],
      explosiveWeight: 0.5 as const,
      userSelectable: false as const,
      deviceRating: { option: gearDeviceRatingEnum.Rating } as const,
      programs: [2] as [number],
      attributeArray: [3, 3, 3, 3] as [number, number, number, number],
      attack: 3 as const,
      sleaze: 3 as const,
      dataProcessing: 3 as const,
      firewall: 3 as const,
      canFormPersona: personaFormEnum.Self,
      capacityInformation: { capacity: [4] } as any,
      armourCapacityInformation: { capacity: [2] } as any,
      requireParent: true as const,
      modifyAttributeArray: [1, 0, 0, 0] as [number, number, number, number],
      modifyAttack: 1 as const,
      modifySleaze: 0 as const,
      modifyDataProcessing: 0 as const,
      modifyFirewall: 0 as const,
      addMatrixBoxes: 1,
      renameCustomLabel: true as const,
      availability: {
        rating: 6,
        restriction: restrictionEnum.Restricted,
      } as any,
      cost: [350] as [number],
      source: sourceBookEnum.Shadowrun5,
      page: 228,
    };

    let gear = await em.findOne(Gears, { name: gearName });
    if (!gear) {
      gear = new Gears({
        ...gearScalars,
      } as any);
      em.persist(gear);
    }

    await em.flush();

    // ----------------------------------------------------------------
    // 3. Link GearsBonuses (simple combat bonus covering attackModifiers)
    // ----------------------------------------------------------------
    const bonusDto: BonusType = {
      combatAndWeapon: {
        attackModifiers: {
          smartLinkModifier: 2,
          unarmedModifier: [1],
        },
      },
      skill: {
        skillIncreaseList: [
          {
            name: skillName,
            bonus: 1,
            modifierType: bonusSkillModifierTypeEnum.DicePoolIncrease,
          },
        ],
      },
    };

    const bonusEntity = new GearsBonuses(ref(gear), bonusDto);
    gear.bonus = ref(bonusEntity);
    em.persist(bonusEntity);
    await linkBonusEntity(em, bonusDto, bonusEntity, gearName);

    // ----------------------------------------------------------------
    // 4. Link GearRequirements — otherDetails: Skill FK round-trip
    // ----------------------------------------------------------------
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: {
            type: otherRequirementTypeEnum.Skill,
            value: { name: skillName, value: 1 },
          },
        },
      ],
    };

    const reqEntity = new GearRequirements();
    reqEntity.gear = ref(gear);
    gear.requirements = ref(reqEntity);
    em.persist(reqEntity);
    await linkRequirementEntity(em, requirementsDto, reqEntity);

    // ----------------------------------------------------------------
    // 5. Link GearForbidden — otherDetails: AdeptPower FK round-trip
    // ----------------------------------------------------------------
    const forbiddenDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: {
            type: otherRequirementTypeEnum.AdeptPower,
            value: adeptPowerName,
          },
        },
      ],
    };

    const forbiddenEntity = new GearForbidden();
    forbiddenEntity.gear = ref(gear);
    gear.forbidden = ref(forbiddenEntity);
    em.persist(forbiddenEntity);
    await linkRequirementEntity(em, forbiddenDto, forbiddenEntity);

    await em.flush();

    const gearId = gear.id;
    em.clear();

    // ----------------------------------------------------------------
    // 6. Load back from a fresh entity manager
    // ----------------------------------------------------------------
    const loadedGear = await em.findOne(
      Gears,
      { id: gearId },
      { populate: ["*"] }
    );
    expect(loadedGear).not.toBeNull();

    // ----------------------------------------------------------------
    // 7. Convert back to DTO
    // ----------------------------------------------------------------
    const resultDto = await convertGearDBToDTO(loadedGear!);

    // ----------------------------------------------------------------
    // 8. Build the expected DTO (every field we seeded)
    //    `allowedGearList` and `includedGearList` are always returned by
    //    the converter, even when empty, so we include them here.
    // ----------------------------------------------------------------
    const expectedDto: GearType = {
      ...gearScalars,
      bonus: bonusDto,
      requirements: requirementsDto,
      forbidden: forbiddenDto,
      // Always-present collection fields (empty since we didn't seed items)
      allowedGearList: [],
      includedGearList: [],
    };

    // ----------------------------------------------------------------
    // 9. Assert every property — nothing silently dropped, nothing added
    // ----------------------------------------------------------------
    assertAllProperties(resultDto, expectedDto);

    // Spot-check FK-resolved values explicitly for clarity
    expect(
      (resultDto.requirements as any).allOf[0].otherDetails.value.name
    ).toBe(skillName);
    expect((resultDto.forbidden as any).allOf[0].otherDetails.value).toBe(
      adeptPowerName
    );
    expect(resultDto.bonus?.skill?.skillIncreaseList?.[0].name).toBe(skillName);
  });
});
