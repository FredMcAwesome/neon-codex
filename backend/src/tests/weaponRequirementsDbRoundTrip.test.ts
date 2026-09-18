/**
 * weaponRequirementsDbRoundTrip.test.ts
 *
 * DB leg for the restored weapon requirements: a host-requirement DTO with a
 * named skill leaf, an exists-condition (`noOverride: true`) leaf and a
 * subtype leaf must seed via linkRequirementEntity (FK for the named skill,
 * JSON-only for the exists-condition) and convert back via
 * convertDBRequirement to an equal DTO.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import { MeleeWeapons, Skills, WeaponRequirements } from "@neon-codex/database";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertDBRequirement } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  attributeTypeEnum,
  commonRequirementTypeEnum,
  damageTypeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  restrictionEnum,
  skillCategoryEnum,
  sourceBookEnum,
  weaponCategoryEnum,
  weaponRequirementTypeEnum,
  type RequirementsType,
} from "@neon-codex/common";

describe("Weapon requirements DB round-trip", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("round-trips named-skill, exists-condition and subtype leaves", async () => {
    const em = orm.em.fork();

    const skillNames = ["Longarms", "Heavy Weapons"];
    for (const skillName of skillNames) {
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
          description: "Test skill for weapon round-trip",
        } as any);
        em.persist(skill);
      }
    }
    await em.flush();

    const hostSkill = await em.findOneOrFail(Skills, { name: "Longarms" });
    const weaponName = "Weapon RT Underbarrel Test";
    let weapon = await em.findOne(MeleeWeapons, { name: weaponName });
    if (!weapon) {
      weapon = new MeleeWeapons(
        {
          name: weaponName,
          description: "Test host weapon for requirement round-trip",
          concealability: 0,
          accuracy: [7],
          damage: [{ damageAmount: [9], type: damageTypeEnum.Physical }],
          armourPenetration: [[0]],
          allowAccessories: true,
          availability: { rating: 4, restriction: restrictionEnum.Legal },
          cost: [500],
          source: sourceBookEnum.Shadowrun5,
          page: 100,
          subtype: meleeWeaponTypeEnum.Clubs,
          meleeOptions: { reach: 1 },
        } as any,
        ref(hostSkill)
      );
      em.persist(weapon);
    }
    await em.flush();

    // Mirrors the restored Underbarrel Grenade Launcher shape: a subtype
    // leaf, a named-skill leaf (FK) and an exists-condition leaf (JSON-only).
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            weapon: {
              type: weaponRequirementTypeEnum.Subtype,
              value: {
                category: weaponCategoryEnum.Firearm,
                subtype: firearmWeaponTypeEnum.Shotguns,
              },
            },
          },
        },
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            weapon: {
              type: weaponRequirementTypeEnum.Skill,
              value: { skill: "Longarms" },
            },
          },
        },
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            weapon: {
              type: weaponRequirementTypeEnum.Skill,
              value: { noOverride: true },
            },
          },
        },
      ],
    };

    const reqEntity = new WeaponRequirements();
    reqEntity.weapon = ref(weapon);
    weapon.requirements = ref(reqEntity);
    em.persist(reqEntity);
    await linkRequirementEntity(em, requirementsDto, reqEntity);
    await em.flush();
    const reqId = reqEntity.id;
    em.clear();

    const loadedReq = await em.findOneOrFail(
      WeaponRequirements,
      { id: reqId },
      { populate: ["*"] }
    );
    const children = await loadedReq.subRequirements.loadItems();
    expect(children).toHaveLength(3);

    // The named-skill leaf resolves its FK; the exists-condition stays JSON-only.
    await em.populate(children, ["parentWeaponSkill"]);
    const namedSkillChild = children.find(
      (c) =>
        c.parentDetails !== undefined &&
        c.parentDetails !== null &&
        "weapon" in c.parentDetails &&
        c.parentDetails.weapon.type === weaponRequirementTypeEnum.Skill &&
        (c.parentDetails.weapon.value as { skill?: string }).skill ===
          "Longarms"
    );
    expect(namedSkillChild?.parentWeaponSkill).toBeDefined();
    const unknownChild = children.find(
      (c) =>
        c.parentDetails !== undefined &&
        c.parentDetails !== null &&
        "weapon" in c.parentDetails &&
        c.parentDetails.weapon.type === weaponRequirementTypeEnum.Skill &&
        (c.parentDetails.weapon.value as { noOverride?: boolean })
          .noOverride === true
    );
    expect(unknownChild).toBeDefined();
    expect(unknownChild?.parentWeaponSkill).toBeUndefined();

    const reconstructed = await convertDBRequirement(loadedReq);
    // subRequirements is ORDER BY id (DTO insertion order), so a strict
    // comparison also proves deterministic read order.
    expect(reconstructed).toEqual(requirementsDto);
  });
});
