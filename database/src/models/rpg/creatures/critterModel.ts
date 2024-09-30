import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import {
  critterTypeEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  CritterAttributeRangeType,
  CritterType,
} from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { MovementStrideType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import { CritterIncludedQualities } from "../activeTables/activeQualityModel.js";
import { CritterIncludedAugmentations } from "../activeTables/activeAugmentationModel.js";
import { IncludedCritterPowers } from "../activeTables/activeCritterPowerModel.js";
import { CritterIncludedComplexForms } from "../activeTables/activeComplexFormModel.js";
import { CritterIncludedSkills } from "../activeTables/activeSkillModel.js";
import { CritterIncludedSkillGroups } from "../activeTables/activeSkillGroupModel.js";
import { CritterIncludedKnowledgeSkills } from "../activeTables/activeKnowledgeSkillModel.js";
import { ActiveMagicTalents } from "../activeTables/activeTalentModel.js";

@Entity()
export class Critters {
  @PrimaryKey()
  id!: number;

  // Not unique as there can be multiple versions
  // with the same name
  @Property({ length: 255 })
  name!: string;

  @Enum(() => critterTypeEnum)
  type!: critterTypeEnum;

  @Property({ type: "json" })
  bodyAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  agilityAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  reactionAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  strengthAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  charismaAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  intuitionAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  logicAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  willpowerAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  initiativeAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  edgeAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  magicAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  resonanceAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  essenceAttributeRange!: CritterAttributeRangeType;
  @Property({ type: "json" })
  depthAttributeRange!: CritterAttributeRangeType;

  nonStandardMovement?: true;
  movement?: MovementStrideType;

  @OneToMany(
    () => IncludedCritterPowers,
    (includedCritterPower) => includedCritterPower.standardCritter
  )
  includedPowerList = new Collection<IncludedCritterPowers>(this);

  @OneToMany(
    () => IncludedCritterPowers,
    (includedCritterPower) => includedCritterPower.standardCritter
  )
  optionalPowerList = new Collection<IncludedCritterPowers>(this);

  @OneToMany(
    () => CritterIncludedQualities,
    (includedQuality) => includedQuality.standardCritter
  )
  includedQualityList = new Collection<CritterIncludedQualities>(this);

  @OneToMany(
    () => CritterIncludedAugmentations,
    (includedBioware) => includedBioware.standardCritter
  )
  includedBiowareList = new Collection<CritterIncludedAugmentations>(this);

  @OneToMany(
    () => CritterIncludedComplexForms,
    (complexForm) => complexForm.standardCritter
  )
  includedComplexFormList = new Collection<CritterIncludedComplexForms>(this);

  @OneToMany(
    () => CritterIncludedSkills,
    (includedSkill) => includedSkill.standardCritter
  )
  includedSkillList = new Collection<CritterIncludedSkills>(this);

  @OneToMany(
    () => CritterIncludedSkillGroups,
    (includedSkillGroup) => includedSkillGroup.standardCritter
  )
  includedSkillGroupList = new Collection<CritterIncludedSkillGroups>(this);

  @OneToMany(
    () => CritterIncludedKnowledgeSkills,
    (includedKnowledgeSkill) => includedKnowledgeSkill.standardCritter
  )
  includedKnowledgeSkillList = new Collection<CritterIncludedKnowledgeSkills>(
    this
  );

  @OneToMany(() => ActiveMagicTalents, (talent) => talent.combatSpirit)
  customCombatTalent = new Collection<ActiveMagicTalents>(this);
  @OneToMany(() => ActiveMagicTalents, (talent) => talent.detectionSpirit)
  customDetectionTalent = new Collection<ActiveMagicTalents>(this);
  @OneToMany(() => ActiveMagicTalents, (talent) => talent.healthSpirit)
  customHealthTalent = new Collection<ActiveMagicTalents>(this);
  @OneToMany(() => ActiveMagicTalents, (talent) => talent.illusionSpirit)
  customIllusionTalent = new Collection<ActiveMagicTalents>(this);
  @OneToMany(() => ActiveMagicTalents, (talent) => talent.manipulationSpirit)
  customManipulationTalent = new Collection<ActiveMagicTalents>(this);

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: CritterType) {
    this.name = dto.name;

    this.type = dto.category;
    this.bodyAttributeRange = dto.bodyAttributeRange;
    this.agilityAttributeRange = dto.agilityAttributeRange;
    this.reactionAttributeRange = dto.reactionAttributeRange;
    this.strengthAttributeRange = dto.strengthAttributeRange;
    this.charismaAttributeRange = dto.charismaAttributeRange;
    this.intuitionAttributeRange = dto.intuitionAttributeRange;
    this.logicAttributeRange = dto.logicAttributeRange;
    this.willpowerAttributeRange = dto.willpowerAttributeRange;
    this.initiativeAttributeRange = dto.initiativeAttributeRange;
    this.edgeAttributeRange = dto.edgeAttributeRange;
    this.magicAttributeRange = dto.magicAttributeRange;
    this.resonanceAttributeRange = dto.resonanceAttributeRange;
    this.essenceAttributeRange = dto.essenceAttributeRange;
    this.depthAttributeRange = dto.depthAttributeRange;
    if (dto.nonStandardMovement !== undefined) {
      this.nonStandardMovement = dto.nonStandardMovement;
    }
    if (dto.movement !== undefined) {
      this.movement = dto.movement;
    }
    // if (dto.addPowerList !== undefined) {
    //   this.addPowerList = dto.addPowerList;
    // }
    // if (dto.optionalPowerList !== undefined) {
    //   this.optionalPowerList = dto.optionalPowerList;
    // }
    // if (dto.addQualityList !== undefined) {
    //   this.addQualityList = dto.addQualityList;
    // }
    // if (dto.addBiowareList !== undefined) {
    //   this.addBiowareList = dto.addBiowareList;
    // }
    // if (dto.complexFormList !== undefined) {
    //   this.complexFormList = dto.complexFormList;
    // }
    // if (dto.skills !== undefined) {
    //   this.skills = dto.skills;
    // }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }

    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
