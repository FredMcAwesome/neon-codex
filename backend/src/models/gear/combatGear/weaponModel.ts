import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
  skillsEnum,
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  firearmWeaponTypeEnum,
  firearmModeEnum,
  projectileWeaponTypeEnum,
  explosiveTypeEnum,
} from "@shadowrun/common";
import type {
  AccuracyType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  DamageType,
  FirearmAmmoType,
  RecoilCompensationType,
  RatingType,
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
      meleeWeaponTypeEnum ||
      projectileWeaponTypeEnum ||
      firearmWeaponTypeEnum ||
      explosiveTypeEnum
  )
  subtype!:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum
    | explosiveTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  accuracy!: AccuracyType;

  @Property({ type: "json" })
  damage!: DamageType;

  @Property({ type: "json" })
  armourPenetration!: ArmourPenetrationType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json", nullable: true })
  rating?: RatingType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  @Property({ nullable: true })
  implantWeapon?: boolean;

  @Enum()
  relatedSkill!: skillsEnum;
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

  @Property({ type: "json" })
  recoilCompensation!: RecoilCompensationType;

  @Property({ type: "json" })
  ammo!: FirearmAmmoType[];
}

@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends Weapons {}
