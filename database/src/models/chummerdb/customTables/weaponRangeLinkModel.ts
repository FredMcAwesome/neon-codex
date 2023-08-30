import { RangedWeapons } from "../../models.js";
import type { RangedWeapons as RangedWeaponType } from "../../models.js";
import { Entity, ManyToOne, PrimaryKey, ref } from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";
import { WeaponRanges } from "../../gear/combatGear/helperTables/weaponRangeModel.js";
import type { WeaponRanges as WeaponRangeType } from "../../gear/combatGear/helperTables/weaponRangeModel.js";

@Entity()
export class WeaponRangeLinks {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => WeaponRanges, ref: true })
  range: Ref<WeaponRanges>;

  @ManyToOne({ entity: () => RangedWeapons, ref: true })
  weapon: Ref<RangedWeapons>;

  constructor(range: WeaponRangeType, weapon: RangedWeaponType) {
    this.range = ref(WeaponRanges, range);
    this.weapon = ref(RangedWeapons, weapon);
  }
}
