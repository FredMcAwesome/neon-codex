import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  Skills,
  SkillGroups,
  AdeptPowers,
  AdeptPowersBonuses,
} from "@neon-codex/database";
import { linkBonusEntity } from "@neon-codex/database/build/seeders/bonusSeederHelper.js";
import { convertDBBonus } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  attributeTypeEnum,
  bonusSkillModifierTypeEnum,
  inclusionTypeEnum,
  sourceBookEnum,
  skillCategoryEnum,
  type BonusType,
} from "@neon-codex/common";

describe("Bonus Round-Trip Verification", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("should correctly round-trip a complex bonus DTO", async () => {
    const em = orm.em.fork();

    // 1. Create mock supporting entities
    const skillName = "Test Stealth Skill";
    const skillGroupName = "Test Stealth Group";
    const powerName = "Test Adept Power";

    let skill = await em.findOne(Skills, { name: skillName });
    if (!skill) {
      skill = new Skills({
        name: skillName,
        isKnowledgeSkill: false,
        attribute: attributeTypeEnum.Agility,
        category: skillCategoryEnum.Combat,
        default: true,
        exotic: false,
        source: sourceBookEnum.Shadowrun5,
        page: 100,
        description: "Test description",
      } as any);
      em.persist(skill);
    }

    let skillGroup = await em.findOne(SkillGroups, { name: skillGroupName });
    if (!skillGroup) {
      skillGroup = new SkillGroups(skillGroupName);
      em.persist(skillGroup);
    }

    let adeptPower = await em.findOne(AdeptPowers, { name: powerName });
    if (!adeptPower) {
      adeptPower = new AdeptPowers({
        name: powerName,
        pointCost: 0.5,
        levels: true,
        limit: 10,
        source: sourceBookEnum.Shadowrun5,
        page: 100,
        description: "Test description",
      } as any);
      em.persist(adeptPower);
    }

    await em.flush();

    // 2. Define a complex Bonus DTO
    const bonusDto: BonusType = {
      skill: {
        skillIncreaseList: [
          {
            name: skillName,
            bonus: 2,
            modifierType: bonusSkillModifierTypeEnum.DicePoolIncrease,
          },
        ],
        skillGroupList: [
          {
            name: skillGroupName,
            bonus: 1,
            modifierType: bonusSkillModifierTypeEnum.DicePoolIncrease,
          },
        ],
        selectSkill: {
          skill: {
            enterName: false as const,
            restriction: {
              skillList: {
                skillList: [skillName],
                limit: inclusionTypeEnum.Include,
              },
            },
          },
          bonus: {
            modifierType: bonusSkillModifierTypeEnum.Linked,
          },
        },
      },
      power: {
        specificPowerList: [
          {
            name: powerName,
            bonusOverride: { value: 3 },
          },
        ],
      },
      combatAndWeapon: {
        attackModifiers: {
          smartLinkModifier: 2,
          unarmedModifier: [1],
        },
        damageValueModifiers: {
          unarmedModifier: [2],
        },
      },
    };

    // 3. Seed the entity
    const bonusEntity = new AdeptPowersBonuses(ref(adeptPower), bonusDto);
    adeptPower.bonus = ref(bonusEntity);
    await linkBonusEntity(em, bonusDto, bonusEntity);
    em.persist(bonusEntity);
    await em.flush();

    const bonusId = bonusEntity.id;
    em.clear();

    // 4. Load the entity back
    const loadedBonus = await em.findOne(
      AdeptPowersBonuses,
      { id: bonusId },
      { populate: ["*"] }
    );
    expect(loadedBonus).not.toBeNull();

    // 5. Convert back to DTO
    const resultDto = await convertDBBonus(loadedBonus!);

    // 6. AssertIONS - check key properties
    expect(resultDto.skill?.skillIncreaseList?.[0].name).toBe(skillName);
    expect(resultDto.skill?.skillIncreaseList?.[0].bonus).toBe(2);
    expect(resultDto.skill?.skillGroupList?.[0].name).toBe(skillGroupName);
    expect(resultDto.skill?.selectSkill?.skill.restriction).toBeDefined();

    // Check combat modifiers
    expect(resultDto.combatAndWeapon?.attackModifiers?.smartLinkModifier).toBe(
      2
    );
    expect(resultDto.combatAndWeapon?.attackModifiers?.unarmedModifier).toEqual(
      [1]
    );
    expect(
      resultDto.combatAndWeapon?.damageValueModifiers?.unarmedModifier
    ).toEqual([2]);

    // Check powers
    expect(resultDto.power?.specificPowerList?.[0].name).toBe(powerName);
    expect(resultDto.power?.specificPowerList?.[0].bonusOverride).toEqual({
      value: 3,
    });
  });
});
