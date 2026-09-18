import {
  ArmourModificationRequirements,
  ArmourModificationForbidden,
} from "../../otherData/requirementsModel.js";
import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
  OneToOne,
  type Ref,
} from "@mikro-orm/postgresql";
import type {
  ArmourModType,
  AvailabilityArmourModType,
  CapacityArmourModType,
  CostArmourModType,
} from "@neon-codex/common";
import { armourModCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import { ArmourModificationIncludedGears } from "../../activeTables/activeGearModel.js";
import type { DamageReductionArmourType } from "@neon-codex/common";
import {
  ArmourModificationsBonuses,
  ArmourModificationsWirelessBonuses,
} from "../../otherData/bonusModel.js";

@Entity()
export class ArmourModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => armourModCategoryEnum })
  category!: armourModCategoryEnum;

  @Property()
  maxRating!: number;

  @Property({ type: "json" })
  damageReduction!: DamageReductionArmourType;

  @Property({ type: "json" })
  capacityCost!: CapacityArmourModType;

  @OneToOne(
    () => ArmourModificationRequirements,
    (req) => req.requirementArmourModification,
    { owner: true, nullable: true, ref: true }
  )
  requirements?: Ref<ArmourModificationRequirements>;

  @OneToOne(
    () => ArmourModificationForbidden,
    (req) => req.forbiddenArmourModification,
    { owner: true, nullable: true, ref: true }
  )
  forbidden?: Ref<ArmourModificationForbidden>;

  @OneToMany(
    () => ArmourModificationIncludedGears,
    (armourModIncludedGear) => armourModIncludedGear.armourModification
  )
  includedGearList = new Collection<ArmourModificationIncludedGears>(this);

  @OneToOne(
    () => ArmourModificationsBonuses,
    (bonus) => bonus.armourModification,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  bonus?: Ref<ArmourModificationsBonuses>;

  @OneToOne(
    () => ArmourModificationsWirelessBonuses,
    (bonus) => bonus.armourModification,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  wirelessBonus?: Ref<ArmourModificationsWirelessBonuses>;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityArmourModType;

  @Property({ type: "json" })
  cost!: CostArmourModType;

  @Enum({ items: () => sourceBookEnum })
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
    // if (dto.includedGearList !== undefined)
    //   this.includedGearList = dto.includedGearList;
    // requirements is linked by seeder
    // forbidden is linked by seeder
    // bonus is linked in seeder via ArmourModificationsBonuses
    // wirelessBonus is linked in seeder via ArmourModificationsWirelessBonuses
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
