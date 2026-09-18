/**
 * exactMatchParentNameRequirement.test.ts
 *
 * Regression tests for the orphaned-child issue (former requirement #4661,
 * "Personal Drone Rack" -> "Micro-Hardpoint"):
 *
 * 1. An exact-match parent Name leaf seeded via linkRequirementEntity must
 *    retain its parentDetails JSON AND create the FK join row, and must
 *    round-trip back to the original DTO.
 * 2. A leaf DTO with neither parentDetails nor otherDetails must fail fast
 *    at seed time instead of persisting an empty child row.
 * 3. A truly empty row (no JSON, no FK, no children) must fail fast at read
 *    time instead of silently vanishing.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  ArmourModifications,
  ChildRequirements,
  Gears,
  GearRequirements,
} from "@neon-codex/database";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertDBRequirement } from "../routes/character.js";
import { ref, type MikroORM } from "@mikro-orm/postgresql";
import {
  armourModCategoryEnum,
  commonRequirementTypeEnum,
  gearCategoryEnum,
  genericRequirementTypeEnum,
  restrictionEnum,
  sourceBookEnum,
  type RequirementsType,
} from "@neon-codex/common";

describe("Exact-match parent Name requirements", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  async function seedArmourModAndGear(
    em: ReturnType<MikroORM["em"]["fork"]>,
    armourModName: string,
    gearName: string
  ) {
    let armourMod = await em.findOne(ArmourModifications, {
      name: armourModName,
    });
    if (armourMod === null) {
      armourMod = new ArmourModifications({
        name: armourModName,
        category: armourModCategoryEnum.General,
        maxRating: 1,
        damageReduction: 0,
        capacityCost: [0],
        availability: { rating: [0], restriction: "" },
        cost: [0],
        userSelectable: false,
        source: sourceBookEnum.KillCode,
        page: 73,
        description: "Test armour mod for exact-match parent requirement",
      } as any);
      em.persist(armourMod);
    }

    let gear = await em.findOne(Gears, { name: gearName });
    if (gear === null) {
      gear = new Gears({
        name: gearName,
        category: gearCategoryEnum.ArmorEnhancements,
        source: sourceBookEnum.KillCode,
        page: 73,
        description: "Test gear for exact-match parent requirement",
        userSelectable: true,
        availability: { rating: 12, restriction: restrictionEnum.Restricted },
        cost: [500],
      } as any);
      em.persist(gear);
    }

    await em.flush();
    return { armourMod, gear };
  }

  it("round-trips an exact-match parent Name leaf (Personal Drone Rack shape)", async () => {
    const em = orm.em.fork();
    const armourModName = "Exact RT Micro-Hardpoint";
    const gearName = "Exact RT Personal Drone Rack";
    const { gear } = await seedArmourModAndGear(em, armourModName, gearName);

    // Mirrors converter output for Personal Drone Rack.
    const requirementsDto: RequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            generic: {
              type: genericRequirementTypeEnum.Name,
              value: { name: armourModName },
            },
          },
        },
      ],
    };

    const reqEntity = new GearRequirements();
    reqEntity.gear = ref(gear);
    gear.requirements = ref(reqEntity);
    em.persist(reqEntity);
    await linkRequirementEntity(em, requirementsDto, reqEntity);
    await em.flush();
    const reqId = reqEntity.id;
    em.clear();

    const loadedReq = await em.findOneOrFail(
      GearRequirements,
      { id: reqId },
      { populate: ["*"] }
    );
    const children = await loadedReq.subRequirements.loadItems();
    expect(children).toHaveLength(1);
    const child = children[0];

    // The row must stay self-describing: parentDetails JSON retained.
    expect(child.parentDetails).toEqual(
      (requirementsDto.allOf[0] as { parentDetails: unknown }).parentDetails
    );
    // ...and the FK column must be set.
    await em.populate(child, ["parentArmourModification"]);
    expect(child.parentArmourModification).toBeDefined();
    const loadedMod = await child.parentArmourModification!.load();
    expect(loadedMod?.name).toBe(armourModName);

    const reconstructed = await convertDBRequirement(loadedReq);
    expect(reconstructed).toEqual(requirementsDto);
  });

  it("fails fast at read time for a truly empty row", async () => {
    const em = orm.em.fork();

    // Simulate the former orphaned-child shape (#4661): nothing on the row.
    const orphan = new ChildRequirements();
    em.persist(orphan);
    await em.flush();
    const childId = orphan.id;
    em.clear();

    const loadedChild = await em.findOneOrFail(
      ChildRequirements,
      { id: childId },
      { populate: ["*"] }
    );
    expect(loadedChild.parentDetails ?? null).toBeNull();
    expect(loadedChild.otherDetails ?? null).toBeNull();

    await expect(convertDBRequirement(loadedChild)).rejects.toThrow();
  });

  it("rejects an empty leaf DTO at seed time instead of persisting an empty row", async () => {
    const em = orm.em.fork();
    const { gear } = await seedArmourModAndGear(
      em,
      "Empty RT Micro-Hardpoint",
      "Empty RT Personal Drone Rack"
    );

    const badDto = {
      type: commonRequirementTypeEnum.AllOf,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allOf: [{} as any],
    } as unknown as RequirementsType;

    const reqEntity = new GearRequirements();
    reqEntity.gear = ref(gear);
    em.persist(reqEntity);
    await expect(
      linkRequirementEntity(em, badDto, reqEntity)
    ).rejects.toThrow();
  });
});
