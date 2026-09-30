import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import CharacterCreator from "../../components/character/creator/CharacterCreator";
import { renderWithProviders, settle } from "../test-utils.js";
import { act } from "react";
import {
  characterCreatorStepEnum,
  talentCategoryEnum,
  priorityLetterEnum,
} from "@neon-codex/common";

vi.mock("../../hooks/useEquipmentSearch", () => ({
  useEquipmentSearch: vi.fn().mockReturnValue({
    results: [],
    isReady: true,
    isSearching: false,
    search: vi.fn(),
  }),
}));

const SESSION_DRAFT_KEY = "character-draft-session";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultState = {
  bonusInfo: [],
  priorityInfo: {
    heritage: priorityLetterEnum.A,
    attributes: priorityLetterEnum.B,
    talent: priorityLetterEnum.C,
    skills: priorityLetterEnum.D,
    resources: priorityLetterEnum.E,
  },
  attributeInfo: {
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
  },
  talentInfo: {
    category: talentCategoryEnum.Mundane,
  },
  priorityHeritage: {
    heritage: "Human",
    specialAttributePoints: 1,
  },
  priorityAttributes: 0,
  priorityTalent: {
    name: "",
    label: "",
    category: talentCategoryEnum.Mundane,
  },
  prioritySkills: { name: "", skillPoints: 0, skillGroupPoints: 0 },
  priorityResources: 0,
  specialAttributeInfo: {
    edge: 0,
    talent: { category: talentCategoryEnum.Mundane },
  },
  karmaPoints: 0,
  essencePoints: 0,
  positiveQualityListSelected: [],
  negativeQualityListSelected: [],
  skillPoints: {
    activeSkillPoints: 0,
    activeSkillGroupPoints: 0,
    knowledgeSkillPoints: 0,
    languageSkillPoints: 0,
  },
  skillSelections: [],
  skillGroupSelections: [],
  equipmentSelections: [],
  lifestyleSelections: [],
  nuyen: 0,
  currentStep: characterCreatorStepEnum.PriorityListSelect,
};

describe("Character Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves session draft to localStorage on navigation", async () => {
    const { user, queryClient } = renderWithProviders(<CharacterCreator />);
    await settle(queryClient);

    // Find Heritage Select (default Human)
    const humanOption = await screen.findByRole("option", { name: "Human" });
    const selectElement = humanOption.closest("select");
    if (!selectElement) throw new Error("Heritage select not found");

    // Change selection to Elf
    await act(async () => {
      await user.selectOptions(selectElement, "Elf");
    });

    // Click Next to trigger persistent sync (PrioritySelect syncs on unmount)
    const nextButton = await screen.findByRole("button", { name: /next/i });
    await act(async () => {
      await user.click(nextButton);
    });

    // Wait for debounce (500ms) - waiting 1000ms to be safe
    await act(async () => {
      await delay(1000);
    });

    // Check storage
    expect(localStorage.getItem(SESSION_DRAFT_KEY)).not.toBeNull();
    const stored = JSON.parse(localStorage.getItem(SESSION_DRAFT_KEY)!);
    expect(stored.data.priorityHeritage.heritage).toBe("Elf");
    // Verify current Step is updated too
    // The saved state might have the NEW step (AttributeListSelect)
    // or previous step depending on when save fires relative to step update.
    // They are updated sequentially.
    // We mainly care that data is saved.
  });

  it("restores session draft from localStorage", async () => {
    // Setup existing draft in localStorage
    const storedState = {
      ...defaultState,
      priorityHeritage: {
        heritage: "Elf",
        specialAttributePoints: 0,
      },
    };

    const storedData = {
      data: storedState,
      version: 1,
      pendingSync: false,
      draftId: null,
    };

    localStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(storedData));

    const { queryClient } = renderWithProviders(<CharacterCreator />);
    await settle(queryClient);

    // Verify Elf is selected in UI
    const elfOption = await screen.findByRole("option", { name: "Elf" });
    const selectElement = elfOption.closest("select");
    expect(selectElement).toHaveValue("Elf");
  });
});
