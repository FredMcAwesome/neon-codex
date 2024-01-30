import { Entity, Enum, PrimaryKey } from "@mikro-orm/postgresql";
import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@shadowrun/common/build/enums.js";
import type { WeaponMountType } from "@shadowrun/common/build/schemas/vehicleSchemas.js";

// Each combination should only appear in the table once
// Whenever we create should check to see if combination exists
@Entity()
export class WeaponMounts {
  @PrimaryKey()
  id!: number;

  @Enum(() => weaponMountControlEnum)
  control!: weaponMountControlEnum;

  @Enum(() => weaponMountFlexibilityEnum)
  flexibility!: weaponMountFlexibilityEnum;

  @Enum(() => weaponMountSizeEnum)
  size!: weaponMountSizeEnum;

  @Enum(() => weaponMountVisibilityEnum)
  visibility!: weaponMountVisibilityEnum;

  constructor(dto: WeaponMountType) {
    this.control = dto.control;
    this.flexibility = dto.flexibility;
    this.size = dto.size;
    this.visibility = dto.visibility;
  }
}
