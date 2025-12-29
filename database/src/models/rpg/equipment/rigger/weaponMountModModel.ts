import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
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
import type { RequirementsType } from "@neon-codex/common";

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

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponMountModType;

  @Property({ type: "json" })
  cost!: CostWeaponMountModType;

  @Enum(() => sourceBookEnum)
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
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
