import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  firearmWeaponTypeEnum,
  firearmModeEnum,
  projectileWeaponTypeEnum,
} from "@shadowrun/common";
import type {
  AccuracyType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  DamageType,
  FirearmAmmoType,
  RecoilCompensationType,
} from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Weapons {
  @PrimaryKey()
  id!: number;

  @Enum(() => weaponTypeEnum)
  type!: weaponTypeEnum;

  @Enum(
    () =>
      meleeWeaponTypeEnum || projectileWeaponTypeEnum || firearmWeaponTypeEnum
  )
  subtype!:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum;

  @Property()
  name!: string;

  @Property()
  accuracy!: AccuracyType;

  @Property()
  damage!: DamageType;

  @Property()
  armourPenetration!: ArmourPenetrationType;

  @Property()
  availability!: AvailabilityType;

  @Property()
  cost!: CostType;
}

@Entity({ discriminatorValue: weaponTypeEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Property({ nullable: true })
  reach?: number;
}

@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends Weapons {}

@Entity({ discriminatorValue: weaponTypeEnum.Firearm })
export class FirearmWeapons extends Weapons {
  @Enum({ items: () => firearmModeEnum, array: true })
  mode!: firearmModeEnum[];

  @Property()
  recoilCompensation!: RecoilCompensationType;

  @Property({ type: "json" })
  ammo!: FirearmAmmoType[];
}
