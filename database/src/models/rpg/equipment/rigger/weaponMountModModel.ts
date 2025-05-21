import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import {
  sourceBookEnum,
  type vehicleModTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  ReplaceAmmoType,
  SlotCostType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import type {
  AvailabilityWeaponMountModType,
  CostWeaponMountModType,
  WeaponMountModType,
} from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountModSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";

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
  type!: vehicleModTypeEnum;

  @Property({ type: "json" })
  slotCost!: SlotCostType;

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
    this.type = dto.type;
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
