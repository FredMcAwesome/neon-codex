import { Entity, Enum, PrimaryKey } from "@mikro-orm/postgresql";
import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@neon-codex/common";
import type { WeaponMountType } from "@neon-codex/common";

// Each combination should only appear in the table once
// Whenever we create should check to see if combination exists
@Entity()
export class WeaponMounts {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => weaponMountControlEnum })
  control!: weaponMountControlEnum;

  @Enum({ items: () => weaponMountFlexibilityEnum })
  flexibility!: weaponMountFlexibilityEnum;

  @Enum({ items: () => weaponMountSizeEnum })
  size!: weaponMountSizeEnum;

  @Enum({ items: () => weaponMountVisibilityEnum })
  visibility!: weaponMountVisibilityEnum;

  constructor(dto: WeaponMountType) {
    this.control = dto.control;
    this.flexibility = dto.flexibility;
    this.size = dto.size;
    this.visibility = dto.visibility;
  }
}
