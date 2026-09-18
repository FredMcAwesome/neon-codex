import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { init } from "../utils/db.js";
import {
  ChildRequirements,
  Cyberwares,
  Gears,
  GearRequirements,
} from "@neon-codex/database";
import { linkRequirementEntity } from "@neon-codex/database/build/seeders/requirementSeederHelper.js";
import { convertDBRequirement } from "../routes/character.js";
import type { MikroORM } from "@mikro-orm/postgresql";
import {
  augmentationCategoryEnum,
  cyberwareCategoryEnum,
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  otherRequirementTypeEnum,
  sourceBookEnum,
  gearCategoryEnum,
  restrictionEnum,
  type RequirementsType,
} from "@neon-codex/common";

describe("Partial Name Requirements", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await init();
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("round-trips a Cyberware partial name requirement via otherDetails JSON", async () => {
    const em = orm.em.fork();

    const node = new ChildRequirements();
    node.otherDetails = {
      type: otherRequirementTypeEnum.Cyberware,
      value: {
        name: "Datajack",
        partialName: true,
      },
    };
    em.persist(node);
    await em.flush();
    const id = node.id;
    em.clear();

    const loaded = await em.findOneOrFail(
      ChildRequirements,
      { id },
      { populate: ["*"] }
    );
    // Verified: No FK was set
    expect(loaded.otherCyberware).toBeUndefined();

    const dto = await convertDBRequirement(loaded);
    expect(dto).toEqual({
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          otherDetails: {
            type: otherRequirementTypeEnum.Cyberware,
            value: {
              name: "Datajack",
              partialName: true,
            },
          },
        },
      ],
    });
  });

  it("round-trips a generic parent Name partial requirement via parentDetails JSON", async () => {
    const em = orm.em.fork();

    const node = new ChildRequirements();
    node.parentDetails = {
      type: commonRequirementTypeEnum.Inner,
      generic: {
        type: genericRequirementTypeEnum.Name,
        value: {
          name: "Drone",
          partialName: true,
        },
      },
    };
    em.persist(node);
    await em.flush();
    const id = node.id;
    em.clear();

    const loaded = await em.findOneOrFail(
      ChildRequirements,
      { id },
      { populate: ["*"] }
    );
    // Verified: No parentName list FKs were set
    expect(loaded.parentGear).toBeUndefined();

    const dto = await convertDBRequirement(loaded);
    expect(dto).toEqual({
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            generic: {
              type: genericRequirementTypeEnum.Name,
              value: {
                name: "Drone",
                partialName: true,
              },
            },
          },
        },
      ],
    });
  });

  it("validates match exists and does not store FK during linkRequirementEntity for partial names", async () => {
    const em = orm.em.fork();

    // Create a mock augmentation that matches the partial name
    const aug = new Cyberwares({
      name: "Standard Datajack Plus",
      category: augmentationCategoryEnum.Cyberware,
      subtype: cyberwareCategoryEnum.Headware,
      source: sourceBookEnum.Shadowrun5,
      page: 100,
      description: "Test Cyberware",
      userSelectable: true,
      rating: 1 as any,
      essenceCost: [0.1] as any,
      availability: { rating: 1, restriction: restrictionEnum.Legal } as any,
      cost: [1000] as any,
    } as any);
    em.persist(aug);

    // Create a mock gear that matches the partial parent name
    const gear = new Gears({
      name: "Ares Predator Heavy Drone",
      category: gearCategoryEnum.CommunicationsAndCountermeasures,
      source: sourceBookEnum.Shadowrun5,
      page: 100,
      description: "Test Gear",
      userSelectable: true,
      availability: {
        rating: 1,
        restriction: restrictionEnum.Legal,
      },
      cost: [100],
    } as any);
    em.persist(gear);

    await em.flush();

    // Test seeding requirement with partial name
    const reqDto: RequirementsType = {
      type: commonRequirementTypeEnum.Inner,
      parentDetails: {
        type: commonRequirementTypeEnum.Inner,
        generic: {
          type: genericRequirementTypeEnum.Name,
          value: {
            name: "Heavy Drone",
            partialName: true,
          },
        },
      },
      otherDetails: {
        type: otherRequirementTypeEnum.Cyberware,
        value: {
          name: "Datajack",
          partialName: true,
        },
      },
    };

    const rootReq = new GearRequirements();
    await linkRequirementEntity(em, reqDto, rootReq);
    em.persist(rootReq);
    await em.flush();
    const reqId = rootReq.id;
    em.clear();

    const loadedReq = await em.findOneOrFail(
      GearRequirements,
      { id: reqId },
      { populate: ["*"] }
    );

    // Assert that NO FK relationships were created
    expect(loadedReq.otherCyberware).toBeUndefined();
    expect(loadedReq.parentGear).toBeUndefined();

    // Assert that text and partialName flags were stored in the JSON columns
    expect(loadedReq.otherDetails).toEqual({
      type: otherRequirementTypeEnum.Cyberware,
      value: {
        name: "Datajack",
        partialName: true,
      },
    });
    expect(loadedReq.parentDetails).toEqual({
      type: commonRequirementTypeEnum.Inner,
      generic: {
        type: genericRequirementTypeEnum.Name,
        value: {
          name: "Heavy Drone",
          partialName: true,
        },
      },
    });

    // Reconstruct through character API route
    const reconstructed = await convertDBRequirement(loadedReq);
    expect(reconstructed).toEqual({
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            generic: {
              type: genericRequirementTypeEnum.Name,
              value: {
                name: "Heavy Drone",
                partialName: true,
              },
            },
          },
          otherDetails: {
            type: otherRequirementTypeEnum.Cyberware,
            value: {
              name: "Datajack",
              partialName: true,
            },
          },
        },
      ],
    });
  });
});
