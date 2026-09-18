/**
 * bonusSlotRoundTrip.test.ts
 *
 * The secondary bonus slots (augmentation pair/wireless/wirelessPair,
 * armour wireless, armour-mod wireless) used to be raw JSON blobs with no
 * FK integrity. They are now dedicated Bonuses STI entities linked via
 * linkBonusEntity and converted via convertDBBonus, with the wire shape
 * unchanged. Each case seeds one slot (or all three for augmentations),
 * reloads from a clean EntityManager and asserts an exact DTO round-trip.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Armours,
  ArmourModifications,
  Augmentations,
  Cyberwares,
  AugmentationsPairBonuses,
  AugmentationsWirelessBonuses,
  AugmentationsWirelessPairBonuses,
  ArmoursWirelessBonuses,
  ArmourModificationsWirelessBonuses,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import {
  convertArmourDBToDTO,
  convertAugmentationDBToDTO,
  getArmourModifications,
} from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  armourCategoryEnum,
  armourModCategoryEnum,
  augmentationCategoryEnum,
  cyberwareCategoryEnum,
  restrictionEnum,
  sourceBookEnum,
  type ArmourModType,
  type ArmourType,
  type AugmentationType,
  type BonusType,
} from "@neon-codex/common";
import { assertAllProperties } from "./testHelpers.js";

describe("Secondary bonus slot round-trip", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("round-trips augmentation pair/wireless/wirelessPair bonuses", async () => {
    const em = orm.em.fork();

    const augName = "Bonus RT Cyberware Slots";
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
      description: "Cyberware for bonus slot testing",
    };

    let aug = await em.findOne(Augmentations, { name: augName });
    if (!aug) {
      aug = new Cyberwares(augScalars as any);
      em.persist(aug);
    }
    await em.flush();

    // Distinct scalar payloads per slot so a swapped link would fail.
    const pairBonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 3 } },
    };
    const wirelessBonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 4 } },
    };
    const wirelessPairBonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 5 } },
    };

    const pairEntity = new AugmentationsPairBonuses(ref(aug), pairBonusDto);
    aug.pairBonus = ref(pairEntity);
    em.persist(pairEntity);
    await linkBonusEntity(em, pairBonusDto, pairEntity, augName);

    const wirelessEntity = new AugmentationsWirelessBonuses(
      ref(aug),
      wirelessBonusDto
    );
    aug.wirelessBonus = ref(wirelessEntity);
    em.persist(wirelessEntity);
    await linkBonusEntity(em, wirelessBonusDto, wirelessEntity, augName);

    const wirelessPairEntity = new AugmentationsWirelessPairBonuses(
      ref(aug),
      wirelessPairBonusDto
    );
    aug.wirelessPairBonus = ref(wirelessPairEntity);
    em.persist(wirelessPairEntity);
    await linkBonusEntity(
      em,
      wirelessPairBonusDto,
      wirelessPairEntity,
      augName
    );

    await em.flush();
    const id = aug.id;
    em.clear();

    const loaded = await em.findOne(Augmentations, { id }, { populate: ["*"] });
    expect(loaded).not.toBeNull();

    const resultDto = await convertAugmentationDBToDTO(loaded!);
    const expectedDto: AugmentationType = {
      ...augScalars,
      pairBonus: pairBonusDto,
      wirelessBonus: wirelessBonusDto,
      wirelessPairBonus: wirelessPairBonusDto,
      pairIncludeList: [],
      allowedGearList: [],
      includedGearList: [],
    };
    assertAllProperties(resultDto, expectedDto);
  });

  it("round-trips an armour wireless bonus", async () => {
    const em = orm.em.fork();

    const armourName = "Bonus RT Armour Wireless";
    const armourScalars = {
      name: armourName,
      description: "Armour for wireless bonus testing",
      category: armourCategoryEnum.Armour,
      damageReduction: 2 as any,
      capacity: 6 as any,
      availability: { rating: 4, restriction: restrictionEnum.Legal } as any,
      cost: [800] as any,
      source: sourceBookEnum.Shadowrun5,
      page: 100,
    };

    let armour = await em.findOne(Armours, { name: armourName });
    if (!armour) {
      armour = new Armours(armourScalars as any);
      em.persist(armour);
    }
    await em.flush();

    const wirelessBonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 6 } },
    };
    const wirelessEntity = new ArmoursWirelessBonuses(
      ref(armour),
      wirelessBonusDto
    );
    armour.wirelessBonus = ref(wirelessEntity);
    em.persist(wirelessEntity);
    await linkBonusEntity(em, wirelessBonusDto, wirelessEntity, armourName);

    await em.flush();
    const id = armour.id;
    em.clear();

    const loaded = await em.findOne(Armours, { id }, { populate: ["*"] });
    expect(loaded).not.toBeNull();

    const resultDto = await convertArmourDBToDTO(loaded!);
    const expectedDto: ArmourType = {
      ...armourScalars,
      wirelessBonus: wirelessBonusDto,
      availability: armourScalars.availability,
      cost: armourScalars.cost,
      source: armourScalars.source,
      page: armourScalars.page,
    };
    assertAllProperties(resultDto, expectedDto);
  });

  it("round-trips an armour-mod wireless bonus", async () => {
    const em = orm.em.fork();

    const modName = "Bonus RT Armour Mod Wireless";
    const modScalars = {
      name: modName,
      description: "Armour mod for wireless bonus testing",
      category: armourModCategoryEnum.General,
      maxRating: 1,
      damageReduction: 1 as any,
      capacityCost: [1] as any,
      availability: { rating: 4, restriction: restrictionEnum.Legal } as any,
      cost: [500] as any,
      source: sourceBookEnum.Shadowrun5,
      page: 100,
    };

    let mod = await em.findOne(ArmourModifications, { name: modName });
    if (!mod) {
      mod = new ArmourModifications(modScalars as any);
      em.persist(mod);
    }
    await em.flush();

    const wirelessBonusDto: BonusType = {
      combatAndWeapon: { attackModifiers: { smartLinkModifier: 7 } },
    };
    const wirelessEntity = new ArmourModificationsWirelessBonuses(
      ref(mod),
      wirelessBonusDto
    );
    mod.wirelessBonus = ref(wirelessEntity);
    em.persist(wirelessEntity);
    await linkBonusEntity(em, wirelessBonusDto, wirelessEntity, modName);

    await em.flush();
    em.clear();

    const response = await getArmourModifications();
    expect(response).toHaveLength(1);
    const expectedDto: ArmourModType = {
      ...modScalars,
      includedGearList: [],
      wirelessBonus: wirelessBonusDto,
      availability: modScalars.availability,
      cost: modScalars.cost,
      source: modScalars.source,
      page: modScalars.page,
    };
    assertAllProperties(response[0], expectedDto);
  });
});
