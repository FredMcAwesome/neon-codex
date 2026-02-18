import { describe, it, expect } from "vitest";
import { type } from "arktype";
import { CharacterSchema, TalentInfoSchema } from "@neon-codex/common";
import { talentCategoryEnum, priorityLetterEnum } from "@neon-codex/common";

const validate = (schema: any, data: any) => {
  const result = schema(data);
  if (result instanceof type.errors) {
    return { isValid: false, summary: result.summary };
  }
  return { isValid: true, data: result };
};

describe("Character Schema Validation", () => {
  describe("TalentInfoSchema", () => {
    it("should validate Magic talent with formulae selected", () => {
      const data = {
        category: talentCategoryEnum.Magic,
        selectedTradition: {
          name: "Hermetic",
          customSpirits: {
            customSpirits: false,
          },
        },
        selectedFormulae: {
          selectFormulae: true,
          spells: ["Fireball"],
          rituals: [],
          alchemicalPreparations: [],
        },
        selectedAdeptPowers: {
          selectAdeptPowers: false,
        },
      };

      const { isValid, summary } = validate(TalentInfoSchema, data);
      expect(summary).toBeUndefined();
      expect(isValid).toBe(true);
    });

    it("should validate Magic talent with NO formulae selected", () => {
      const data = {
        category: talentCategoryEnum.Magic,
        selectedTradition: {
          name: "Hermetic",
          customSpirits: {
            customSpirits: false,
          },
        },
        selectedFormulae: {
          selectFormulae: false,
        },
        selectedAdeptPowers: {
          selectAdeptPowers: false,
        },
      };

      const { isValid, summary } = validate(TalentInfoSchema, data);
      expect(summary).toBeUndefined();
      expect(isValid).toBe(true);
    });

    it("should REJECT Magic talent with selectFormulae: false but containing alchemicalPreparations", () => {
      const data = {
        category: talentCategoryEnum.Magic,
        selectedTradition: {
          name: "Hermetic",
          customSpirits: {
            customSpirits: false,
          },
        },
        selectedFormulae: {
          selectFormulae: false,
          alchemicalPreparations: [], // This should be rejected
        },
        selectedAdeptPowers: {
          selectAdeptPowers: false,
        },
      };

      const { isValid } = validate(TalentInfoSchema, data);
      expect(isValid).toBe(false);
    });

    it("should validate Mundane talent", () => {
      const data = {
        category: talentCategoryEnum.Mundane,
      };

      const { isValid, summary } = validate(TalentInfoSchema, data);
      expect(summary).toBeUndefined();
      expect(isValid).toBe(true);
    });

    it("should validate Resonance talent", () => {
      const data = {
        category: talentCategoryEnum.Resonance,
        complexForms: ["Resonance Spike"],
      };

      const { isValid, summary } = validate(TalentInfoSchema, data);
      expect(summary).toBeUndefined();
      expect(isValid).toBe(true);
    });

    it("should validate Depth talent", () => {
      const data = {
        category: talentCategoryEnum.Depth,
        programs: [{ name: "Edit" }],
      };

      const { isValid, summary } = validate(TalentInfoSchema, data);
      expect(summary).toBeUndefined();
      expect(isValid).toBe(true);
    });
  });
});
