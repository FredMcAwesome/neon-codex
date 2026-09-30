import { describe, it, expect } from "vitest";
import {
  evaluateItemCompatibility,
  commonRequirementTypeEnum,
  weaponRequirementTypeEnum,
  otherRequirementTypeEnum,
  genericRequirementTypeEnum,
  gearRequirementTypeEnum,
  vehicleRequirementTypeEnum,
  weaponMountRequirementTypeEnum,
  mathComparisonEnum,
  equipmentTypeEnum,
  vehicleCategoryEnum,
  augmentationCategoryEnum,
  cyberwareCategoryEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  weaponMountParentCategory,
  damageTypeEnum,
  damageAnnotationEnum,
  ammoSourceEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  weaponCategoryEnum,
  weaponMountControlEnum,
  attributeTypeEnum,
  type RequirementEvaluationContextType,
  type RequirementParentContextType,
  type NonTopRequirementsType,
  type RequirementOtherSubType,
} from "@neon-codex/common";

describe("requirementEvaluator", () => {
  it("passes when neither requirements nor forbidden exist", () => {
    const res = evaluateItemCompatibility(undefined, undefined, {});
    expect(res.isCompatible).toBe(true);
    expect(res.unmetReasons).toEqual([]);
  });

  describe("weapon parent requirements and forbidden rules", () => {
    // Modelled after "Additional Clip/Magazine":
    // Requirements: ammoType is (c) or (m)
    // Forbidden: weapon subtype is Heavy Pistols or Hold Outs
    const additionalClipReq: NonTopRequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            weapon: {
              type: commonRequirementTypeEnum.OneOf,
              oneOf: [
                {
                  type: commonRequirementTypeEnum.Inner,
                  weapon: {
                    type: weaponRequirementTypeEnum.AmmoType,
                    value: ammoSourceEnum.Clip,
                  },
                },
                {
                  type: commonRequirementTypeEnum.Inner,
                  weapon: {
                    type: weaponRequirementTypeEnum.AmmoType,
                    value: ammoSourceEnum.InternalMagazine,
                  },
                },
              ],
            },
          },
        },
      ],
    };

    const additionalClipForbidden: NonTopRequirementsType = {
      type: commonRequirementTypeEnum.AllOf,
      allOf: [
        {
          type: commonRequirementTypeEnum.Inner,
          parentDetails: {
            type: commonRequirementTypeEnum.Inner,
            weapon: {
              type: commonRequirementTypeEnum.OneOf,
              oneOf: [
                {
                  type: commonRequirementTypeEnum.Inner,
                  weapon: {
                    type: weaponRequirementTypeEnum.Subtype,
                    value: {
                      subtype: firearmWeaponTypeEnum.HeavyPistols,
                      category: weaponCategoryEnum.Firearm,
                    },
                  },
                },
                {
                  type: commonRequirementTypeEnum.Inner,
                  weapon: {
                    type: weaponRequirementTypeEnum.Subtype,
                    value: {
                      subtype: firearmWeaponTypeEnum.HoldOuts,
                      category: weaponCategoryEnum.Firearm,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    };

    it("evaluates Ares Predator V (Heavy Pistol, (c) ammo): fails due to forbidden rule", () => {
      const aresPredatorContext: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "Ares Predator V",
          subtype: firearmWeaponTypeEnum.HeavyPistols,
          weaponCategory: weaponCategoryEnum.Firearm,
          ammoTypes: [ammoSourceEnum.Clip],
          concealability: 0,
        },
      };

      const result = evaluateItemCompatibility(
        additionalClipReq,
        additionalClipForbidden,
        aresPredatorContext
      );

      expect(result.isCompatible).toBe(false);
      expect(result.unmetReasons.length).toBeGreaterThan(0);
      expect(result.unmetReasons[0]).toContain("Incompatible");
    });

    it("evaluates AK-97 (Assault Rifle, (c) ammo): succeeds", () => {
      const ak97Context: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "AK-97",
          subtype: firearmWeaponTypeEnum.AssaultRifles,
          weaponCategory: weaponCategoryEnum.Firearm,
          ammoTypes: [ammoSourceEnum.Clip],
          concealability: -2,
        },
      };

      const result = evaluateItemCompatibility(
        additionalClipReq,
        additionalClipForbidden,
        ak97Context
      );

      expect(result.isCompatible).toBe(true);
      expect(result.unmetReasons).toEqual([]);
    });

    it("evaluates Ares Desert Strike (Sniper Rifle, (d) drum ammo): fails due to missing ammoType", () => {
      const sniperContext: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "Ares Desert Strike",
          subtype: firearmWeaponTypeEnum.SniperRifles,
          weaponCategory: weaponCategoryEnum.Firearm,
          ammoTypes: [ammoSourceEnum.Drum],
          concealability: -4,
        },
      };

      const result = evaluateItemCompatibility(
        additionalClipReq,
        additionalClipForbidden,
        sniperContext
      );

      expect(result.isCompatible).toBe(false);
      expect(result.unmetReasons.length).toBeGreaterThan(0);
      expect(result.unmetReasons[0]).toContain(
        "Requires weapon with ammunition type: (c)"
      );
    });
  });

  describe("character context requirements", () => {
    it("evaluates metatype requirement", () => {
      const trollReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.OneOf,
        oneOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.Metatype,
              value: "Troll",
            },
          },
        ],
      };

      const trollChar: RequirementEvaluationContextType = {
        character: {
          metatype: "Troll",
        },
      };
      const humanChar: RequirementEvaluationContextType = {
        character: {
          metatype: "Human",
        },
      };

      expect(
        evaluateItemCompatibility(trollReq, undefined, trollChar).isCompatible
      ).toBe(true);
      const humanRes = evaluateItemCompatibility(
        trollReq,
        undefined,
        humanChar
      );
      expect(humanRes.isCompatible).toBe(false);
      expect(humanRes.unmetReasons[0]).toBe("Requires metatype: Troll");
    });

    it("evaluates quality requirement", () => {
      const mentorSpiritReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.OneOf,
        oneOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.Quality,
              value: { quality: "Mentor Spirit" },
            },
          },
        ],
      };

      const charWithQuality: RequirementEvaluationContextType = {
        character: {
          positiveQualities: ["Mentor Spirit", "Quick Healer"],
        },
      };
      const charWithout: RequirementEvaluationContextType = {
        character: {
          positiveQualities: ["Ambidextrous"],
        },
      };

      expect(
        evaluateItemCompatibility(mentorSpiritReq, undefined, charWithQuality)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(mentorSpiritReq, undefined, charWithout)
          .isCompatible
      ).toBe(false);
    });

    it("evaluates installed accessory conflict in forbidden", () => {
      const conflictForbidden: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.Accessory,
              value: "Smartgun System, Internal",
            },
          },
        ],
      };

      const weaponWithSmartgun: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "Ares Predator V",
          installedAccessories: ["Smartgun System, Internal"],
        },
      };

      const weaponWithout: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "Ares Predator V",
          installedAccessories: ["Silencer"],
        },
      };

      expect(
        evaluateItemCompatibility(
          undefined,
          conflictForbidden,
          weaponWithSmartgun
        ).isCompatible
      ).toBe(false);
      expect(
        evaluateItemCompatibility(undefined, conflictForbidden, weaponWithout)
          .isCompatible
      ).toBe(true);
    });
  });

  describe("generic and concealability requirements", () => {
    it("evaluates conceal comparison", () => {
      const concealReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.Conceal,
                value: { value: 0, comparison: mathComparisonEnum.LessThan },
              },
            },
          },
        ],
      };

      const compactWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          concealability: 2,
        },
      };
      const largeWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          concealability: -2,
        },
      };

      // concealability < 0: largeWeapon (-2 < 0) passes, compact (2 < 0) fails
      expect(
        evaluateItemCompatibility(concealReq, undefined, largeWeapon)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(concealReq, undefined, compactWeapon)
          .isCompatible
      ).toBe(false);
    });

    it("evaluates noParent requirement", () => {
      const noParentReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.NoParent,
                value: true,
              },
            },
          },
        ],
      };

      const rootContext: RequirementEvaluationContextType = {
        isRoot: true,
      };
      const childContext: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          name: "AK-97",
        },
      };

      expect(
        evaluateItemCompatibility(noParentReq, undefined, rootContext)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(noParentReq, undefined, childContext)
          .isCompatible
      ).toBe(false);
    });
  });

  describe("weapon damage, mode, and ammoCategory", () => {
    it("evaluates fire mode requirement", () => {
      const modeReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.Mode,
                value: firearmModeEnum.SemiAutomatic,
              },
            },
          },
        ],
      };
      const saWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          modes: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
        },
      };
      const bfOnly: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          modes: [firearmModeEnum.BurstFire, firearmModeEnum.FullAutomatic],
        },
      };
      expect(
        evaluateItemCompatibility(modeReq, undefined, saWeapon).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(modeReq, undefined, bfOnly).isCompatible
      ).toBe(false);
    });

    it("evaluates damage type requirement", () => {
      const damageReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.Damage,
                value: {
                  type: damageTypeEnum.Stun,
                  annotation: damageAnnotationEnum.Electrical,
                },
              },
            },
          },
        ],
      };
      const stunWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          damage: [
            {
              damageAmount: [5],
              type: damageTypeEnum.Stun,
              annotation: damageAnnotationEnum.Electrical,
            },
          ],
        },
      };
      const physicalWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          damage: [{ damageAmount: [6], type: damageTypeEnum.Physical }],
        },
      };
      expect(
        evaluateItemCompatibility(damageReq, undefined, stunWeapon).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(damageReq, undefined, physicalWeapon)
          .isCompatible
      ).toBe(false);
    });

    it("evaluates ammoCategory via ammoWeaponClassification", () => {
      const ammoCatReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.AmmoCategory,
                value: {
                  subtype: firearmWeaponTypeEnum.GrenadeLaunchers,
                  category: weaponCategoryEnum.Firearm,
                },
              },
            },
          },
        ],
      };
      const grenadeLauncher: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          ammoWeaponClassification: {
            subtype: firearmWeaponTypeEnum.GrenadeLaunchers,
            category: weaponCategoryEnum.Firearm,
          },
        },
      };
      const rifle: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Weapon,
          ammoWeaponClassification: {
            subtype: firearmWeaponTypeEnum.AssaultRifles,
            category: weaponCategoryEnum.Firearm,
          },
        },
      };
      expect(
        evaluateItemCompatibility(ammoCatReq, undefined, grenadeLauncher)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(ammoCatReq, undefined, rifle).isCompatible
      ).toBe(false);
    });

    it("fails closed on unrecognized math comparison in conceal", () => {
      /* eslint-disable no-excess-properties/no-excess-properties -- intentionally invalid fixture for fail-closed path */
      const badConcealReq = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.Conceal,
                value: { value: 0, comparison: "???" },
              },
            },
          },
        ],
      } as unknown as NonTopRequirementsType;
      /* eslint-enable no-excess-properties/no-excess-properties */
      const ctx: RequirementEvaluationContextType = {
        parent: { category: equipmentTypeEnum.Weapon, concealability: 0 },
      };
      expect(
        evaluateItemCompatibility(badConcealReq, undefined, ctx).isCompatible
      ).toBe(false);
    });
  });

  describe("gear matrix attributes and weapon mounts", () => {
    it("evaluates attack noAttribute / nonZeroAttribute", () => {
      const noAttackReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              gear: {
                type: gearRequirementTypeEnum.Attack,
                value: { noAttribute: true },
              },
            },
          },
        ],
      };
      const bareDevice: RequirementEvaluationContextType = {
        parent: { category: equipmentTypeEnum.Gear },
      };
      const withAttack: RequirementEvaluationContextType = {
        parent: { category: equipmentTypeEnum.Gear, attack: 5 },
      };
      expect(
        evaluateItemCompatibility(noAttackReq, undefined, bareDevice)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(noAttackReq, undefined, withAttack)
          .isCompatible
      ).toBe(false);
    });

    it("evaluates attributeArray exists flag", () => {
      const noArrayReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              gear: {
                type: gearRequirementTypeEnum.AttributeArray,
                exists: false,
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(noArrayReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Gear,
            hasAttributeArray: false,
          },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(noArrayReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Gear,
            hasAttributeArray: true,
          },
        }).isCompatible
      ).toBe(false);
    });

    it("evaluates isCyberdeck against gear parents", () => {
      const deckReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              gear: {
                type: gearRequirementTypeEnum.IsCyberdeck,
                value: true,
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(deckReq, undefined, {
          parent: { category: equipmentTypeEnum.Gear, isCyberdeck: true },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(deckReq, undefined, {
          parent: { category: equipmentTypeEnum.Gear, isCyberdeck: false },
        }).isCompatible
      ).toBe(false);
    });

    it("evaluates weapon mount control requirement", () => {
      const controlReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weaponMount: {
                type: weaponMountRequirementTypeEnum.Control,
                value: weaponMountControlEnum.Remote,
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(controlReq, undefined, {
          parent: {
            category: weaponMountParentCategory,
            control: weaponMountControlEnum.Remote,
          },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(controlReq, undefined, {
          parent: {
            category: weaponMountParentCategory,
            control: weaponMountControlEnum.Manual,
          },
        }).isCompatible
      ).toBe(false);
    });

    it("evaluates vehicle body requirement", () => {
      const bodyReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              vehicle: {
                type: vehicleRequirementTypeEnum.Body,
                value: {
                  value: 10,
                  comparison: mathComparisonEnum.GreaterThanOrEqual,
                },
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(bodyReq, undefined, {
          parent: { category: equipmentTypeEnum.Vehicle, body: 12 },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(bodyReq, undefined, {
          parent: { category: equipmentTypeEnum.Vehicle, body: 6 },
        }).isCompatible
      ).toBe(false);
    });
  });

  describe("extended character requirements", () => {
    it("respects magicEnabled boolean value", () => {
      const magicReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.MagicEnabled,
              value: true,
            },
          },
        ],
      };
      const mundaneReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.MagicEnabled,
              value: false,
            },
          },
        ],
      };
      const awakened = { character: { magicEnabled: true } };
      const mundane = { character: { magicEnabled: false } };
      expect(
        evaluateItemCompatibility(magicReq, undefined, awakened).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(magicReq, undefined, mundane).isCompatible
      ).toBe(false);
      expect(
        evaluateItemCompatibility(mundaneReq, undefined, mundane).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(mundaneReq, undefined, awakened).isCompatible
      ).toBe(false);
    });

    it("evaluates martial art, attribute, program, lifestyle, tradition, spells", () => {
      const ctx: RequirementEvaluationContextType = {
        character: {
          installedMartialArts: ["Karate"],
          attributes: { body: 5 },
          programs: ["Stealth"],
          lifestyles: ["Low"],
          tradition: "Hermetic",
          spells: ["Fireball"],
          adeptPowers: ["Killing Hands"],
        },
      };
      const cases: Array<[RequirementOtherSubType, boolean]> = [
        [{ type: otherRequirementTypeEnum.MartialArt, value: "Karate" }, true],
        [{ type: otherRequirementTypeEnum.MartialArt, value: "Judo" }, false],
        [
          {
            type: otherRequirementTypeEnum.Attribute,
            value: { name: attributeTypeEnum.Body, minimumRating: 4 },
          },
          true,
        ],
        [
          {
            type: otherRequirementTypeEnum.Attribute,
            value: { name: attributeTypeEnum.Body, minimumRating: 6 },
          },
          false,
        ],
        [{ type: otherRequirementTypeEnum.Program, value: "Stealth" }, true],
        [{ type: otherRequirementTypeEnum.Lifestyle, value: "Low" }, true],
        [{ type: otherRequirementTypeEnum.Tradition, value: "Hermetic" }, true],
        [{ type: otherRequirementTypeEnum.Spell, value: "Fireball" }, true],
        [{ type: otherRequirementTypeEnum.Spell, value: "Heal" }, false],
        [
          { type: otherRequirementTypeEnum.AdeptPower, value: "Killing Hands" },
          true,
        ],
      ];
      for (const [otherDetails, expected] of cases) {
        const req: NonTopRequirementsType = {
          type: commonRequirementTypeEnum.AllOf,
          allOf: [{ type: commonRequirementTypeEnum.Inner, otherDetails }],
        };
        expect(
          evaluateItemCompatibility(req, undefined, ctx).isCompatible
        ).toBe(expected);
      }
    });

    it("enforces strict less-than special modification limit", () => {
      const limitReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.SpecialModificationLimit,
              value: 1,
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(limitReq, undefined, {
          parent: { category: equipmentTypeEnum.Armour, installedMods: [] },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(limitReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Armour,
            installedMods: ["Mod A"],
          },
        }).isCompatible
      ).toBe(false);
    });

    it("counts special modifications on weapon parents", () => {
      const limitReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.OneOf,
        oneOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.SpecialModificationLimit,
              value: 2,
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(limitReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Weapon,
            name: "AK-97",
            specialModificationCount: 1,
          },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(limitReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Weapon,
            name: "AK-97",
            specialModificationCount: 2,
          },
        }).isCompatible
      ).toBe(false);
    });

    it("derives essence loss from current essence instead of storing it", () => {
      const lossReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.EssenceLoss,
              value: { loss: 2, lossFromAugmentationGradeList: [] },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(lossReq, undefined, {
          character: { essence: 6 },
        }).isCompatible
      ).toBe(false);
      expect(
        evaluateItemCompatibility(lossReq, undefined, {
          character: { essence: 3.5 },
        }).isCompatible
      ).toBe(true);
    });

    it("matches attributes case-insensitively", () => {
      const bodyReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.Attribute,
              value: { name: attributeTypeEnum.Body, minimumRating: 4 },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(bodyReq, undefined, {
          character: { attributes: { body: 5 } },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(bodyReq, undefined, {
          character: { attributes: { body: 3 } },
        }).isCompatible
      ).toBe(false);
    });

    it("matches skills case-insensitively", () => {
      const skillReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: otherRequirementTypeEnum.Skill,
              value: { name: "Automatics", value: 4 },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(skillReq, undefined, {
          character: { skills: { automatics: 5 } },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(skillReq, undefined, {
          character: { skills: { AUTOMATICS: 3 } },
        }).isCompatible
      ).toBe(false);
    });

    it("fails closed on unsupported requirement types", () => {
      // Valid enum in the wrong domain (weapon type inside otherDetails)
      // is schema-invalid, so it is cast to test the runtime fail-closed path.
      /* eslint-disable no-excess-properties/no-excess-properties -- intentionally invalid fixture for fail-closed path */
      const badReq = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            otherDetails: {
              type: weaponRequirementTypeEnum.AmmoType,
              value: "(c)",
            },
          },
        ],
      } as unknown as NonTopRequirementsType;
      /* eslint-enable no-excess-properties/no-excess-properties */
      const res = evaluateItemCompatibility(badReq, undefined, {});
      expect(res.isCompatible).toBe(false);
      expect(res.unmetReasons[0]).toContain("Unsupported");
    });

    it("ignores empty forbidden blocks", () => {
      const emptyForbidden: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [],
      };
      const res = evaluateItemCompatibility(undefined, emptyForbidden, {});
      expect(res.isCompatible).toBe(true);
      expect(res.unmetReasons).toEqual([]);
    });
  });

  describe("discriminated parent contexts", () => {
    it("matches two-level vehicle equipment requirements via vehicleCategory", () => {
      // Modelled after drone weapon-mount add-ons requiring a Drone parent.
      const droneReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.Equipment,
                value: {
                  equipmentType: equipmentTypeEnum.Vehicle,
                  category: vehicleCategoryEnum.Drone,
                  subtype: droneSubtypeEnum.Drones_Micro,
                },
              },
            },
          },
        ],
      };
      const microDrone: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Vehicle,
          name: "Micro Drone",
          subtype: droneSubtypeEnum.Drones_Micro,
          vehicleCategory: vehicleCategoryEnum.Drone,
          body: 2,
        },
      };
      const miniDrone: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Vehicle,
          name: "Mini Drone",
          subtype: droneSubtypeEnum.Drones_Mini,
          vehicleCategory: vehicleCategoryEnum.Drone,
          body: 4,
        },
      };
      expect(
        evaluateItemCompatibility(droneReq, undefined, microDrone).isCompatible
      ).toBe(true);
      // Same general category but wrong specific subtype.
      expect(
        evaluateItemCompatibility(droneReq, undefined, miniDrone).isCompatible
      ).toBe(false);
    });

    it("matches two-level augmentation equipment requirements", () => {
      // Modelled after implant-weapon mods requiring a Cyber Implant Weapon.
      const implantReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.Equipment,
                value: {
                  equipmentType: equipmentTypeEnum.Augmentation,
                  category: augmentationCategoryEnum.Cyberware,
                  subtype: cyberwareCategoryEnum.CyberImplantWeapon,
                },
              },
            },
          },
        ],
      };
      const implantWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Augmentation,
          name: "Cyber Implant Weapon",
          subtype: cyberwareCategoryEnum.CyberImplantWeapon,
          augmentationCategory: augmentationCategoryEnum.Cyberware,
        },
      };
      const headware: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.Augmentation,
          name: "Headware",
          subtype: cyberwareCategoryEnum.Headware,
          augmentationCategory: augmentationCategoryEnum.Cyberware,
        },
      };
      expect(
        evaluateItemCompatibility(implantReq, undefined, implantWeapon)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(implantReq, undefined, headware).isCompatible
      ).toBe(false);
    });

    it("fails domain leaves against a foreign parent category", () => {
      const ammoReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.AmmoType,
                value: ammoSourceEnum.Clip,
              },
            },
          },
        ],
      };
      const gearParent: RequirementEvaluationContextType = {
        parent: { category: equipmentTypeEnum.Gear, name: "Commlink" },
      };
      const res = evaluateItemCompatibility(ammoReq, undefined, gearParent);
      expect(res.isCompatible).toBe(false);
      expect(res.unmetReasons[0]).toContain("Requires weapon parent");
    });

    it("fails mount leaves against a non-mount parent category", () => {
      const controlReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weaponMount: {
                type: weaponMountRequirementTypeEnum.Control,
                value: weaponMountControlEnum.Remote,
              },
            },
          },
        ],
      };
      const res = evaluateItemCompatibility(controlReq, undefined, {
        parent: { category: equipmentTypeEnum.Weapon, name: "AK-97" },
      });
      expect(res.isCompatible).toBe(false);
      expect(res.unmetReasons[0]).toContain("Requires weapon mount parent");
    });

    it("evaluates generic name requirements against accessory parents", () => {
      const nameReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.Name,
                value: { name: "Laser Sight" },
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(nameReq, undefined, {
          parent: {
            category: equipmentTypeEnum.WeaponAccessory,
            name: "Laser Sight",
          },
        }).isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(nameReq, undefined, {
          parent: {
            category: equipmentTypeEnum.WeaponAccessory,
            name: "Silencer",
          },
        }).isCompatible
      ).toBe(false);
    });

    it("exposes a mount's host vehicle to vehicle requirements", () => {
      // Modelled after drone weapon-mount add-ons browsed under
      // [Vehicle, WeaponMount]: the direct parent is the mount.
      const droneReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.Equipment,
                value: {
                  equipmentType: equipmentTypeEnum.Vehicle,
                  category: vehicleCategoryEnum.Drone,
                  subtype: droneSubtypeEnum.Drones_Micro,
                },
              },
            },
          },
        ],
      };
      const mountOnMicroDrone: RequirementEvaluationContextType = {
        parent: {
          category: weaponMountParentCategory,
          name: "Standard Mount",
          control: weaponMountControlEnum.Remote,
        },
        grandparent: {
          category: equipmentTypeEnum.Vehicle,
          name: "Micro Drone",
          subtype: droneSubtypeEnum.Drones_Micro,
          vehicleCategory: vehicleCategoryEnum.Drone,
          body: 2,
        },
      };
      const mountOnGroundcraft: RequirementEvaluationContextType = {
        parent: {
          category: weaponMountParentCategory,
          name: "Standard Mount",
          control: weaponMountControlEnum.Remote,
        },
        grandparent: {
          category: equipmentTypeEnum.Vehicle,
          name: "Sedan",
          subtype: groundcraftSubtypeEnum.Car,
          vehicleCategory: vehicleCategoryEnum.Groundcraft,
          body: 12,
        },
      };
      expect(
        evaluateItemCompatibility(droneReq, undefined, mountOnMicroDrone)
          .isCompatible
      ).toBe(true);
      expect(
        evaluateItemCompatibility(droneReq, undefined, mountOnGroundcraft)
          .isCompatible
      ).toBe(false);
    });

    it("evaluates weapon leaves against a grandparent weapon", () => {
      // Modelled after gear installed in a weapon accessory (path
      // [Weapon, WeaponAccessory]) requiring host-weapon properties.
      const clipReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.AmmoType,
                value: ammoSourceEnum.Clip,
              },
            },
          },
        ],
      };
      const gearInClipWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.WeaponAccessory,
          name: "Laser Sight",
        },
        grandparent: {
          category: equipmentTypeEnum.Weapon,
          name: "AK-97",
          ammoTypes: [ammoSourceEnum.Clip],
        },
      };
      const gearInDrumWeapon: RequirementEvaluationContextType = {
        parent: {
          category: equipmentTypeEnum.WeaponAccessory,
          name: "Laser Sight",
        },
        grandparent: {
          category: equipmentTypeEnum.Weapon,
          name: "Desert Strike",
          ammoTypes: [ammoSourceEnum.Drum],
        },
      };
      expect(
        evaluateItemCompatibility(clipReq, undefined, gearInClipWeapon)
          .isCompatible
      ).toBe(true);
      const drumRes = evaluateItemCompatibility(
        clipReq,
        undefined,
        gearInDrumWeapon
      );
      expect(drumRes.isCompatible).toBe(false);
      // The grandparent was consulted (field-level reason), not rejected
      // as a foreign parent.
      expect(drumRes.unmetReasons[0]).toContain("ammunition type");
    });

    it("prefers the direct parent and keeps names direct-only", () => {
      const clipReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              weapon: {
                type: weaponRequirementTypeEnum.AmmoType,
                value: ammoSourceEnum.Clip,
              },
            },
          },
        ],
      };
      // Direct weapon parent wins even when the grandparent differs.
      expect(
        evaluateItemCompatibility(clipReq, undefined, {
          parent: {
            category: equipmentTypeEnum.Weapon,
            name: "AK-97",
            ammoTypes: [ammoSourceEnum.Clip],
          },
          grandparent: {
            category: equipmentTypeEnum.Vehicle,
            name: "Sedan",
          },
        }).isCompatible
      ).toBe(true);
      // Name requirements never consult the grandparent.
      const nameReq: NonTopRequirementsType = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: [
          {
            type: commonRequirementTypeEnum.Inner,
            parentDetails: {
              type: commonRequirementTypeEnum.Inner,
              generic: {
                type: genericRequirementTypeEnum.Name,
                value: { name: "AK-97" },
              },
            },
          },
        ],
      };
      expect(
        evaluateItemCompatibility(nameReq, undefined, {
          parent: {
            category: equipmentTypeEnum.WeaponAccessory,
            name: "Laser Sight",
          },
          grandparent: {
            category: equipmentTypeEnum.Weapon,
            name: "AK-97",
          },
        }).isCompatible
      ).toBe(false);
    });

    it("rejects drifted category/subtype pairs at type level", () => {
      // Firearm category with a melee subtype must not typecheck. If this
      // ever compiles, the correlation has regressed (the unused
      // expect-error directive below itself becomes the compile error).
      // @ts-expect-error - drifted pair: Firearm category, Blades subtype
      const drifted: RequirementParentContextType = {
        category: equipmentTypeEnum.Weapon,
        weaponCategory: weaponCategoryEnum.Firearm,
        subtype: meleeWeaponTypeEnum.Blades,
      };
      expect(drifted).toBeDefined();
    });
  });
});
