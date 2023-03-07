import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
} from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";
import {
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  explosiveTypeEnum,
} from "@shadowrun/common";
import type {
  AccuracyType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  DamageType,
} from "@shadowrun/common";
import {
  augmentationClassificationEnum,
  firearmAccessoryMountLocationEnum,
  firearmModeEnum,
  gearCategoryEnum,
} from "@shadowrun/common/src/enums.js";
import type {
  AccessoriesType,
  AmmunitionType,
  weaponRequirementsType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import { weaponSubtypeEnum } from "@shadowrun/common/src/schemas/commonSchema.js";
import { Skills } from "../../chummerdb/skillModel.js";
import type { WeaponSummaryType } from "../../chummerdb/skillModel.js";
import assert from "assert";

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

  @Enum({ items: () => gearCategoryEnum, array: true, nullable: true })
  allowedGear?: Array<gearCategoryEnum>;

  @Property({ type: "json", nullable: true })
  accessories?: AccessoriesType;

  @Property()
  allowAccessories!: boolean;

  @Property()
  cyberware!: boolean;

  @Property({ nullable: true })
  hide?: boolean;

  @Enum(() => augmentationClassificationEnum)
  augmentationCategory!: augmentationClassificationEnum;

  @ManyToOne({ entity: () => Skills, ref: true })
  relatedSkill!: Ref<Skills>;

  @Property({ type: "string[]", nullable: true })
  relatedSkillSpecialisations?: Array<string>;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;
  constructor(dto: WeaponSummaryType) {
    // this.id = dto.id
    this.name = dto.name;
    this.type = dto.typeInformation.type;
    this.subtype = dto.typeInformation.subtype;
    this.concealability = dto.concealability;
    this.accuracy = dto.accuracy;
    this.damage = dto.damage;
    this.armourPenetration = dto.armourPenetration;
    this.ammunition = dto.ammunition;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.allowedGear = dto.allowedGear;
    this.accessories = dto.accessories;
    this.allowAccessories = dto.allowAccessories;
    this.cyberware = dto.isCyberware;
    // this.hide  = dto.h;
    this.augmentationCategory = dto.augmentationType;
    this.relatedSkill = ref(Skills, dto.relatedSkill);
    this.relatedSkillSpecialisations = dto.relatedSkillSpecialisations;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Property()
  reach!: number;
  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Melee);
    this.reach = dto.typeInformation.meleeOptions.reach;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends Weapons {
  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Projectile);
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Firearm })
export class FirearmWeapons extends Weapons {
  @Enum({ items: () => firearmModeEnum, array: true })
  mode!: Array<firearmModeEnum>;

  @Property()
  recoilCompensation!: number;

  @Enum({ items: () => weaponSubtypeEnum, nullable: true })
  ammoCategory?: weaponSubtypeEnum;

  @Property()
  ammoSlots!: number;

  @Property({ type: "json", nullable: true })
  weaponRequirements?: weaponRequirementsType;

  @Enum({
    items: () => firearmAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  hostWeaponMountsRequired?: Array<firearmAccessoryMountLocationEnum>;

  @Property({ type: "string[]", nullable: true })
  underbarrelWeapons?: Array<string>;

  @Property({ type: "string[]", nullable: true })
  addWeapons?: Array<string>;

  @Enum({
    items: () => firearmAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  accessoryMounts?: Array<firearmAccessoryMountLocationEnum>;

  @Enum({
    items: () => firearmAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  doubleCostAccessoryMounts?: Array<firearmAccessoryMountLocationEnum>;

  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Firearm);
    this.mode = dto.typeInformation.firearmOptions.mode;
    this.recoilCompensation =
      dto.typeInformation.firearmOptions.recoilCompensation;
    this.ammoCategory = dto.typeInformation.firearmOptions.ammoCategory;
    this.ammoSlots = dto.typeInformation.firearmOptions.ammoSlots;
    this.weaponRequirements =
      dto.typeInformation.firearmOptions.hostWeaponRequirements?.weaponRequirements;
    this.hostWeaponMountsRequired =
      dto.typeInformation.firearmOptions.hostWeaponRequirements?.hostWeaponMountsRequired;
    this.underbarrelWeapons =
      dto.typeInformation.firearmOptions.underbarrelWeapons;
    this.addWeapons = dto.typeInformation.firearmOptions.addWeapons;
    this.accessoryMounts = dto.typeInformation.firearmOptions.accessoryMounts;
    this.doubleCostAccessoryMounts =
      dto.typeInformation.firearmOptions.doubleCostAccessoryMounts;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends Weapons {
  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Explosive);
  }
}
