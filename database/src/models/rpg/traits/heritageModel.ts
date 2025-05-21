import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  OneToMany,
  type Ref,
} from "@mikro-orm/postgresql";
import { heritageCategoryEnum } from "@neon-codex/common/build/enums.js";
import type { HeritageType } from "@neon-codex/common/build/schemas/abilities/heritageSchemas.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import type {
  BonusType,
  InitiativeType,
} from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import { Qualities } from "./qualityModel.js";
import {
  ActiveQualities,
  HeritageIncludedQualities,
} from "../activeTables/activeQualityModel.js";
import { Characters } from "../characters/characterModel.js";
import type {
  AttributeRangeType,
  MovementStrideType,
} from "@neon-codex/common/build/schemas/shared/commonSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Heritages {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  // Commented as some metavariants have the same name
  // @Unique()
  name!: string;

  @OneToMany(() => Characters, (character) => character.heritage)
  characters = new Collection<Characters>(this);

  @Enum(() => heritageCategoryEnum)
  type!: heritageCategoryEnum;

  @Property()
  pointBuyKarmaCost!: number;

  @Property({ nullable: true })
  halveAttributePoints?: true;

  @Property({ type: "json" })
  bodyAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  agilityAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  reactionAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  strengthAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  charismaAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  intuitionAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  logicAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  willpowerAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  initiativeAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  edgeAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  magicAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  resonanceAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  essenceAttributeRange!: AttributeRangeType;

  @Property({ type: "json" })
  depthAttributeRange!: AttributeRangeType;

  @Property({ type: "json", nullable: true })
  initiative?: InitiativeType;

  @Property({ nullable: true })
  nonStandardMovement?: true;

  @Property({ type: "json", nullable: true })
  movement?: MovementStrideType;

  @ManyToMany({ entity: () => Weapons, owner: true, joinColumn: "join_id" })
  includedWeaponList = new Collection<Weapons>(this);

  // @ManyToMany({ entity: () => Powers, owner: true, joinColumn: "join_id" })
  // includedPowerList = new Collection<Powers>(this);

  @OneToMany(() => HeritageIncludedQualities, (quality) => quality.heritage)
  includedQualityList = new Collection<HeritageIncludedQualities>(this);

  @ManyToMany({ entity: () => Qualities, owner: true, joinColumn: "join_id" })
  forbiddenQualityList = new Collection<Qualities>(this);

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: HeritageType) {
    this.name = dto.name;
    // if (dto.priorityKarmaCost !== undefined) {
    //   this.priorityKarmaCost = dto.priorityKarmaCost;
    // }
    if (dto.halveAttributePoints !== undefined) {
      this.halveAttributePoints = dto.halveAttributePoints;
    }
    this.pointBuyKarmaCost = dto.pointBuyKarmaCost;
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
    if (dto.initiative !== undefined) {
      this.initiative = dto.initiative;
    }
    if (dto.nonStandardMovement !== undefined) {
      this.nonStandardMovement = dto.nonStandardMovement;
    }
    if (dto.movement !== undefined) {
      this.movement = dto.movement;
    }
    // if (dto.addWeaponList !== undefined) {
    //   this.addWeaponList = dto.addWeaponList;
    // }
    // if (dto.addPowerList !== undefined) {
    //   this.addPowerList = dto.addPowerList;
    // }
    // if (dto.addQualityList !== undefined) {
    //   this.addQualityList = dto.addQualityList;
    // }
    // if (dto.forbiddenQualityList !== undefined) {
    //   this.forbiddenQualityList = dto.forbiddenQualityList;
    // }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

type BaseHeritagesType = HeritageType &
  (
    | { category: heritageCategoryEnum.Metahuman }
    | { category: heritageCategoryEnum.Metasapient }
    | { category: heritageCategoryEnum.Shapeshifter }
  );

@Entity()
export abstract class BaseHeritages extends Heritages {
  @OneToMany(() => Metavariants, (metavariant) => metavariant.baseHeritage)
  variantHeritages = new Collection<Metavariants>(this);

  constructor(dto: BaseHeritagesType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: heritageCategoryEnum.Metahuman })
export class Metahumans extends BaseHeritages {
  constructor(dto: BaseHeritagesType) {
    super(dto);
  }
}

@Entity({ discriminatorValue: heritageCategoryEnum.Metasapient })
export class Metasapients extends BaseHeritages {
  constructor(dto: BaseHeritagesType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: heritageCategoryEnum.Shapeshifter })
export class Shapeshifters extends BaseHeritages {
  constructor(dto: BaseHeritagesType) {
    super(dto);
  }
}

type MetavariantType = {
  heritage: HeritageType & { category: heritageCategoryEnum.Metavariant };
  baseHeritage: Ref<BaseHeritages>;
};

@Entity({ discriminatorValue: heritageCategoryEnum.Metavariant })
export class Metavariants extends Heritages {
  @ManyToOne({
    entity: () => BaseHeritages,
    ref: true,
  })
  baseHeritage!: Ref<BaseHeritages>;

  constructor(dto: MetavariantType) {
    super(dto.heritage);
    this.baseHeritage = dto.baseHeritage;
  }
}
