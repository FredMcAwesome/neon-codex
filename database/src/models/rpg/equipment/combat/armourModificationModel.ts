import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import type {
  ArmourModType,
  AvailabilityArmourModType,
  CapacityArmourModType,
  CostArmourModType,
  HostArmourRequirementType,
} from "@neon-codex/common/build/schemas/armourModSchemas.js";
import {
  armourModCategoryEnum,
  sourceBookEnum,
} from "@neon-codex/common/build/enums.js";
import type { DamageReductionArmourType } from "@neon-codex/common/build/schemas/armourSchemas.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import { ArmourModificationIncludedGears } from "../../activeTables/activeGearModel.js";

@Entity()
export class ArmourModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => armourModCategoryEnum)
  category!: armourModCategoryEnum;

  @Property()
  maxRating!: number;

  @Property({ type: "json" })
  damageReduction!: DamageReductionArmourType;

  @Property({ type: "json" })
  capacityCost!: CapacityArmourModType;

  @Property({ type: "json", nullable: true })
  hostArmourRequirements?: HostArmourRequirementType;

  @OneToMany(
    () => ArmourModificationIncludedGears,
    (armourModIncludedGear) => armourModIncludedGear.armourModification
  )
  includedGearList = new Collection<ArmourModificationIncludedGears>(this);

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityArmourModType;

  @Property({ type: "json" })
  cost!: CostArmourModType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: ArmourModType) {
    this.name = dto.name;
    this.category = dto.category;
    this.maxRating = dto.maxRating;
    this.damageReduction = dto.damageReduction;
    this.capacityCost = dto.capacityCost;
    if (dto.hostArmourRequirements !== undefined)
      this.hostArmourRequirements = dto.hostArmourRequirements;
    // if (dto.includedGearList !== undefined)
    //   this.includedGearList = dto.includedGearList;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.wirelessBonus !== undefined) this.wirelessBonus = dto.wirelessBonus;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
    // if (dto.wireless !== undefined) this.wireless = dto.wireless;
  }
}
