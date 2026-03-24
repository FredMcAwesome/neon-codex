import type { EntityManager } from "@mikro-orm/postgresql";
import assert from "assert";
import { ref } from "@mikro-orm/postgresql";
import type { BonusType } from "@neon-codex/common";
import { Skills } from "../models/rpg/abilities/skillModel.js";
import { SkillGroups } from "../models/rpg/abilities/skillGroupModel.js";
import { Qualities } from "../models/rpg/traits/qualityModel.js";
import { AdeptPowers } from "../models/rpg/abilities/adeptPowerModel.js";
import { CritterPowers } from "../models/rpg/abilities/critterPowerModel.js";
import { Spells } from "../models/rpg/abilities/spellModel.js";
import { Metamagics } from "../models/rpg/otherData/metamagicModel.js";
import { Echoes } from "../models/rpg/otherData/echoModel.js";
import { Weapons } from "../models/rpg/equipment/combat/weaponModel.js";
import { MartialArts } from "../models/rpg/abilities/martialArtModel.js";
import { Lifestyles } from "../models/rpg/otherData/lifestyleModel.js";
import { Gears } from "../models/rpg/equipment/other/gearModel.js";
import { Augmentations } from "../models/rpg/equipment/bodyModification/augmentationModel.js";
import { ComplexForms } from "../models/rpg/abilities/complexFormModel.js";
import { type Bonuses } from "../models/rpg/otherData/bonusModel.js";
import {
  BonusSkillModifiers,
  BonusSkillGroupModifiers,
  BonusSkillCategoryModifiers,
  BonusAddedQualities,
  BonusReducedQualities,
  BonusAddedCritterPowers,
  BonusSpecificAdeptPowers,
  BonusMetamagicRestrictions,
  BonusSpecificSpellDice,
  BonusFadingModifications,
  BonusLifestyleCostModifiers,
  BonusAddedGearIncludes,
  BonusSkillSpecialisation,
  BonusWeaponLimitModifiers,
  BonusWeaponSkillAccuracyModifiersSkillModifier,
  BonusWeaponSkillAccuracyModifiersSelectSkill,
  BonusSelectSkills,
  BonusWeaponAccuracySkillListConnected,
  BonusOptionalCritterPowers,
  BonusSkillAttributeModifiers,
} from "../models/rpg/otherData/bonusJoinModel.js";
import {
  talentSkillUnlockCategoryEnum,
  type SelectSkillType,
} from "@neon-codex/common";

export const linkBonusEntity = async (
  em: EntityManager,
  bonusDto: BonusType,
  bonusEntity: Bonuses,
  parentName: string
) => {
  // --- Skill Category ---
  if (bonusDto.skill) {
    if (bonusDto.skill.skillIncreaseList) {
      for (const skillIncrease of bonusDto.skill.skillIncreaseList) {
        const loadedSkill = await em.findOne(Skills, {
          name: skillIncrease.name,
        });
        assert(
          loadedSkill !== null,
          `Skill not found: ${skillIncrease.name} in ${parentName}`
        );

        const modifier = new BonusSkillModifiers();
        modifier.bonus = ref(bonusEntity);
        modifier.skill = ref(loadedSkill);
        if (skillIncrease.bonus !== undefined)
          modifier.skillBonus = skillIncrease.bonus;
        if (skillIncrease.precedence !== undefined)
          modifier.precedence = skillIncrease.precedence;
        if (skillIncrease.condition !== undefined)
          modifier.condition = skillIncrease.condition;
        if (skillIncrease.modifierType !== undefined)
          modifier.modifierType = skillIncrease.modifierType;
        bonusEntity.skillIncreaseList.add(modifier);
      }
    }
    if (bonusDto.skill.skillIncreaseForAttributeList) {
      for (const skillIncrease of bonusDto.skill
        .skillIncreaseForAttributeList) {
        const modifier = new BonusSkillAttributeModifiers();
        modifier.attribute = skillIncrease.name;
        modifier.bonus = ref(bonusEntity);
        if (skillIncrease.bonus !== undefined)
          modifier.skillBonus = skillIncrease.bonus;
        if (skillIncrease.precedence !== undefined)
          modifier.precedence = skillIncrease.precedence;
        if (skillIncrease.condition !== undefined)
          modifier.condition = skillIncrease.condition;
        if (skillIncrease.modifierType !== undefined)
          modifier.modifierType = skillIncrease.modifierType;
        bonusEntity.skillIncreaseForAttributeList.add(modifier);
      }
    }
    if (bonusDto.skill.skillGroupList) {
      for (const skillGroup of bonusDto.skill.skillGroupList) {
        const loadedGroup = await em.findOne(SkillGroups, {
          name: skillGroup.name,
        });
        assert(
          loadedGroup !== null,
          `SkillGroup not found: ${skillGroup.name} in ${parentName}`
        );
        const modifier = new BonusSkillGroupModifiers();
        modifier.bonus = ref(bonusEntity);
        modifier.skillGroup = ref(loadedGroup);
        if (skillGroup.bonus !== undefined)
          modifier.skillBonus = skillGroup.bonus;
        if (skillGroup.precedence !== undefined)
          modifier.precedence = skillGroup.precedence;
        if (skillGroup.condition !== undefined)
          modifier.condition = skillGroup.condition;
        if (skillGroup.modifierType !== undefined)
          modifier.modifierType = skillGroup.modifierType;
        bonusEntity.skillGroupList.add(modifier);
      }
    }
    if (bonusDto.skill.skillCategoryList) {
      for (const skillCategory of bonusDto.skill.skillCategoryList) {
        const modifier = new BonusSkillCategoryModifiers();
        modifier.bonus = ref(bonusEntity);
        modifier.category = skillCategory.name;
        if (skillCategory.bonus !== undefined)
          modifier.skillBonus = skillCategory.bonus;
        if (skillCategory.precedence !== undefined)
          modifier.precedence = skillCategory.precedence;
        if (skillCategory.condition !== undefined)
          modifier.condition = skillCategory.condition;
        if (skillCategory.modifierType !== undefined)
          modifier.modifierType = skillCategory.modifierType;
        if (skillCategory.excludeSkill !== undefined) {
          const excludeSkill = await em.findOne(Skills, {
            name: skillCategory.excludeSkill,
          });
          assert(
            excludeSkill !== null,
            `Exclude skill not found: ${skillCategory.excludeSkill} in ${parentName}`
          );
          modifier.excludeSkill = ref(excludeSkill);
        }
        bonusEntity.skillCategoryList.add(modifier);
      }
    }
    if (bonusDto.skill.unlockSkillList) {
      for (const groupName of bonusDto.skill.unlockSkillList) {
        // Technically these can be skills or groups or pseudo-groups depending on data
        const loadedSkill = await em.findOne(Skills, { name: groupName });
        if (loadedSkill !== null) {
          bonusEntity.unlockSkillList.add(ref(loadedSkill));
        } else {
          const listedGroupName = groupName.split(",");
          bonusEntity.unlockTalentSkillCategoryList = listedGroupName.map(
            (tempGroupName) => {
              assert(
                Object.values(talentSkillUnlockCategoryEnum).includes(
                  tempGroupName as talentSkillUnlockCategoryEnum
                ),
                `Unlock skill not found: ${tempGroupName} in ${parentName}`
              );

              return tempGroupName as talentSkillUnlockCategoryEnum;
            }
          );
        }
      }
    }
    if (bonusDto.skill.addSkillSpecialisation?.skillList) {
      const join = new BonusSkillSpecialisation();
      join.bonus = ref(bonusEntity);
      join.specialisation = bonusDto.skill.addSkillSpecialisation.spec;
      for (const skillName of bonusDto.skill.addSkillSpecialisation.skillList) {
        const skill = await em.findOne(Skills, { name: skillName });
        assert(
          skill !== null,
          `Skill not found: ${skillName} in ${parentName}`
        );
        join.skillList.add(skill);
      }
      em.persist(join);
    }
    if (bonusDto.skill.swapSkillAttribute) {
      const loadedSkill = await em.findOne(Skills, {
        name: bonusDto.skill.swapSkillAttribute.skill,
      });
      assert(
        loadedSkill !== null,
        `Skill not found: ${bonusDto.skill.swapSkillAttribute.skill} in ${parentName}`
      );
      bonusEntity.swapSkillAttributeSkill = ref(loadedSkill);
      bonusEntity.swapSkillAttributeConfig = {
        newAttribute: bonusDto.skill.swapSkillAttribute.newAttribute,
      };
    }
    if (bonusDto.skill.swapSkillSpecialisationAttribute) {
      const loadedSkill = await em.findOne(Skills, {
        name: bonusDto.skill.swapSkillSpecialisationAttribute.skill,
      });
      assert(
        loadedSkill !== null,
        `Skill not found: ${bonusDto.skill.swapSkillSpecialisationAttribute.skill} in ${parentName}`
      );
      bonusEntity.swapSkillSpecialisationAttributeSkill = ref(loadedSkill);
      bonusEntity.swapSkillSpecialisationAttributeConfig = {
        newAttribute:
          bonusDto.skill.swapSkillSpecialisationAttribute.newAttribute,
        specialisation:
          bonusDto.skill.swapSkillSpecialisationAttribute.specialisation,
      };
    }
    if (bonusDto.skill.blockSkillGroupAndDefaulting != null) {
      const loadedGroup = await em.findOne(SkillGroups, {
        name: bonusDto.skill.blockSkillGroupAndDefaulting,
      });
      assert(
        loadedGroup !== null,
        `SkillGroup not found: ${bonusDto.skill.blockSkillGroupAndDefaulting} in ${parentName}`
      );
      bonusEntity.blockSkillGroupAndDefaultingGroup = ref(loadedGroup);
    }
    if (bonusDto.skill.selectSkill?.skill.restriction) {
      if ("skillList" in bonusDto.skill.selectSkill.skill.restriction) {
        for (const skillName of bonusDto.skill.selectSkill.skill.restriction
          .skillList.skillList) {
          const loadedSkill = await em.findOne(Skills, { name: skillName });
          assert(
            loadedSkill !== null,
            `Skill not found: ${skillName} in ${parentName}`
          );
          bonusEntity.selectSkillRestrictionSkillList.add(ref(loadedSkill));
        }
      }
      if ("skillGroupList" in bonusDto.skill.selectSkill.skill.restriction) {
        for (const groupName of bonusDto.skill.selectSkill.skill.restriction
          .skillGroupList.skillGroupList) {
          const loadedGroup = await em.findOne(SkillGroups, {
            name: groupName,
          });
          assert(
            loadedGroup !== null,
            `SkillGroup not found: ${groupName} in ${parentName}`
          );
          bonusEntity.selectSkillRestrictionSkillGroupList.add(
            ref(loadedGroup)
          );
        }
      }
    }

    if (bonusDto.skill.selectExpertise?.availableSkillList) {
      for (const skillName of bonusDto.skill.selectExpertise
        .availableSkillList) {
        const loadedSkill = await em.findOne(Skills, { name: skillName });
        assert(
          loadedSkill !== null,
          `Skill not found: ${skillName} in ${parentName}`
        );
        bonusEntity.selectExpertiseFromSkillList.add(ref(loadedSkill));
      }
    }
    if (bonusDto.skill.skillDisableList) {
      if (bonusDto.skill.skillDisableList.skillList) {
        for (const skillName of bonusDto.skill.skillDisableList.skillList) {
          const loadedSkill = await em.findOne(Skills, { name: skillName });
          assert(
            loadedSkill !== null,
            `Skill not found: ${skillName} in ${parentName}`
          );
          bonusEntity.skillDisableSkillList.add(ref(loadedSkill));
        }
      }
      if (bonusDto.skill.skillDisableList.skillGroupList) {
        for (const groupName of bonusDto.skill.skillDisableList
          .skillGroupList) {
          const loadedGroup = await em.findOne(SkillGroups, {
            name: groupName,
          });
          assert(
            loadedGroup !== null,
            `SkillGroup not found: ${groupName} in ${parentName}`
          );
          bonusEntity.skillDisableSkillGroupList.add(ref(loadedGroup));
        }
      }
    }
  }

  // --- Power Category ---
  if (bonusDto.power) {
    if (bonusDto.power.selectPower?.limitedPowerList) {
      for (const powerName of bonusDto.power.selectPower.limitedPowerList) {
        const loadedPower = await em.findOne(AdeptPowers, { name: powerName });
        assert(
          loadedPower !== null,
          `limitedPowerList AdeptPower not found: ${powerName} in ${parentName}`
        );
        bonusEntity.selectPowerLimitedPowerList.add(ref(loadedPower));
      }
    }
    if (bonusDto.power.specificPowerList) {
      for (const specificPower of bonusDto.power.specificPowerList) {
        const loadedPower = await em.findOne(AdeptPowers, {
          name: specificPower.name,
        });
        assert(
          loadedPower !== null,
          `specificPowerList AdeptPower not found: ${specificPower.name} in ${parentName}`
        );
        const join = new BonusSpecificAdeptPowers();
        join.bonus = ref(bonusEntity);
        join.adeptPower = ref(loadedPower);
        const bonusOverride = specificPower.bonusOverride;
        if (bonusOverride !== undefined) {
          join.powerBonus = bonusOverride.value;
          if (bonusOverride.select !== undefined) {
            if ("skill" in bonusOverride.select) {
              join.selectSkill = bonusOverride.select.skill;
              if (bonusOverride.select.skill.restriction !== undefined) {
                if (
                  "skillList" in bonusOverride.select.skill.restriction &&
                  bonusOverride.select.skill.restriction.skillList !== undefined
                ) {
                  for (const skillName of bonusOverride.select.skill.restriction
                    .skillList.skillList) {
                    const loadedSkill = await em.findOne(Skills, {
                      name: skillName,
                    });
                    assert(
                      loadedSkill !== null,
                      `Skill not found: ${skillName} in ${parentName}`
                    );
                    join.adeptPowerSelectSkillRestrictionSkillList.add(
                      ref(loadedSkill)
                    );
                  }
                }
                if (
                  "skillGroupList" in bonusOverride.select.skill.restriction &&
                  bonusOverride.select.skill.restriction.skillGroupList !==
                    undefined
                ) {
                  for (const groupName of bonusOverride.select.skill.restriction
                    .skillGroupList.skillGroupList) {
                    const loadedGroup = await em.findOne(SkillGroups, {
                      name: groupName,
                    });
                    assert(
                      loadedGroup !== null,
                      `SkillGroup not found: ${groupName} in ${parentName}`
                    );
                    join.adeptPowerSelectSkillRestrictionSkillGroupList.add(
                      ref(loadedGroup)
                    );
                  }
                }
              }
            } else {
              // TODO: Handle attribute selection
              bonusOverride.select.attribute;
            }
          }
        }
        bonusEntity.specificPowerList.add(join);
      }
    }
    if (
      bonusDto.power.unlockOptionalCritterPowerList?.optionalPowerList !==
      undefined
    ) {
      for (const optionalCritterPower of bonusDto.power
        .unlockOptionalCritterPowerList.optionalPowerList) {
        const loadedPower = await em.findOne(CritterPowers, {
          name: optionalCritterPower.name,
        });
        assert(
          loadedPower !== null,
          `unlockOptionalCritterPowerList CritterPower not found: ${optionalCritterPower.name} in ${parentName}`
        );
        const join = new BonusOptionalCritterPowers();
        join.bonus = ref(bonusEntity);
        join.critterPower = ref(loadedPower);
        if (optionalCritterPower.select !== undefined)
          join.select = optionalCritterPower.select;
        bonusEntity.optionalCritterPowerList.add(join);
      }
    }
    if (bonusDto.power.addCritterPowerList) {
      for (const critterPower of bonusDto.power.addCritterPowerList) {
        const loadedPower = await em.findOne(CritterPowers, {
          name: critterPower.name,
        });
        assert(
          loadedPower !== null,
          `CritterPower not found: ${critterPower.name} in ${parentName}`
        );
        const join = new BonusAddedCritterPowers();
        join.bonus = ref(bonusEntity);
        join.critterPower = ref(loadedPower);
        if (critterPower.select !== undefined)
          join.select = critterPower.select;
        if (critterPower.rating !== undefined)
          join.rating = critterPower.rating;
        bonusEntity.addCritterPowerList.add(join);
      }
    }
  }

  // --- Spell Category ---
  if (bonusDto.spellAndMagic) {
    if (bonusDto.spellAndMagic.addSpell) {
      const loadedSpell = await em.findOne(Spells, {
        name: bonusDto.spellAndMagic.addSpell.name,
      });
      assert(
        loadedSpell !== null,
        `Spell not found: ${bonusDto.spellAndMagic.addSpell.name} in ${parentName}`
      );
      bonusEntity.addSpell = ref(loadedSpell);
    }
    if (bonusDto.spellAndMagic.addMetamagicList) {
      for (const addMetamagic of bonusDto.spellAndMagic.addMetamagicList) {
        const loadedMetamagic = await em.findOne(Metamagics, {
          name: addMetamagic,
        });
        assert(
          loadedMetamagic !== null,
          `Metamagic not found: ${addMetamagic} in ${parentName}`
        );
        bonusEntity.addMetamagicList.add(ref(loadedMetamagic));
      }
    }
    if (bonusDto.spellAndMagic.metamagicChoiceOrderRestriction) {
      for (const metamagicRestriction of bonusDto.spellAndMagic
        .metamagicChoiceOrderRestriction) {
        const loadedMetamagic = await em.findOne(Metamagics, {
          name: metamagicRestriction.metamagic,
        });
        assert(
          loadedMetamagic !== null,
          `Metamagic not found: ${metamagicRestriction.metamagic} in ${parentName}`
        );
        const join = new BonusMetamagicRestrictions();
        join.bonus = ref(bonusEntity);
        join.metamagic = ref(loadedMetamagic);
        if (metamagicRestriction.initiationOrder !== undefined)
          join.initiationOrder = metamagicRestriction.initiationOrder;
        bonusEntity.metamagicChoiceOrderRestrictionList.add(join);
      }
    }
    if (bonusDto.spellAndMagic.freeSpellOngoingBonus?.linkType) {
      if (
        "skillLinked" in bonusDto.spellAndMagic.freeSpellOngoingBonus.linkType
      ) {
        const skillLinked =
          bonusDto.spellAndMagic.freeSpellOngoingBonus.linkType.skillLinked;
        const loadedSkill = await em.findOne(Skills, { name: skillLinked });
        assert(
          loadedSkill !== null,
          `Skill not found: ${skillLinked} in ${parentName}`
        );
        bonusEntity.freeSpellOngoingBonusSkillLinked = ref(loadedSkill);
      }
    }
    if (bonusDto.spellAndMagic.spellModifiers?.spellBonusDice) {
      for (const spellBonusDice of bonusDto.spellAndMagic.spellModifiers
        .spellBonusDice) {
        if (spellBonusDice.specificSpell) {
          for (const specificSpell of spellBonusDice.specificSpell) {
            const loadedSpell = await em.findOne(Spells, {
              name: specificSpell.name,
            });
            assert(
              loadedSpell !== null,
              `Spell not found: ${specificSpell.name} in ${parentName}`
            );
            const join = new BonusSpecificSpellDice();
            join.bonus = ref(bonusEntity);
            join.spell = ref(loadedSpell);
            if (specificSpell.bonus !== undefined)
              join.diceBonus = specificSpell.bonus;
            bonusEntity.specificSpellDiceList.add(join);
          }
        }
      }
    }
    if (bonusDto.spellAndMagic.fadingModificationList) {
      for (const fadingModification of bonusDto.spellAndMagic
        .fadingModificationList) {
        if (fadingModification.specificComplexForm !== undefined) {
          const loadedComplexForm = await em.findOne(ComplexForms, {
            name: fadingModification.specificComplexForm,
          });
          assert(
            loadedComplexForm !== null,
            `ComplexForm not found: ${fadingModification.specificComplexForm} in ${parentName}`
          );
          const join = new BonusFadingModifications();
          join.bonus = ref(bonusEntity);
          join.complexForm = ref(loadedComplexForm);
          if (fadingModification.modifier !== undefined)
            join.modifier = fadingModification.modifier;
          bonusEntity.fadingModificationList.add(join);
        }
      }
    }
    if (bonusDto.spellAndMagic.addEcho !== undefined) {
      const loadedEcho = await em.findOne(Echoes, {
        name: bonusDto.spellAndMagic.addEcho,
      });
      assert(
        loadedEcho !== null,
        `Echo not found: ${bonusDto.spellAndMagic.addEcho} in ${parentName}`
      );
      bonusEntity.addEcho = ref(loadedEcho);
    }
  }

  // --- Combat and weapon ---
  if (bonusDto.combatAndWeapon) {
    if (bonusDto.combatAndWeapon.addWeaponList !== undefined) {
      for (const addWeapon of bonusDto.combatAndWeapon.addWeaponList) {
        if ("name" in addWeapon) {
          const loadedWeapon = await em.findOne(Weapons, {
            name: addWeapon.name,
          });
          assert(
            loadedWeapon !== null,
            `Weapon not found: ${addWeapon.name} in ${parentName}`
          );
          bonusEntity.addWeaponList.add(ref(loadedWeapon));
        } else {
          if (bonusEntity.addNaturalWeaponList === undefined) {
            bonusEntity.addNaturalWeaponList = [];
          }
          bonusEntity.addNaturalWeaponList.push(addWeapon.naturalWeapon);
        }
      }
    }
    if (bonusDto.combatAndWeapon.addMartialArt != null) {
      const loadedMartialArt = await em.findOne(MartialArts, {
        name: bonusDto.combatAndWeapon.addMartialArt,
      });
      assert(
        loadedMartialArt !== null,
        `MartialArt not found: ${bonusDto.combatAndWeapon.addMartialArt} in ${parentName}`
      );
      bonusEntity.addMartialArt = ref(loadedMartialArt);
    }
    if (
      bonusDto.combatAndWeapon.attackModifiers?.weaponLimitModifier !==
      undefined
    ) {
      const weaponLimitModifier =
        bonusDto.combatAndWeapon.attackModifiers.weaponLimitModifier;
      assert(
        weaponLimitModifier.list === false,
        `weaponLimitModifier list is true in ${parentName}`
      );
      if (weaponLimitModifier.partialName !== undefined) {
        // find all weapons whose name contains the provided substring (case-insensitive)
        const loadedWeaponList = await em.find(Weapons, {
          name: { $ilike: `%${weaponLimitModifier.weapon}%` },
        });
        assert(
          loadedWeaponList.length > 0,
          `No weapons found containing: ${weaponLimitModifier.weapon} in ${parentName}`
        );
        assert(
          loadedWeaponList.length > 1,
          `Too few weapons found containing: ${weaponLimitModifier.weapon} in ${parentName}`
        );
        const join = new BonusWeaponLimitModifiers();
        join.bonus = ref(bonusEntity);
        for (const weapon of loadedWeaponList) {
          join.weaponList.add(ref(weapon));
        }
        join.limitModifier = weaponLimitModifier.modifier;
        bonusEntity.weaponLimitModifier = join;
      } else {
        const loadedWeapon = await em.findOne(Weapons, {
          name: weaponLimitModifier.weapon,
        });
        assert(
          loadedWeapon !== null,
          `Weapon not found: ${weaponLimitModifier.weapon} in ${parentName}`
        );
        const join = new BonusWeaponLimitModifiers();
        join.bonus = ref(bonusEntity);
        join.weaponList.add(ref(loadedWeapon));
        join.limitModifier = weaponLimitModifier.modifier;
        bonusEntity.weaponLimitModifier = join;
      }
    }

    if (bonusDto.combatAndWeapon.attackModifiers?.weaponSkillAccuracyList) {
      for (const accuracyMod of bonusDto.combatAndWeapon.attackModifiers
        .weaponSkillAccuracyList) {
        if (accuracyMod.skill.selectSkill === false) {
          const accuracyModifier =
            new BonusWeaponSkillAccuracyModifiersSkillModifier();
          accuracyModifier.bonus = ref(bonusEntity);
          accuracyModifier.modifier = accuracyMod.modifier;
          const loadedSkill = await em.findOne(Skills, {
            name: accuracyMod.skill.name,
          });
          assert(
            loadedSkill !== null,
            `Skill not found: ${accuracyMod.skill.name} in ${parentName}`
          );
          accuracyModifier.skill = ref(loadedSkill);
          bonusEntity.weaponSkillAccuracyModifierList.add(accuracyModifier);
        } else {
          const accuracyModifier =
            new BonusWeaponSkillAccuracyModifiersSelectSkill();
          accuracyModifier.bonus = ref(bonusEntity);
          accuracyModifier.modifier = accuracyMod.modifier;
          const restrictions = new BonusWeaponAccuracySkillListConnected({
            enterName: false,
          });
          restrictions.weaponAccuracyBase = ref(accuracyModifier);
          restrictions.enterName = false;
          await linkSelectSkill(
            em,
            accuracyMod.skill.selectionOptions,
            restrictions
          );
          accuracyModifier.restrictions = ref(restrictions);
          bonusEntity.weaponSkillAccuracyModifierList.add(accuracyModifier);
        }
      }
    }

    if (
      bonusDto.combatAndWeapon.damageValueModifiers?.weaponSkillDamage
        ?.selectionOptions !== undefined &&
      bonusEntity.weaponSkillDamageSelectionOptions !== undefined
    ) {
      const join = bonusEntity.weaponSkillDamageSelectionOptions;
      join.bonus = ref(bonusEntity);
      await linkSelectSkill(
        em,
        bonusDto.combatAndWeapon.damageValueModifiers.weaponSkillDamage
          .selectionOptions,
        join
      );
    }
  }

  // --- Lifestyle ---
  if (bonusDto.movementAndLifestyle?.lifestyleCostModifierList) {
    for (const lifestyleCost of bonusDto.movementAndLifestyle
      .lifestyleCostModifierList) {
      if (lifestyleCost.lifestyle === undefined) continue;
      const loadedLifestyle = await em.findOne(Lifestyles, {
        name: lifestyleCost.lifestyle,
      });
      assert(
        loadedLifestyle !== null,
        `Lifestyle not found: ${lifestyleCost.lifestyle} in ${parentName}`
      );
      const join = new BonusLifestyleCostModifiers();
      join.bonus = ref(bonusEntity);
      join.lifestyle = ref(loadedLifestyle);
      if (lifestyleCost.cost !== undefined) join.cost = lifestyleCost.cost;
      if (lifestyleCost.basicLifestyle !== undefined)
        join.basicLifestyle = lifestyleCost.basicLifestyle;
      bonusEntity.lifestyleCostModifierList.add(join);
    }
  }

  // --- Gear ---
  if (bonusDto.gearAndVehicle?.addGear) {
    const loadedGear = await em.findOne(Gears, {
      name: bonusDto.gearAndVehicle.addGear.name,
    });
    assert(
      loadedGear !== null,
      `Gear not found: ${bonusDto.gearAndVehicle.addGear.name} in ${parentName}`
    );
    bonusEntity.addGear = ref(loadedGear);

    if (bonusDto.gearAndVehicle.addGear.includedGearList) {
      for (const includedGear of bonusDto.gearAndVehicle.addGear
        .includedGearList) {
        const loadedIncludedGear = await em.findOne(Gears, {
          name: includedGear.name,
        });
        assert(
          loadedIncludedGear !== null,
          `Included Gear not found: ${includedGear.name} in ${parentName}`
        );
        const join = new BonusAddedGearIncludes();
        join.bonus = ref(bonusEntity);
        join.gear = ref(loadedIncludedGear);
        if (includedGear.category !== undefined)
          join.category = includedGear.category;
        if (includedGear.rating !== undefined)
          join.rating = includedGear.rating;
        bonusEntity.addGearIncludedGearList.add(join);
      }
    }
  }

  // --- Augmentations ---
  if (bonusDto.essenceAndAugmentation?.addAugmentation) {
    const loadedAugmentation = await em.findOne(Augmentations, {
      name: bonusDto.essenceAndAugmentation.addAugmentation.name,
    });
    assert(
      loadedAugmentation !== null,
      `Augmentation not found: ${bonusDto.essenceAndAugmentation.addAugmentation.name} in ${parentName}`
    );
    bonusEntity.addAugmentation = ref(loadedAugmentation);
  }

  // --- Qualities ---
  if (bonusDto.quality) {
    if (bonusDto.quality.addQualityList) {
      for (const addQuality of bonusDto.quality.addQualityList) {
        const loadedQuality = await em.findOne(Qualities, {
          name: addQuality.name,
        });
        assert(
          loadedQuality !== null,
          `Quality not found: ${addQuality.name} in ${parentName}`
        );
        const join = new BonusAddedQualities();
        join.bonus = ref(bonusEntity);
        join.quality = ref(loadedQuality);
        if (addQuality.rating !== undefined) join.rating = addQuality.rating;
        bonusEntity.addQualityList.add(join);
      }
    }
    if (bonusDto.quality.freeQuality !== undefined) {
      const loadedQuality = await em.findOne(Qualities, {
        name: bonusDto.quality.freeQuality,
      });
      assert(
        loadedQuality !== null,
        `Quality not found: ${bonusDto.quality.freeQuality} in ${parentName}`
      );
      bonusEntity.freeQuality = ref(loadedQuality);
    }
    if (bonusDto.quality.selectQualityFromList?.bonusQualityList) {
      for (const selectQuality of bonusDto.quality.selectQualityFromList
        .bonusQualityList) {
        const loadedQuality = await em.findOne(Qualities, {
          name: selectQuality,
        });
        assert(
          loadedQuality !== null,
          `Quality not found: ${selectQuality} in ${parentName}`
        );
        bonusEntity.selectBonusQualityList.add(loadedQuality);
      }
    }
    if (bonusDto.quality.selectQualityFromList?.reducedBonusQualityList) {
      for (const selectQuality of bonusDto.quality.selectQualityFromList
        .reducedBonusQualityList) {
        const loadedQuality = await em.findOne(Qualities, {
          name: selectQuality.name,
        });
        assert(
          loadedQuality !== null,
          `Quality not found: ${selectQuality.name} in ${parentName}`
        );
        const join = new BonusReducedQualities();
        join.bonus = ref(bonusEntity);
        join.quality = ref(loadedQuality);
        if (selectQuality.karmaReduction !== undefined)
          join.karmaReduction = selectQuality.karmaReduction;
        bonusEntity.reducedBonusQualityList.add(join);
      }
    }
    if (bonusDto.quality.disableQualityList) {
      for (const disableQuality of bonusDto.quality.disableQualityList) {
        const loadedQuality = await em.findOne(Qualities, {
          name: disableQuality,
        });
        assert(
          loadedQuality !== null,
          `Quality not found: ${disableQuality} in ${parentName}`
        );
        bonusEntity.disableQualityList.add(ref(loadedQuality));
      }
    }
  }
};

async function linkSelectSkill(
  em: EntityManager,
  selectSkillDto: SelectSkillType,
  bonusSelectSkills: BonusSelectSkills
) {
  if (selectSkillDto.restriction) {
    if ("skillList" in selectSkillDto.restriction) {
      for (const skillName of selectSkillDto.restriction.skillList.skillList) {
        const loadedSkill = await em.findOne(Skills, { name: skillName });
        assert(loadedSkill !== null, `Skill not found: ${skillName}`);
        bonusSelectSkills.skillList.add(ref(loadedSkill));
      }
    }
    if ("skillGroupList" in selectSkillDto.restriction) {
      for (const groupName of selectSkillDto.restriction.skillGroupList
        .skillGroupList) {
        const loadedGroup = await em.findOne(SkillGroups, { name: groupName });
        assert(loadedGroup !== null, `SkillGroup not found: ${groupName}`);
        bonusSelectSkills.skillGroupList.add(ref(loadedGroup));
      }
    }
  }
}
