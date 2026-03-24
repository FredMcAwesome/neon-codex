import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  type BonusType,
  type BonusAttributeOptionType,
  type BonusSkillOptionType,
  type BonusConditionAndRecoveryOptionType,
  type BonusMovementAndLifestyleOptionType,
  type BonusTestAndResistanceOptionType,
  type BonusInitiativeOptionType,
  type BonusGearAndVehicleOptionType,
  type BonusEssenceAndAugmentationType,
  type BonusContactAndReputationType,
  type BonusSpecificQualityType,
  type BonusMiscellaneousOptionType,
  critterPowerCategoryEnum,
  type BonusSelectPowerType,
  type BonusUnlockOptionalPowerType,
  type BonusFreeSpellOngoingBonusType,
  type BonusLimitSpellOptionsToCategoryListType,
  type BonusLimitSpiritOptionsToListType,
  type BonusUnlockSpellListType,
  type BonusSpellModifiersType,
  spellDescriptorEnum,
  type RatingCalculationType,
  type BonusNewSpellKarmaCostModificationType,
  type BonusFocusBindingKarmaCostModificationType,
  type LivingPersonaModificationType,
  type NaturalWeaponType,
  type WeaponCategoryDicePoolModifierType,
  type WeaponClassificationDicePoolModifierType,
  damageTypeEnum,
  ammoSourceEnum,
  type ArmourBonusType,
  type DamageResistanceBonusType,
  type ToxinAndPathogenBonusType,
  attributeTypeEnum,
  talentSkillUnlockCategoryEnum,
} from "@neon-codex/common";
import {
  augmentationCategoryEnum,
  augmentationGradeEnum,
  gearCategoryEnum,
} from "@neon-codex/common";
import { Qualities } from "../traits/qualityModel.js";
import { Skills } from "../abilities/skillModel.js";
import { SkillGroups } from "../abilities/skillGroupModel.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Spells } from "../abilities/spellModel.js";
import { AdeptPowers } from "../abilities/adeptPowerModel.js";
import { CritterPowers } from "../abilities/critterPowerModel.js";
import { Metamagics } from "./metamagicModel.js";
import { Echoes } from "./echoModel.js";
import { ComplexForms } from "../abilities/complexFormModel.js";
import { Gears } from "../equipment/other/gearModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { MartialArts } from "../abilities/martialArtModel.js";
import { Lifestyles } from "./lifestyleModel.js";
import { Heritages } from "../traits/heritageModel.js";
import { Critters } from "../creatures/critterModel.js";
import { Drugs } from "../equipment/other/drugModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { ArmourModifications } from "../equipment/combat/armourModificationModel.js";
import { VehicleModifications } from "../equipment/rigger/vehicleModificationModel.js";
import { Programs } from "../abilities/programModel.js";
import { Traditions } from "../traits/traditionModel.js";
import { Mentors } from "./mentorModel.js";
import { MartialArtTechniques } from "../abilities/martialArtTechniqueModel.js";
import { LifestyleQualities } from "./lifestyleQualityModel.js";
import {
  BonusSkillGroupModifiers,
  BonusSkillModifiers,
  BonusSpecificAdeptPowers,
  BonusAddedCritterPowers,
  BonusMetamagicRestrictions,
  BonusSpecificSpellDice,
  BonusFadingModifications,
  BonusLifestyleCostModifiers,
  BonusAddedGearIncludes,
  BonusAddedQualities,
  BonusReducedQualities,
  BonusSkillCategoryModifiers,
  BonusSkillSpecialisation,
  BonusWeaponLimitModifiers,
  BonusWeaponSkillAccuracyModifiers,
  BonusSelectSkillsSelectSkill,
  BonusOptionalCritterPowers,
  BonusSkillAttributeModifiers,
} from "./bonusJoinModel.js";

// ============================================================
// Base Bonuses Class
// ============================================================

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
export abstract class Bonuses {
  @PrimaryKey()
  id!: number;

  // ----------------------------------------------------
  // ---------------- attribute category ----------------
  // ----------------------------------------------------
  // All JSON, no entity FKs
  // Schema: attribute
  @Property({ type: "json", nullable: true })
  attribute?: BonusAttributeOptionType;

  // ----------------------------------------------------
  // ------------------ skill category ------------------
  // ----------------------------------------------------
  // Non-FK parts stored as JSON
  // Schema: skill
  @Property({ type: "json", nullable: true })
  skill?: Omit<
    BonusSkillOptionType,
    | "skillIncreaseList"
    | "skillIncreaseForAttributeList"
    | "skillGroupList"
    | "unlockSkillList"
    | "swapSkillAttribute"
    | "swapSkillSpecialisationAttribute"
    | "blockSkillGroupAndDefaulting"
    | "addSkillSpecialisation"
  >;

  // Schema: selectSkill.restriction skill/group lists
  @ManyToMany({
    entity: () => Skills,
    owner: true,
    joinColumn: "bonus_restrict_skill_id",
  })
  selectSkillRestrictionSkillList = new Collection<Skills>(this);

  @ManyToMany({
    entity: () => SkillGroups,
    owner: true,
    joinColumn: "bonus_restrict_sg_id",
  })
  selectSkillRestrictionSkillGroupList = new Collection<SkillGroups>(this);

  // Schema: skill.selectExpertise.availableSkillList
  @ManyToMany({
    entity: () => Skills,
    owner: true,
    joinColumn: "bonus_expertise_skill_id",
  })
  selectExpertiseFromSkillList = new Collection<Skills>(this);

  // Schema: skillIncreaseList + skillIncreaseForAttributeList → Skills (via join)
  @OneToMany(() => BonusSkillModifiers, (m) => m.bonus)
  skillIncreaseList = new Collection<BonusSkillModifiers>(this);

  @OneToMany(() => BonusSkillAttributeModifiers, (m) => m.bonus)
  skillIncreaseForAttributeList = new Collection<BonusSkillAttributeModifiers>(
    this
  );

  // Schema: skillCategoryList => Skills (via join)
  @OneToMany(() => BonusSkillCategoryModifiers, (m) => m.bonus)
  skillCategoryList = new Collection<BonusSkillCategoryModifiers>(this);

  // Schema: skill.skillGroupList
  @OneToMany(() => BonusSkillGroupModifiers, (m) => m.bonus)
  skillGroupList = new Collection<BonusSkillGroupModifiers>(this);

  // Schema: skill.addSkillSpecialisation
  @OneToOne(() => BonusSkillSpecialisation, (m) => m.bonus, {
    owner: true,
    ref: true,
    nullable: true,
  })
  addSkillSpecialisation?: Ref<BonusSkillSpecialisation>;

  // Schema: skill.blockSkillGroupAndDefaulting
  @ManyToOne({ entity: () => SkillGroups, ref: true, nullable: true })
  blockSkillGroupAndDefaultingGroup?: Ref<SkillGroups>;

  // Schema: skill.skillDisableList.skillList
  @ManyToMany({
    entity: () => Skills,
    owner: true,
    joinColumn: "bonus_disable_skill_id",
  })
  skillDisableSkillList = new Collection<Skills>(this);

  // Schema: skill.skillDisableList.skillGroupList
  @ManyToMany({
    entity: () => SkillGroups,
    owner: true,
    joinColumn: "bonus_disable_sg_id",
  })
  skillDisableSkillGroupList = new Collection<SkillGroups>(this);

  // Schema: skill.unlockSkillList
  @ManyToMany({
    entity: () => Skills,
    owner: true,
    joinColumn: "bonus_unlock_skill_id",
  })
  unlockSkillList = new Collection<Skills>(this);

  @Enum({
    items: () => talentSkillUnlockCategoryEnum,
    array: true,
    nullable: true,
  })
  unlockTalentSkillCategoryList?: Array<talentSkillUnlockCategoryEnum>;

  // Schema: skill.swapSkillAttribute.skill
  // TODO: fix these
  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  swapSkillAttributeSkill?: Ref<Skills>;

  @Property({ type: "json", nullable: true })
  swapSkillAttributeConfig?: { newAttribute: attributeTypeEnum };

  // Schema: skill.swapSkillSpecialisationAttribute.skill
  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  swapSkillSpecialisationAttributeSkill?: Ref<Skills>;

  @Property({ type: "json", nullable: true })
  swapSkillSpecialisationAttributeConfig?: {
    specialisation: string;
    newAttribute: attributeTypeEnum;
  };

  // ------------------------------------------------
  // ---------------- power category ----------------
  // ------------------------------------------------
  // Schema: power.selectPower
  @Property({ type: "json", nullable: true })
  selectPower?: BonusSelectPowerType;

  // Schema: power.selectPower.limitedPowerList
  @ManyToMany({
    entity: () => AdeptPowers,
    owner: true,
    joinColumn: "bonus_limited_power_id",
  })
  selectPowerLimitedPowerList = new Collection<AdeptPowers>(this);

  // Schema: power.specificPowerList
  @OneToMany(() => BonusSpecificAdeptPowers, (m) => m.bonus)
  specificPowerList = new Collection<BonusSpecificAdeptPowers>(this);

  @Property({ type: "json", nullable: true })
  unlockOptionalPowerConfig?: BonusUnlockOptionalPowerType;

  // Schema: power.unlockOptionalCritterPowerList
  @OneToMany(() => BonusOptionalCritterPowers, (m) => m.bonus)
  optionalCritterPowerList = new Collection<BonusOptionalCritterPowers>(this);

  @Enum({ items: () => critterPowerCategoryEnum, nullable: true })
  unlockCritterPowerCategory?: critterPowerCategoryEnum;

  // Schema: power.addCritterPowerList
  @OneToMany(() => BonusAddedCritterPowers, (m) => m.bonus)
  addCritterPowerList = new Collection<BonusAddedCritterPowers>(this);

  // Schema: power.bonusAdeptPowerPoints
  @Property({ nullable: true })
  bonusAdeptPowerPoints?: number;

  // --------------------------------------------------------
  // --------------- spell and magic category ---------------
  // --------------------------------------------------------
  // Schema: spellAndMagic.addSpell.name
  @ManyToOne({ entity: () => Spells, ref: true, nullable: true })
  addSpell?: Ref<Spells>;

  @Property({ nullable: true })
  addSpellAlchemical?: true;

  // Schema: spellAndMagic.addMetamagicList
  @ManyToMany({
    entity: () => Metamagics,
    owner: true,
    joinColumn: "bonus_metamagic_id",
  })
  addMetamagicList = new Collection<Metamagics>(this);

  // Schema: spellAndMagic.metamagicChoiceOrderRestriction
  @OneToMany(() => BonusMetamagicRestrictions, (m) => m.bonus)
  metamagicChoiceOrderRestrictionList =
    new Collection<BonusMetamagicRestrictions>(this);

  // Schema: spellAndMagic.freeSpellOngoingBonus.skillLinked
  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  freeSpellOngoingBonusSkillLinked?: Ref<Skills>;

  // Schema: spellAndMagic.freeSpellOngoingBonus
  @Property({ type: "json", nullable: true })
  freeSpellOngoingBonus?: BonusFreeSpellOngoingBonusType;

  // Schema: spellAndMagic.linkSpell
  @Property({ type: "json", nullable: true })
  linkSpell?: { ignoreRequirements: boolean };

  // Schema: spellAndMagic.limitSpellOptionsToCategoryList
  @Property({ type: "json", nullable: true })
  limitSpellOptionsToCategoryList?: BonusLimitSpellOptionsToCategoryListType;

  // Schema: spellAndMagic.limitSpiritOptionsToList
  @Property({ type: "json", nullable: true })
  limitSpiritOptionsToList?: BonusLimitSpiritOptionsToListType;

  // Schema: spellAndMagic.unlockSpellList
  @Property({ type: "json", nullable: true })
  unlockSpellList?: BonusUnlockSpellListType;

  // Schema: spellAndMagic.spellModifiers.spellBonusDice.specificSpell
  @OneToMany(() => BonusSpecificSpellDice, (m) => m.bonus)
  specificSpellDiceList = new Collection<BonusSpecificSpellDice>(this);

  // Schema: spellAndMagic.spellModifiers
  @Property({ type: "json", nullable: true })
  spellModifiers?: BonusSpellModifiersType;

  @Enum({ items: () => spellDescriptorEnum, array: true, nullable: true })
  blockSpellDescriptorList?: Array<spellDescriptorEnum>;

  @Property({ nullable: true })
  linkMentorSpirit?: true;

  @Property({ nullable: true })
  linkTradition?: true;

  // Schema: spellAndMagic.penaltyFreeSustainCount
  @Property({ type: "json", nullable: true })
  penaltyFreeSustainCount?: RatingCalculationType;

  // Schema: spellAndMagic.newSpellKarmaCostModification
  @Property({ type: "json", nullable: true })
  newSpellKarmaCostModification?: BonusNewSpellKarmaCostModificationType;

  // Schema: spellAndMagic.focusBindingKarmaCostModificationList
  @Property({ type: "json", nullable: true })
  focusBindingKarmaCostModificationList?: BonusFocusBindingKarmaCostModificationType;

  // Schema: spellAndMagic.drainModification
  @Property({ nullable: true })
  drainModification?: number;

  @ManyToMany({ entity: () => Critters, owner: true, joinColumn: "join_id" })
  addSpiritOptionList: Collection<Critters> = new Collection<Critters>(this);

  @Property({ type: "json", nullable: true })
  addSpiritOptionSelectList?: Array<true>;

  @Property({ nullable: true })
  linkParagon?: true;

  @Property({ nullable: true })
  linkSprite?: true;

  // Schema: spellAndMagic.fadingModificationList
  @OneToMany(() => BonusFadingModifications, (m) => m.bonus)
  fadingModificationList = new Collection<BonusFadingModifications>(this);

  // Schema: spellAndMagic.addEcho
  @ManyToOne({ entity: () => Echoes, ref: true, nullable: true })
  addEcho?: Ref<Echoes>;

  // Schema: spellAndMagic.livingPersonaModification
  @Property({ type: "json", nullable: true })
  livingPersonaModification?: LivingPersonaModificationType;

  @Property({ nullable: true })
  resonanceLossDueToAugmentationModificationPercentageIncrease?: number;

  // --------------------------------------
  // ----- combat and weapon category -----
  // --------------------------------------
  // Schema: combatAndWeapon.addWeaponList
  @ManyToMany({
    entity: () => Weapons,
    owner: true,
    joinColumn: "bonus_weapon_id",
  })
  addWeaponList = new Collection<Weapons>(this);

  // Schema: combatAndWeapon.addWeaponList
  @Property({ type: "json", nullable: true })
  addNaturalWeaponList?: Array<NaturalWeaponType>;

  // Schema: combatAndWeapon.addMartialArt
  @ManyToOne({ entity: () => MartialArts, ref: true, nullable: true })
  addMartialArt?: Ref<MartialArts>;

  // Schema: combatAndWeapon.attackModifiers.weaponCategoryDicePoolModifier
  @Property({ type: "json", nullable: true })
  weaponCategoryDicePoolModifier?: WeaponCategoryDicePoolModifierType;

  // Schema: combatAndWeapon.attackModifiers.weaponClassificationDicePoolModifier
  @Property({ type: "json", nullable: true })
  weaponClassificationDicePoolModifier?: WeaponClassificationDicePoolModifierType;

  // Schema: combatAndWeapon.attackModifiers.weaponLimitModifier
  @OneToOne(() => BonusWeaponLimitModifiers, (m) => m.bonus, {
    owner: true,
    nullable: true,
  })
  weaponLimitModifier?: BonusWeaponLimitModifiers;

  // Schema: combatAndWeapon.attackModifiers.smartLinkModifier
  @Property({ nullable: true })
  smartLinkModifier?: number;

  // Schema: combatAndWeapon.attackModifiers.unarmedModifier
  @Property({ type: "json", nullable: true })
  unarmedAttackModifier?: RatingCalculationType;

  // Schema: combatAndWeapon.attackModifiers.weaponSkillAccuracyModifier
  @OneToMany(() => BonusWeaponSkillAccuracyModifiers, (m) => m.bonus)
  weaponSkillAccuracyModifierList =
    new Collection<BonusWeaponSkillAccuracyModifiers>(this);

  // Schema: combatAndWeapon.damageValueModifiers.thrownWeaponModifier
  @Property({ nullable: true })
  thrownWeaponDamageModifier?: number;

  // Schema: combatAndWeapon.damageValueModifiers.unarmedModifier
  @Property({ type: "json", nullable: true })
  unarmedDamageModifier?: RatingCalculationType;

  // Schema: combatAndWeapon.damageValueModifiers.weaponSkillDamage.selectionOptions
  @OneToOne(() => BonusSelectSkillsSelectSkill, (m) => m.bonus, {
    owner: true,
    nullable: true,
  })
  weaponSkillDamageSelectionOptions?: BonusSelectSkillsSelectSkill;

  // Schema: combatAndWeapon.damageValueModifiers.weaponSkillDamage.modifier
  @Property({ nullable: true })
  weaponSkillDamageModifier?: number;

  // Schema: combatAndWeapon.unarmedDamageType
  @Enum({ items: () => damageTypeEnum, nullable: true })
  unarmedDamageType?: damageTypeEnum;

  // Schema: combatAndWeapon.rangeModifiers.thrownWeaponRangeModifier
  @Property({ type: "json", nullable: true })
  rangeModifiersThrownWeaponRangeModifier?: RatingCalculationType;

  // Schema: combatAndWeapon.rangeModifiers.reach.weaponName
  @ManyToOne({ entity: () => Weapons, ref: true, nullable: true })
  rangeModifiersReachWeaponName?: Ref<Weapons>;

  // Schema: combatAndWeapon.rangeModifiers.reach.modifier
  @Property({ nullable: true })
  rangeModifiersReachModifier?: number;

  // Schema: combatAndWeapon.rangeModifiers.unarmedReach
  @Property({ nullable: true })
  rangeModifiersUnarmedReachModifier?: number;

  // Schema: combatAndWeapon.linkWeapon.restrictions
  @Property({ nullable: true })
  linkWeapon?: boolean;

  // Schema: combatAndWeapon.linkWeapon.weaponRequirements.reloadMethodList
  @Enum({ items: () => ammoSourceEnum, array: true, nullable: true })
  linkWeaponRequirementsReloadList?: Array<ammoSourceEnum>;

  // Schema: combatAndWeapon.linkWeapon.weaponRequirements.disallowedWeaponList
  @ManyToMany({
    entity: () => Weapons,
    owner: true,
    joinColumn: "bonus_link_weapon_id",
  })
  linkWeaponWeaponList = new Collection<Weapons>(this);

  // Schema: combatAndWeapon.defenseTestModifier
  @Property({ type: "json", nullable: true })
  defenseTestModifier?: RatingCalculationType;

  // Schema: combatAndWeapon.linkArmour
  @Property({ nullable: true })
  linkArmour?: true;

  // Schema: combatAndWeapon.armourModifiers
  @Property({ type: "json", nullable: true })
  armourModifiers?: ArmourBonusType;

  // Schema: combatAndWeapon.damageResistanceModifiers
  @Property({ type: "json", nullable: true })
  damageResistanceModifiers?: DamageResistanceBonusType;

  // Schema: combatAndWeapon.toxinAndPathogen
  @Property({ type: "json", nullable: true })
  toxinAndPathogen?: ToxinAndPathogenBonusType;

  // ------------------------------------------------
  // --- condition and recovery category (no FKs) ---
  // ------------------------------------------------
  // Schema: conditionAndRecovery
  @Property({ type: "json", nullable: true })
  conditionAndRecovery?: BonusConditionAndRecoveryOptionType;

  // ---------------------------------------
  // --- movement and lifestyle category ---
  // ---------------------------------------
  // Schema: movementAndLifestyle
  @Property({ type: "json", nullable: true })
  movementAndLifestyle?: Omit<
    BonusMovementAndLifestyleOptionType,
    "lifestyleCostModifierList"
  >;

  // Schema: movementAndLifestyle.lifestyleCostModifierList
  @OneToMany(() => BonusLifestyleCostModifiers, (m) => m.bonus)
  lifestyleCostModifierList = new Collection<BonusLifestyleCostModifiers>(this);

  // ---------------------------------------------
  // --- test and resistance category (no FKs) ---
  // ---------------------------------------------
  // Schema: testAndResistance
  @Property({ type: "json", nullable: true })
  testAndResistance?: BonusTestAndResistanceOptionType;

  // ------------------------------------
  // --- initiative category (no FKs) ---
  // ------------------------------------
  // Schema: initiative
  @Property({ type: "json", nullable: true })
  initiative?: BonusInitiativeOptionType;

  // ------------------------------------
  // --- gear and vehicle category ---
  // ------------------------------------
  // Schema: gearAndVehicle
  @Property({ type: "json", nullable: true })
  gearAndVehicle?: Omit<BonusGearAndVehicleOptionType, "addGear">;

  // Schema: gearAndVehicle.addGear.name
  @ManyToOne({ entity: () => Gears, ref: true, nullable: true })
  addGear?: Ref<Gears>;

  @Enum({ items: () => gearCategoryEnum, nullable: true })
  addGearCategory?: gearCategoryEnum;

  @Property({ nullable: true })
  addGearRating?: number;

  // Schema: gearAndVehicle.addGear.includedGearList
  @OneToMany(() => BonusAddedGearIncludes, (m) => m.bonus)
  addGearIncludedGearList = new Collection<BonusAddedGearIncludes>(this);

  // -----------------------------------------
  // --- essence and augmentation category ---
  // -----------------------------------------
  // Schema: essenceAndAugmentation
  @Property({ type: "json", nullable: true })
  essenceAndAugmentation?: Omit<
    BonusEssenceAndAugmentationType,
    "addAugmentation"
  >;

  // Schema: essenceAndAugmentation.addAugmentation.name
  @ManyToOne({ entity: () => Augmentations, ref: true, nullable: true })
  addAugmentation?: Ref<Augmentations>;

  @Enum({ items: () => augmentationGradeEnum, nullable: true })
  addAugmentationGrade?: augmentationGradeEnum;

  @Enum({ items: () => augmentationCategoryEnum, nullable: true })
  addAugmentationCategory?: augmentationCategoryEnum;

  // ------------------------------------------------
  // --- contact and reputation category (no FKs) ---
  // ------------------------------------------------
  // Schema: contactAndReputation
  @Property({ type: "json", nullable: true })
  contactAndReputation?: BonusContactAndReputationType;

  // ------------------------
  // --- quality category ---
  // ------------------------

  // Schema: quality.selectQualityFromList.bonusQualityList
  @ManyToMany({
    entity: () => Qualities,
    owner: true,
    joinColumn: "bonus_select_bonus_quality_id",
  })
  selectBonusQualityList = new Collection<Qualities>(this);

  // Schema: quality.selectQualityFromList.reducedBonusQualityList
  @OneToMany(() => BonusReducedQualities, (m) => m.bonus)
  reducedBonusQualityList = new Collection<BonusReducedQualities>(this);

  // Schema: quality.addQualityList
  @OneToMany(() => BonusAddedQualities, (m) => m.bonus)
  addQualityList = new Collection<BonusAddedQualities>(this);

  // Schema: quality.freeQuality
  @ManyToOne({ entity: () => Qualities, ref: true, nullable: true })
  freeQuality?: Ref<Qualities>;

  // Schema: quality.metagenicLimitIncrease
  @Property({ nullable: true })
  metagenicLimitIncrease?: number;

  // Schema: quality.disableQualityList
  @ManyToMany({
    entity: () => Qualities,
    owner: true,
    joinColumn: "bonus_disable_quality_id",
  })
  disableQualityList = new Collection<Qualities>(this);

  // -------------------------------------------------------------
  // --- specificQuality category (no FKs, all booleans/enums) ---
  // -------------------------------------------------------------
  // Schema: specificQuality
  @Property({ type: "json", nullable: true })
  specificQuality?: BonusSpecificQualityType;

  // ---------------------------------------
  // --- miscellaneous category (no FKs) ---
  // ---------------------------------------
  // Schema: miscellaneous
  @Property({ type: "json", nullable: true })
  miscellaneous?: BonusMiscellaneousOptionType;

  constructor(dto: BonusType) {
    // attribute
    if (dto.attribute !== undefined) this.attribute = dto.attribute;
    // skill (non-Schema parts)
    if (dto.skill !== undefined) {
      const {
        skillIncreaseList: _a,
        skillIncreaseForAttributeList: _b,
        skillGroupList: _c,
        unlockSkillList: _d,
        swapSkillAttribute: _e,
        swapSkillSpecialisationAttribute: _f,
        blockSkillGroupAndDefaulting: _g,
        addSkillSpecialisation: _h,
        ...skillRest
      } = dto.skill;
      if (Object.keys(skillRest).length > 0) this.skill = skillRest;
    }
    // power (non-Schema)
    if (dto.power?.bonusAdeptPowerPoints !== undefined)
      this.bonusAdeptPowerPoints = dto.power.bonusAdeptPowerPoints;
    if (dto.power?.selectPower !== undefined) {
      const { limitedPowerList: _lp, ...selectPowerRest } =
        dto.power.selectPower;
      if (Object.keys(selectPowerRest).length > 0)
        this.selectPower = selectPowerRest;
    }
    if (
      dto.power?.unlockOptionalCritterPowerList?.selectOptionalPowerCount !==
      undefined
    ) {
      this.unlockOptionalPowerConfig =
        dto.power.unlockOptionalCritterPowerList.selectOptionalPowerCount;
    }
    if (dto.power?.unlockCritterPowerCategory !== undefined)
      this.unlockCritterPowerCategory = dto.power.unlockCritterPowerCategory;
    // spellAndMagic
    if (dto.spellAndMagic !== undefined) {
      const sm = dto.spellAndMagic;
      if (sm.linkMentorSpirit !== undefined)
        this.linkMentorSpirit = sm.linkMentorSpirit;
      if (sm.linkParagon !== undefined) this.linkParagon = sm.linkParagon;
      if (sm.linkTradition !== undefined) this.linkTradition = sm.linkTradition;
      if (sm.linkSprite !== undefined) this.linkSprite = sm.linkSprite;
      if (sm.drainModification !== undefined)
        this.drainModification = sm.drainModification;
      if (sm.addSpell?.alchemical !== undefined)
        this.addSpellAlchemical = sm.addSpell.alchemical;
      if (sm.linkSpell !== undefined) this.linkSpell = sm.linkSpell;
      if (sm.freeSpellOngoingBonus !== undefined)
        this.freeSpellOngoingBonus = sm.freeSpellOngoingBonus;
      if (sm.limitSpellOptionsToCategoryList !== undefined)
        this.limitSpellOptionsToCategoryList =
          sm.limitSpellOptionsToCategoryList;
      if (sm.limitSpiritOptionsToList !== undefined)
        this.limitSpiritOptionsToList = sm.limitSpiritOptionsToList;
      if (sm.unlockSpellList !== undefined)
        this.unlockSpellList = sm.unlockSpellList;
      if (sm.spellModifiers !== undefined)
        this.spellModifiers = sm.spellModifiers;
      if (sm.blockSpellDescriptorList !== undefined)
        this.blockSpellDescriptorList = sm.blockSpellDescriptorList;
      if (sm.penaltyFreeSustainCount !== undefined)
        this.penaltyFreeSustainCount = sm.penaltyFreeSustainCount;
      if (sm.newSpellKarmaCostModification !== undefined)
        this.newSpellKarmaCostModification = sm.newSpellKarmaCostModification;
      if (sm.focusBindingKarmaCostModificationList !== undefined)
        this.focusBindingKarmaCostModificationList =
          sm.focusBindingKarmaCostModificationList;
      if (sm.livingPersonaModification !== undefined)
        this.livingPersonaModification = sm.livingPersonaModification;
      if (
        sm.resonanceLossDueToAugmentationModificationPercentageIncrease !==
        undefined
      )
        this.resonanceLossDueToAugmentationModificationPercentageIncrease =
          sm.resonanceLossDueToAugmentationModificationPercentageIncrease;
    }
    // combatAndWeapon (non-FK parts set here; FK parts in linkBonusEntity)
    if (dto.combatAndWeapon !== undefined) {
      const cw = dto.combatAndWeapon;
      if (cw.unarmedDamageType !== undefined)
        this.unarmedDamageType = cw.unarmedDamageType;
      if (cw.defenseTestModifier !== undefined)
        this.defenseTestModifier = cw.defenseTestModifier;
      if (cw.linkArmour !== undefined) this.linkArmour = cw.linkArmour;
      if (cw.armourModifiers !== undefined)
        this.armourModifiers = cw.armourModifiers;
      if (cw.damageResistanceModifiers !== undefined)
        this.damageResistanceModifiers = cw.damageResistanceModifiers;
      if (cw.toxinAndPathogen !== undefined)
        this.toxinAndPathogen = cw.toxinAndPathogen;
      // attackModifiers (non-FK sub-fields)
      if (cw.attackModifiers !== undefined) {
        if (cw.attackModifiers.weaponCategoryDicePoolModifier !== undefined)
          this.weaponCategoryDicePoolModifier =
            cw.attackModifiers.weaponCategoryDicePoolModifier;
        if (
          cw.attackModifiers.weaponClassificationDicePoolModifier !== undefined
        )
          this.weaponClassificationDicePoolModifier =
            cw.attackModifiers.weaponClassificationDicePoolModifier;
        if (cw.attackModifiers.smartLinkModifier !== undefined)
          this.smartLinkModifier = cw.attackModifiers.smartLinkModifier;
        if (cw.attackModifiers.unarmedModifier !== undefined)
          this.unarmedAttackModifier = cw.attackModifiers.unarmedModifier;
        // weaponLimitModifier and weaponSkillAccuracyList are FK-based → linkBonusEntity
      }
      // damageValueModifiers (non-FK sub-fields)
      if (cw.damageValueModifiers !== undefined) {
        if (cw.damageValueModifiers.thrownWeaponModifier !== undefined)
          this.thrownWeaponDamageModifier =
            cw.damageValueModifiers.thrownWeaponModifier;
        if (cw.damageValueModifiers.unarmedModifier !== undefined)
          this.unarmedDamageModifier = cw.damageValueModifiers.unarmedModifier;
        if (cw.damageValueModifiers.weaponSkillDamage !== undefined)
          this.weaponSkillDamageModifier =
            cw.damageValueModifiers.weaponSkillDamage.modifier;
        // weaponSkillDamage.selectionOptions is FK-based → linkBonusEntity
      }
      // rangeModifiers (non-FK sub-fields)
      if (cw.rangeModifiers !== undefined) {
        if (cw.rangeModifiers.thrownWeaponRangeModifier !== undefined)
          this.rangeModifiersThrownWeaponRangeModifier =
            cw.rangeModifiers.thrownWeaponRangeModifier;
        if (cw.rangeModifiers.reach !== undefined) {
          this.rangeModifiersReachModifier = cw.rangeModifiers.reach.modifier;
          // reach.weaponName is FK-based → linkBonusEntity
        }
        if (cw.rangeModifiers.unarmedReach !== undefined)
          this.rangeModifiersUnarmedReachModifier =
            cw.rangeModifiers.unarmedReach;
      }
      // linkWeapon (non-FK parts)
      if (cw.linkWeapon !== undefined) {
        this.linkWeapon = cw.linkWeapon.restrictions;
        if (
          cw.linkWeapon.restrictions === true &&
          cw.linkWeapon.weaponRequirements?.reloadMethodList !== undefined
        ) {
          this.linkWeaponRequirementsReloadList =
            cw.linkWeapon.weaponRequirements.reloadMethodList;
          // disallowedWeaponList is FK-based → linkBonusEntity
        }
      }
      // addWeaponList: natural weapons stored as JSON, named weapons as FK → linkBonusEntity
      if (cw.addWeaponList !== undefined) {
        const naturalWeapons = cw.addWeaponList
          .filter(
            (w): w is { naturalWeapon: NaturalWeaponType } =>
              "naturalWeapon" in w
          )
          .map((w) => w.naturalWeapon);
        if (naturalWeapons.length > 0)
          this.addNaturalWeaponList = naturalWeapons;
      }
    }
    // conditionAndRecovery
    if (dto.conditionAndRecovery !== undefined)
      this.conditionAndRecovery = dto.conditionAndRecovery;
    // movementAndLifestyle (non-Schema)
    if (dto.movementAndLifestyle !== undefined) {
      const { lifestyleCostModifierList: _lcm, ...mlRest } =
        dto.movementAndLifestyle;
      if (Object.keys(mlRest).length > 0) this.movementAndLifestyle = mlRest;
    }
    // testAndResistance
    if (dto.testAndResistance !== undefined)
      this.testAndResistance = dto.testAndResistance;
    // initiative
    if (dto.initiative !== undefined) this.initiative = dto.initiative;
    // gearAndVehicle (non-Schema)
    if (dto.gearAndVehicle !== undefined) {
      const { addGear: _ag, ...gvRest } = dto.gearAndVehicle;
      if (Object.keys(gvRest).length > 0) this.gearAndVehicle = gvRest;
      if (_ag !== undefined) {
        this.addGearCategory = _ag.category;
        if (_ag.rating !== undefined) this.addGearRating = _ag.rating;
      }
    }
    // essenceAndAugmentation (non-Schema)
    if (dto.essenceAndAugmentation !== undefined) {
      const { addAugmentation: _aa, ...eaRest } = dto.essenceAndAugmentation;
      if (Object.keys(eaRest).length > 0) this.essenceAndAugmentation = eaRest;
      if (_aa !== undefined) {
        this.addAugmentationGrade = _aa.grade;
        this.addAugmentationCategory = _aa.category;
      }
    }
    // contactAndReputation
    if (dto.contactAndReputation !== undefined)
      this.contactAndReputation = dto.contactAndReputation;
    // quality (non-Schema)
    if (dto.quality?.metagenicLimitIncrease !== undefined)
      this.metagenicLimitIncrease = dto.quality.metagenicLimitIncrease;
    // specificQuality
    if (dto.specificQuality !== undefined)
      this.specificQuality = dto.specificQuality;
    // miscellaneous
    if (dto.miscellaneous !== undefined) this.miscellaneous = dto.miscellaneous;
  }
}

// ============================================================
// STI Subclasses (one per owner entity type)
// ============================================================

@Entity({ discriminatorValue: "Quality" })
export class QualityBonuses extends Bonuses {
  @OneToOne(() => Qualities, (quality) => quality.bonus, { ref: true })
  quality!: Ref<Qualities>;

  constructor(quality: Ref<Qualities>, dto: BonusType) {
    super(dto);
    this.quality = quality;
  }
}

@Entity({ discriminatorValue: "Heritage" })
export class HeritagesBonuses extends Bonuses {
  @OneToOne(() => Heritages, (heritage) => heritage.bonus, { ref: true })
  heritage!: Ref<Heritages>;

  constructor(heritage: Ref<Heritages>, dto: BonusType) {
    super(dto);
    this.heritage = heritage;
  }
}

@Entity({ discriminatorValue: "Critter" })
export class CrittersBonuses extends Bonuses {
  @OneToOne(() => Critters, (critter) => critter.bonus, { ref: true })
  critter!: Ref<Critters>;

  constructor(critter: Ref<Critters>, dto: BonusType) {
    super(dto);
    this.critter = critter;
  }
}

@Entity({ discriminatorValue: "Augmentation" })
export class AugmentationsBonuses extends Bonuses {
  @OneToOne(() => Augmentations, (aug) => aug.bonus, { ref: true })
  augmentation!: Ref<Augmentations>;

  constructor(augmentation: Ref<Augmentations>, dto: BonusType) {
    super(dto);
    this.augmentation = augmentation;
  }
}

@Entity({ discriminatorValue: "Drug" })
export class DrugsBonuses extends Bonuses {
  @OneToOne(() => Drugs, (drug) => drug.bonus, { ref: true })
  drug!: Ref<Drugs>;

  constructor(drug: Ref<Drugs>, dto: BonusType) {
    super(dto);
    this.drug = drug;
  }
}

@Entity({ discriminatorValue: "Gear" })
export class GearsBonuses extends Bonuses {
  @OneToOne(() => Gears, (gear) => gear.bonus, { ref: true })
  gear!: Ref<Gears>;

  constructor(gear: Ref<Gears>, dto: BonusType) {
    super(dto);
    this.gear = gear;
  }
}

@Entity({ discriminatorValue: "Armour" })
export class ArmoursBonuses extends Bonuses {
  @OneToOne(() => Armours, (armour) => armour.bonus, { ref: true })
  armour!: Ref<Armours>;

  constructor(armour: Ref<Armours>, dto: BonusType) {
    super(dto);
    this.armour = armour;
  }
}

@Entity({ discriminatorValue: "ArmourModification" })
export class ArmourModificationsBonuses extends Bonuses {
  @OneToOne(() => ArmourModifications, (am) => am.bonus, { ref: true })
  armourModification!: Ref<ArmourModifications>;

  constructor(armourModification: Ref<ArmourModifications>, dto: BonusType) {
    super(dto);
    this.armourModification = armourModification;
  }
}

@Entity({ discriminatorValue: "VehicleModification" })
export class VehicleModificationsBonuses extends Bonuses {
  @OneToOne(() => VehicleModifications, (vm) => vm.bonus, { ref: true })
  vehicleModification!: Ref<VehicleModifications>;

  constructor(vehicleModification: Ref<VehicleModifications>, dto: BonusType) {
    super(dto);
    this.vehicleModification = vehicleModification;
  }
}

@Entity({ discriminatorValue: "Spell" })
export class SpellsBonuses extends Bonuses {
  @OneToOne(() => Spells, (spell) => spell.bonus, { ref: true })
  spell!: Ref<Spells>;

  constructor(spell: Ref<Spells>, dto: BonusType) {
    super(dto);
    this.spell = spell;
  }
}

@Entity({ discriminatorValue: "AdeptPower" })
export class AdeptPowersBonuses extends Bonuses {
  @OneToOne(() => AdeptPowers, (ap) => ap.bonus, { ref: true })
  adeptPower!: Ref<AdeptPowers>;

  constructor(adeptPower: Ref<AdeptPowers>, dto: BonusType) {
    super(dto);
    this.adeptPower = adeptPower;
  }
}

@Entity({ discriminatorValue: "ComplexForm" })
export class ComplexFormsBonuses extends Bonuses {
  @OneToOne(() => ComplexForms, (cf) => cf.bonus, { ref: true })
  complexForm!: Ref<ComplexForms>;

  constructor(complexForm: Ref<ComplexForms>, dto: BonusType) {
    super(dto);
    this.complexForm = complexForm;
  }
}

@Entity({ discriminatorValue: "Program" })
export class ProgramsBonuses extends Bonuses {
  @OneToOne(() => Programs, (p) => p.bonus, { ref: true })
  program!: Ref<Programs>;

  constructor(program: Ref<Programs>, dto: BonusType) {
    super(dto);
    this.program = program;
  }
}

@Entity({ discriminatorValue: "CritterPower" })
export class CritterPowersBonuses extends Bonuses {
  @OneToOne(() => CritterPowers, (cp) => cp.bonus, { ref: true })
  critterPower!: Ref<CritterPowers>;

  constructor(critterPower: Ref<CritterPowers>, dto: BonusType) {
    super(dto);
    this.critterPower = critterPower;
  }
}

@Entity({ discriminatorValue: "Tradition" })
export class TraditionsBonuses extends Bonuses {
  @OneToOne(() => Traditions, (t) => t.bonus, { ref: true })
  tradition!: Ref<Traditions>;

  constructor(tradition: Ref<Traditions>, dto: BonusType) {
    super(dto);
    this.tradition = tradition;
  }
}

@Entity({ discriminatorValue: "Mentor" })
export class MentorsBonuses extends Bonuses {
  @OneToOne(() => Mentors, (m) => m.bonus, { ref: true })
  mentor!: Ref<Mentors>;

  constructor(mentor: Ref<Mentors>, dto: BonusType) {
    super(dto);
    this.mentor = mentor;
  }
}

@Entity({ discriminatorValue: "MartialArt" })
export class MartialArtsBonuses extends Bonuses {
  @OneToOne(() => MartialArts, (ma) => ma.bonus, { ref: true })
  martialArt!: Ref<MartialArts>;

  constructor(martialArt: Ref<MartialArts>, dto: BonusType) {
    super(dto);
    this.martialArt = martialArt;
  }
}

@Entity({ discriminatorValue: "MartialArtTechnique" })
export class MartialArtTechniquesBonuses extends Bonuses {
  @OneToOne(() => MartialArtTechniques, (mat) => mat.bonus, { ref: true })
  martialArtTechnique!: Ref<MartialArtTechniques>;

  constructor(martialArtTechnique: Ref<MartialArtTechniques>, dto: BonusType) {
    super(dto);
    this.martialArtTechnique = martialArtTechnique;
  }
}

@Entity({ discriminatorValue: "Lifestyle" })
export class LifestylesBonuses extends Bonuses {
  @OneToOne(() => Lifestyles, (l) => l.bonus, { ref: true })
  lifestyle!: Ref<Lifestyles>;

  constructor(lifestyle: Ref<Lifestyles>, dto: BonusType) {
    super(dto);
    this.lifestyle = lifestyle;
  }
}

@Entity({ discriminatorValue: "LifestyleQuality" })
export class LifestyleQualitiesBonuses extends Bonuses {
  @OneToOne(() => LifestyleQualities, (lq) => lq.bonus, { ref: true })
  lifestyleQuality!: Ref<LifestyleQualities>;

  constructor(lifestyleQuality: Ref<LifestyleQualities>, dto: BonusType) {
    super(dto);
    this.lifestyleQuality = lifestyleQuality;
  }
}

@Entity({ discriminatorValue: "Metamagic" })
export class MetamagicsBonuses extends Bonuses {
  @OneToOne(() => Metamagics, (mm) => mm.bonus, { ref: true })
  metamagic!: Ref<Metamagics>;

  constructor(metamagic: Ref<Metamagics>, dto: BonusType) {
    super(dto);
    this.metamagic = metamagic;
  }
}

@Entity({ discriminatorValue: "Echo" })
export class EchoesBonuses extends Bonuses {
  @OneToOne(() => Echoes, (e) => e.bonus, { ref: true })
  echo!: Ref<Echoes>;

  constructor(echo: Ref<Echoes>, dto: BonusType) {
    super(dto);
    this.echo = echo;
  }
}
