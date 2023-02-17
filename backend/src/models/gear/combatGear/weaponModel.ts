import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
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
} from "@shadowrun/common";
import {
  augmentationTypeEnum,
  gearCategoryEnum,
} from "@shadowrun/common/src/enums.js";
import type {
  AccessoryType,
  AmmunitionType,
  ModeType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Weapons {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => weaponTypeEnum)
  type!: weaponTypeEnum;

  @Enum({
    items: [
      ...Object.values(meleeWeaponTypeEnum),
      ...Object.values(projectileWeaponTypeEnum),
      ...Object.values(firearmWeaponTypeEnum),
      ...Object.values(explosiveTypeEnum),
    ],
  })
  subtype!:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum
    | explosiveTypeEnum;

  @Property()
  concealability!: number;

  @Property({ type: "json" })
  accuracy!: AccuracyType;

  @Property({ type: "json" })
  damage!: DamageType;

  @Property({ type: "json" })
  armourPenetration!: ArmourPenetrationType;

  @Property({ type: "json", nullable: true })
  ammunition?: AmmunitionType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Enum({ nullable: true })
  allowedGear?: gearCategoryEnum;

  @Property({ type: "json", nullable: true })
  accessories?: Array<AccessoryType>;

  @Property()
  allowAccessories!: boolean;

  @Property()
  cyberware!: boolean;

  @Property()
  hide!: boolean;

  @Enum()
  augmentationCategory!: augmentationTypeEnum;

  @Property()
  relatedSkill!: string;

  @Property({ type: "string[]", nullable: true })
  relatedSkillSpecialisations?: Array<string>;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;
}

@Entity({ discriminatorValue: weaponTypeEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Property()
  reach!: number;
}

@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends Weapons {}

@Entity({ discriminatorValue: weaponTypeEnum.Firearm })
export class FirearmWeapons extends Weapons {
  @Enum({ type: "json" })
  mode!: ModeType;

  @Property()
  recoilCompensation!: number;

  @Property({ type: "json" })
  ammo!: FirearmAmmoType[];
}

@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends Weapons {}
