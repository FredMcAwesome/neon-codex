import { http, HttpResponse, type RequestHandler } from "msw";
import { SERVER } from "../../utils/config";
import { createTRPCMsw, httpLink } from "msw-trpc";
import type { AppRouter } from "@neon-codex/backend";
import {
  attributeTypeEnum,
  heritageCategoryEnum,
  skillCategoryEnum,
  talentCategoryEnum,
  type PriorityTableType,
  type PriorityType,
} from "@neon-codex/common";

export const trpcMock = createTRPCMsw<AppRouter>({
  links: [
    httpLink({
      url: SERVER + "/trpc",
    }),
  ],
});

export const handlers: RequestHandler[] = [
  http.get("*/api/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),

  // Mock TRPC query: character.priorities
  trpcMock.character.priorities.query(() => {
    const priorityLevel: PriorityType = {
      heritages: {
        name: "Heritage A",
        heritageList: [
          { name: "Human", specialAttributePoints: 1, karmaCost: 0 },
          { name: "Elf", specialAttributePoints: 0, karmaCost: 0 },
        ],
      },
      attributes: { name: "Attributes A", attributes: 24 },

      talents: {
        name: "Talent A",
        talentList: [
          {
            name: "Mundane",
            label: "Mundane",
            category: talentCategoryEnum.Mundane,
          },
          {
            name: "Magician",
            label: "Magician",
            category: talentCategoryEnum.Magic as const,
            magic: 6,
          },
        ],
      },
      skills: { name: "Skills A", skillPoints: 46, skillGroupPoints: 10 },
      resources: {
        streetLevel: { name: "450k", resources: 450000 },
        standard: { name: "450k", resources: 450000 },
        primeRunner: { name: "450k", resources: 450000 },
      },
    };
    const priorityTable: PriorityTableType = {
      A: priorityLevel,
      B: priorityLevel,
      C: priorityLevel,
      D: priorityLevel,
      E: priorityLevel,
    };

    return priorityTable;
  }),

  // Mock TRPC mutation: character.createDraftCharacter
  trpcMock.character.createDraftCharacter.mutation(() => {
    return {
      id: 123,
      version: 1,
    };
  }),

  // Mock TRPC mutation: character.updateDraftCharacter
  trpcMock.character.updateDraftCharacter.mutation(() => {
    return {
      conflict: false,
      id: 123,
      version: 2,
    };
  }),

  // Mock TRPC query: character.getDraftCharacter
  trpcMock.character.getDraftCharacter.query(() => {
    return {
      id: 123,
      name: "Draft 1",
      currentStep: "PriorityListSelect",
      characterData: {},
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }),

  // Mock TRPC mutation: character.deleteDraftCharacter
  trpcMock.character.deleteDraftCharacter.mutation(() => {
    return { success: true };
  }),

  // Mock TRPC query: character.heritages
  trpcMock.character.heritages.query(() => {
    return [
      {
        name: "Human",
        category: heritageCategoryEnum.Metahuman,
        pointBuyKarmaCost: 0,
        bodyAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        agilityAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        reactionAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        strengthAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        willpowerAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        logicAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        intuitionAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        charismaAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        edgeAttributeRange: { min: 2, max: 7, augmentedMax: 10 },
        magicAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        resonanceAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        depthAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        essenceAttributeRange: { min: 0, max: 6, augmentedMax: 6 },
        initiativeAttributeRange: { min: 2, max: 12, augmentedMax: 12 },
        source: "Core",
        page: 1,
        description: "Human",
      },
      {
        name: "Elf",
        category: heritageCategoryEnum.Metahuman,
        pointBuyKarmaCost: 0,
        bodyAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        agilityAttributeRange: { min: 2, max: 7, augmentedMax: 10 },
        reactionAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        strengthAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        willpowerAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        logicAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        intuitionAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        charismaAttributeRange: { min: 3, max: 8, augmentedMax: 11 },
        edgeAttributeRange: { min: 1, max: 6, augmentedMax: 9 },
        magicAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        resonanceAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        depthAttributeRange: { min: 0, max: 6, augmentedMax: 9 },
        essenceAttributeRange: { min: 0, max: 6, augmentedMax: 6 },
        initiativeAttributeRange: { min: 2, max: 12, augmentedMax: 12 },
        source: "Core",
        page: 1,
        description: "Elf",
      },
    ];
  }),

  // Mock TRPC query: character.skills
  trpcMock.character.skills.query(() => {
    return [
      {
        name: "Pistols",
        attribute: attributeTypeEnum.Agility,
        description: "Shoot guns",
        category: skillCategoryEnum.Combat,
        source: "Core",
        page: 1,
        default: true,
        isKnowledgeSkill: false,
        exotic: false,
      },
      {
        name: "Sneaking",
        attribute: attributeTypeEnum.Agility,
        description: "Be sneaky",
        category: skillCategoryEnum.Physical,
        source: "Core",
        page: 1,
        default: true,
        isKnowledgeSkill: false,
        exotic: false,
      },
    ];
  }),
];
