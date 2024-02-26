import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
  OneToMany,
} from "@mikro-orm/postgresql";
import { metatypeCategoryEnum } from "@neon-codex/common/build/enums.js";
import type {
  AttributeRangeType,
  MetatypeType,
  MovementStrideType,
} from "@neon-codex/common/build/schemas/abilities/metatypeSchemas.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import type {
  BonusType,
  InitiativeType,
} from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import { Qualities } from "./qualityModel.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Metatypes {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => metatypeCategoryEnum)
  type!: metatypeCategoryEnum;

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

  @ManyToMany({ entity: () => Qualities, owner: true, joinColumn: "join_id" })
  includedQualityList = new Collection<Qualities>(this);

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

  constructor(dto: MetatypeType) {
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

@Entity({ discriminatorValue: metatypeCategoryEnum.Metahuman })
export class Metahumans extends Metatypes {
  @OneToMany(() => Metavariants, (metavariant) => metavariant.baseSpecies)
  subSpecies = new Collection<Metavariants>(this);

  constructor(dto: MetatypeType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: metatypeCategoryEnum.Metavariant })
export class Metavariants extends Metatypes {
  @ManyToOne({ entity: () => Metahumans, ref: true, nullable: true })
  baseSpecies?: Ref<Metahumans>;

  constructor(dto: MetatypeType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: metatypeCategoryEnum.Metasapient })
export class Metasapients extends Metatypes {
  constructor(dto: MetatypeType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: metatypeCategoryEnum.Shapeshifter })
export class Shapeshifters extends Metatypes {
  constructor(dto: MetatypeType) {
    super(dto);
  }
}
