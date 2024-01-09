import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import type {
  ArmourModType,
  AvailabilityArmourModType,
  CapacityArmourModType,
  CostArmourModType,
  HostArmourRequirementType,
} from "@shadowrun/common/build/schemas/armourModSchemas.js";
import {
  armourModCategoryEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import type { DamageReductionArmourType } from "@shadowrun/common/build/schemas/armourSchemas.js";
import type { UseGearListType } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type { BonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type { ModListType } from "@shadowrun/common/build/schemas/shared/modSchemas.js";

@Entity()
export class ArmourModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
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

  @Property({ type: "json", nullable: true })
  includedGear?: UseGearListType;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  wirelessBonus?: BonusType;

  @Property({ type: "json", nullable: true })
  mods?: ModListType;

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
    if (dto.includedGear !== undefined) this.includedGear = dto.includedGear;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.wirelessBonus !== undefined) this.wirelessBonus = dto.wirelessBonus;
    if (dto.mods !== undefined) this.mods = dto.mods;
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
