// ============================================================
// Join Table Entities (ManyToMany with extra columns)
// ============================================================

import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Enum,
  ManyToMany,
  Collection,
  OneToOne,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Bonuses } from "./bonusModel.js";
import {
  gearCategoryEnum,
  type RatingBonusType,
  type bonusSkillModifierTypeEnum,
  skillCategoryEnum,
  bonusSkillCategoryEnum,
  attributeTypeEnum,
  type SelectSkillType,
  inclusionTypeEnum,
} from "@neon-codex/common";
import { Skills } from "../abilities/skillModel.js";
import { AdeptPowers } from "../abilities/adeptPowerModel.js";
import { ComplexForms } from "../abilities/complexFormModel.js";
import { CritterPowers } from "../abilities/critterPowerModel.js";
import { SkillGroups } from "../abilities/skillGroupModel.js";
import { Spells } from "../abilities/spellModel.js";
import { Gears } from "../equipment/other/gearModel.js";
import { Qualities } from "../traits/qualityModel.js";
import { Lifestyles } from "./lifestyleModel.js";
import { Metamagics } from "./metamagicModel.js";
import { Weapons } from "../equipment/combat/weaponModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class BonusBaseSkillModifiers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @Property({ type: "json" })
  skillBonus!: RatingBonusType;

  @Property({ nullable: true })
  precedence?: "-1" | "0" | "1";

  @Property({ nullable: true })
  condition?: string;

  @Property()
  modifierType!:
    | bonusSkillModifierTypeEnum.ApplyBonusToLevel
    | bonusSkillModifierTypeEnum.DicePoolIncrease
    | bonusSkillModifierTypeEnum.LevelIncrease;
}

@Entity({
  discriminatorValue: bonusSkillCategoryEnum.Skill,
})
export class BonusSkillModifiers extends BonusBaseSkillModifiers {
  @ManyToOne({ entity: () => Skills, ref: true })
  skill!: Ref<Skills>;
}

@Entity({
  discriminatorValue: bonusSkillCategoryEnum.SkillAttribute,
})
export class BonusSkillAttributeModifiers extends BonusBaseSkillModifiers {
  @Enum({ items: () => attributeTypeEnum })
  attribute!: attributeTypeEnum;
}

@Entity({
  discriminatorValue: bonusSkillCategoryEnum.SkillCategory,
})
export class BonusSkillCategoryModifiers extends BonusBaseSkillModifiers {
  @Enum({ items: () => skillCategoryEnum })
  category!: skillCategoryEnum;

  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  excludeSkill?: Ref<Skills>;
}

@Entity({
  discriminatorValue: bonusSkillCategoryEnum.SkillGroup,
})
export class BonusSkillGroupModifiers extends BonusBaseSkillModifiers {
  @ManyToOne({ entity: () => SkillGroups, ref: true })
  skillGroup!: Ref<SkillGroups>;

  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  excludeSkill?: Ref<Skills>;
}

@Entity()
export class BonusSkillSpecialisation {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => Bonuses, (bonus) => bonus.addSkillSpecialisation, {
    orphanRemoval: true,
    ref: true,
  })
  bonus!: Ref<Bonuses>;

  @ManyToMany({
    entity: () => Skills,
    owner: true,
    pivotTable: "bonus_skill_specialisation_skills",
    joinColumn: "bonus_join_skill_id",
  })
  skillList = new Collection<Skills>(this);

  @Property()
  specialisation!: string;
}

@Entity()
export class BonusAddedQualities {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Qualities, ref: true })
  quality!: Ref<Qualities>;

  @Property({ nullable: true })
  rating?: number;
}

@Entity()
export class BonusReducedQualities {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Qualities, ref: true })
  quality!: Ref<Qualities>;

  @Property()
  karmaReduction!: number;
}

@Entity()
export class BonusAddedCritterPowers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => CritterPowers, ref: true })
  critterPower!: Ref<CritterPowers>;

  @Property({ nullable: true })
  select?: string;

  @Property({ nullable: true })
  rating?: number;
}

@Entity()
export class BonusSpecificAdeptPowers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => AdeptPowers, ref: true })
  adeptPower!: Ref<AdeptPowers>;

  @Property({ nullable: true })
  powerBonus?: number;

  @Enum({ items: () => attributeTypeEnum, nullable: true })
  selectAttribute?: attributeTypeEnum;

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  limitAttribute?: inclusionTypeEnum;

  // Select skill split here between DB and non-DB
  @Property({ type: "json", nullable: true })
  selectSkill?: SelectSkillType;

  @ManyToMany({
    entity: () => Skills,
    owner: true,
    pivotTable: "bonus_specific_adept_power_restrict_skills",
    joinColumn: "bonus_join_restrict_skill_id",
  })
  adeptPowerSelectSkillRestrictionSkillList = new Collection<Skills>(this);

  @ManyToMany({
    entity: () => SkillGroups,
    owner: true,
    pivotTable: "bonus_specific_adept_power_restrict_skill_groups",
    joinColumn: "bonus_join_restrict_sg_id",
  })
  adeptPowerSelectSkillRestrictionSkillGroupList = new Collection<SkillGroups>(
    this
  );
}

@Entity()
export class BonusOptionalCritterPowers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => CritterPowers, ref: true })
  critterPower!: Ref<CritterPowers>;

  @Property({ nullable: true })
  select?: string;
}

@Entity()
export class BonusMetamagicRestrictions {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Metamagics, ref: true })
  metamagic!: Ref<Metamagics>;

  @Property()
  initiationOrder!: number;
}

@Entity()
export class BonusSpecificSpellDice {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Spells, ref: true })
  spell!: Ref<Spells>;

  @Property()
  diceBonus!: number;
}

@Entity()
export class BonusFadingModifications {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => ComplexForms, ref: true })
  complexForm!: Ref<ComplexForms>;

  @Property()
  modifier!: number;
}

@Entity()
export class BonusLifestyleCostModifiers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Lifestyles, ref: true })
  lifestyle!: Ref<Lifestyles>;

  @Property({ nullable: true })
  basicLifestyle?: true;

  @Property()
  cost!: number;
}

@Entity()
export class BonusAddedGearIncludes {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToOne({ entity: () => Gears, ref: true })
  gear!: Ref<Gears>;

  @Enum({ items: () => gearCategoryEnum })
  category!: gearCategoryEnum;

  @Property({ nullable: true })
  rating?: number;
}

@Entity()
export class BonusWeaponLimitModifiers {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => Bonuses, (bonus) => bonus.weaponLimitModifier, { ref: true })
  bonus!: Ref<Bonuses>;

  @ManyToMany({ entity: () => Weapons, ref: true })
  weaponList = new Collection<Weapons>(this);

  @Property({ type: "json" })
  limitModifier!: RatingBonusType;
}

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class BonusWeaponSkillAccuracyModifiers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Bonuses, ref: true })
  bonus!: Ref<Bonuses>;

  @Property({ type: "json" })
  modifier!: RatingBonusType;
}
@Entity({ discriminatorValue: "SkillModifier" })
export class BonusWeaponSkillAccuracyModifiersSkillModifier extends BonusWeaponSkillAccuracyModifiers {
  @ManyToOne({ entity: () => Skills, ref: true })
  skill!: Ref<Skills>;
}

@Entity({ discriminatorValue: "SelectSkill" })
export class BonusWeaponSkillAccuracyModifiersSelectSkill extends BonusWeaponSkillAccuracyModifiers {
  @OneToOne(
    () => BonusWeaponAccuracySkillListConnected,
    (bonusWeaponAccuracySkillListConnected) =>
      bonusWeaponAccuracySkillListConnected.weaponAccuracyBase,
    { owner: true }
  )
  restrictions!: Ref<BonusWeaponAccuracySkillListConnected>;
}

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class BonusSelectSkills {
  @PrimaryKey()
  id!: number;

  @Property()
  enterName!: boolean;

  @ManyToMany({
    entity: () => Skills,
    owner: true,
    joinColumn: "bonus_select_skill_id",
  })
  skillList = new Collection<Skills>(this);

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  skillListLimit?: inclusionTypeEnum;

  @ManyToMany({
    entity: () => SkillGroups,
    owner: true,
    joinColumn: "bonus_select_sg_id",
  })
  skillGroupList = new Collection<SkillGroups>(this);

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  skillGroupListLimit?: inclusionTypeEnum;

  @Enum({ items: () => skillCategoryEnum, array: true, nullable: true })
  skillCategoryList?: Array<skillCategoryEnum>;

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  skillCategoryListLimit?: inclusionTypeEnum;

  @Enum({ items: () => attributeTypeEnum, array: true, nullable: true })
  skillAttributeList?: Array<attributeTypeEnum>;

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  skillAttributeListLimit?: inclusionTypeEnum;

  @Enum({ items: () => inclusionTypeEnum, nullable: true })
  knowledgeSkillRestrictionLimit?: inclusionTypeEnum;

  @Property({ nullable: true })
  minimumRating?: number;

  @Property({ nullable: true })
  maximumRating?: number;
}

@Entity({ discriminatorValue: "BonusConnected" })
export class BonusSelectSkillsSelectSkill extends BonusSelectSkills {
  @OneToOne(() => Bonuses, (bonus) => bonus.weaponSkillDamageSelectionOptions, {
    ref: true,
  })
  bonus!: Ref<Bonuses>;
}

@Entity({ discriminatorValue: "WeaponAccuracySkillListConnected" })
export class BonusWeaponAccuracySkillListConnected extends BonusSelectSkills {
  @OneToOne(
    () => BonusWeaponSkillAccuracyModifiersSelectSkill,
    (bonusWeaponSkillAccuracyModifiersSelectSkill) =>
      bonusWeaponSkillAccuracyModifiersSelectSkill.restrictions
  )
  weaponAccuracyBase!: Ref<BonusWeaponSkillAccuracyModifiersSelectSkill>;

  constructor(dto: {
    enterName: boolean;
    skillList?: Collection<Skills>;
    skillListLimit?: inclusionTypeEnum;
    skillGroupList?: Collection<SkillGroups>;
    skillGroupListLimit?: inclusionTypeEnum;
    skillCategoryList?: Array<skillCategoryEnum>;
    skillCategoryListLimit?: inclusionTypeEnum;
    skillAttributeList?: Array<attributeTypeEnum>;
    skillAttributeListLimit?: inclusionTypeEnum;
    knowledgeSkillRestrictionLimit?: inclusionTypeEnum;
    minimumRating?: number;
    maximumRating?: number;
  }) {
    super();
    this.enterName = dto.enterName;
    if (dto.skillList) this.skillList = dto.skillList;
    if (dto.skillListLimit !== undefined)
      this.skillListLimit = dto.skillListLimit;
    if (dto.skillGroupList) this.skillGroupList = dto.skillGroupList;
    if (dto.skillGroupListLimit !== undefined)
      this.skillGroupListLimit = dto.skillGroupListLimit;
    if (dto.skillCategoryList) this.skillCategoryList = dto.skillCategoryList;
    if (dto.skillCategoryListLimit !== undefined)
      this.skillCategoryListLimit = dto.skillCategoryListLimit;
    if (dto.skillAttributeList)
      this.skillAttributeList = dto.skillAttributeList;
    if (dto.skillAttributeListLimit !== undefined)
      this.skillAttributeListLimit = dto.skillAttributeListLimit;
    if (dto.knowledgeSkillRestrictionLimit !== undefined)
      this.knowledgeSkillRestrictionLimit = dto.knowledgeSkillRestrictionLimit;
    if (dto.minimumRating !== undefined) this.minimumRating = dto.minimumRating;
    if (dto.maximumRating !== undefined) this.maximumRating = dto.maximumRating;
  }
}
