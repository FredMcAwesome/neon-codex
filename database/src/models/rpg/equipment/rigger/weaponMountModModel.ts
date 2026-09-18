import { WeaponMountModRequirements } from "../../otherData/requirementsModel.js";
import {
  OneToOne,
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  sourceBookEnum,
  type vehicleModCategoryEnum,
} from "@neon-codex/common";
import type { ReplaceAmmoType } from "@neon-codex/common";
import type {
  AvailabilityWeaponMountModType,
  CostWeaponMountModType,
  WeaponMountModType,
  WeaponMountSlotCostType,
} from "@neon-codex/common";

@Entity()
export class WeaponMountModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ length: 5000 })
  description!: string;

  @Property()
  category!: vehicleModCategoryEnum;

  @Property({ type: "json" })
  slotCost!: WeaponMountSlotCostType;

  @Property({ nullable: true })
  additionalAmmo?: number;

  @Property({ nullable: true })
  percentageAmmoIncrease?: number;

  @Property({ type: "json", nullable: true })
  replaceAmmo?: ReplaceAmmoType;

  @OneToOne(
    () => WeaponMountModRequirements,
    (req) => req.requirementWeaponMountMod,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  requirements?: Ref<WeaponMountModRequirements>;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponMountModType;

  @Property({ type: "json" })
  cost!: CostWeaponMountModType;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  constructor(dto: WeaponMountModType) {
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    this.slotCost = dto.slotCost;
    if (dto.additionalAmmo !== undefined) {
      this.additionalAmmo = dto.additionalAmmo;
    }
    if (dto.percentageAmmoIncrease !== undefined) {
      this.percentageAmmoIncrease = dto.percentageAmmoIncrease;
    }
    if (dto.replaceAmmo !== undefined) {
      this.replaceAmmo = dto.replaceAmmo;
    }
    // requirements is linked by seeder
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
