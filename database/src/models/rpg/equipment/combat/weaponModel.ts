import { WeaponRequirements } from "../../otherData/requirementsModel.js";
import {
  OneToOne,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import {
  augmentationCategoryEnum,
  explosiveTypeEnum,
  weaponAccessoryMountLocationEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  gearCategoryEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  sourceBookEnum,
  weaponExtraClassificationEnum,
  weaponCategoryEnum,
} from "@neon-codex/common";
import type {
  AvailabilityWeaponType,
  CostWeaponType,
  WeaponClassificationType,
  WeaponType,
} from "@neon-codex/common";
import { Skills } from "../../abilities/skillModel.js";
import { Gears } from "../other/gearModel.js";
import { WeaponRanges } from "./helperTables/weaponRangeModel.js";
import { IncludedWeaponAccessories } from "../../activeTables/activeWeaponAccessoryModel.js";
import { ActiveWeapons } from "../../activeTables/activeWeaponModel.js";
import type {
  AccuracyType,
  AmmunitionType,
  ArmourPenetrationType,
  DamageType,
} from "@neon-codex/common";

@Entity({
  discriminatorColumn: "category",
  abstract: true,
})
export abstract class Weapons {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => weaponCategoryEnum })
  category!: weaponCategoryEnum;

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

  // TODO: this can be removed? Check xml/json
  @ManyToMany({ entity: () => Gears, owner: true, joinColumn: "join_id" })
  allowedGearList = new Collection<Gears>(this);

  @Enum({ items: () => gearCategoryEnum, nullable: true, array: true })
  allowedGearCategories?: Array<gearCategoryEnum>;

  @OneToMany(
    () => IncludedWeaponAccessories,
    (accessory) => accessory.standardWeapon
  )
  includedAccessoryList = new Collection<IncludedWeaponAccessories>(this);

  @Property()
  allowAccessories!: boolean;

  @Property({ nullable: true })
  userSelectable?: false;

  @Enum({ items: () => augmentationCategoryEnum, nullable: true })
  augmentationCategory?: augmentationCategoryEnum;

  @ManyToOne({ entity: () => Weapons, nullable: true })
  baseWeaponForm?: Weapons;

  @OneToMany(() => Weapons, (weapon) => weapon.baseWeaponForm)
  alternativeWeaponForms = new Collection<Weapons>(this);

  @OneToOne(() => WeaponRequirements, (req) => req.requirementWeapon, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<WeaponRequirements>;

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  hostWeaponMountsRequired?: Array<weaponAccessoryMountLocationEnum>;

  @OneToMany(() => ActiveWeapons, (activeWeapon) => activeWeapon.weapon)
  ActiveWeaponList = new Collection<ActiveWeapons>(this);

  @ManyToOne({ entity: () => Skills, ref: true })
  relatedSkill!: Ref<Skills>;

  @Property({ type: "string[]", nullable: true })
  relatedSkillSpecialisationList?: Array<string>;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponType;

  @Property({ type: "json" })
  cost!: CostWeaponType;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: WeaponType, relatedSkill: Ref<Skills>) {
    // this.id = dto.id;
    this.name = dto.name;
    this.category = dto.category;
    this.concealability = dto.concealability;
    this.accuracy = dto.accuracy;
    this.damage = dto.damage;
    this.armourPenetration = dto.armourPenetration;
    if (dto.ammunition !== undefined) this.ammunition = dto.ammunition;
    // if (dto.allowedGearList !== undefined) this.allowedGearList = dto.allowedGearList;
    if (dto.allowedGearCategories !== undefined)
      this.allowedGearCategories = dto.allowedGearCategories;
    this.allowAccessories = dto.allowAccessories;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    if (dto.augmentationCategory !== undefined)
      this.augmentationCategory = dto.augmentationCategory;
    if (dto.hostWeaponMountsRequired !== undefined)
      this.hostWeaponMountsRequired = dto.hostWeaponMountsRequired;
    this.relatedSkill = relatedSkill;
    if (dto.relatedSkillSpecialisationList !== undefined)
      this.relatedSkillSpecialisationList = dto.relatedSkillSpecialisationList;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

type MeleeWeaponType = WeaponType & {
  category: weaponCategoryEnum.Melee;
};
@Entity({ discriminatorValue: weaponCategoryEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Property()
  subtype!: meleeWeaponTypeEnum;

  @Property()
  reach!: number;

  constructor(dto: MeleeWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill);
    this.subtype = dto.subtype;
    this.reach = dto.meleeOptions.reach;
  }
}

// this should be fully abstract but a relationship cannot point
// to an abstract entity... TODO: fix (maybe with polymorphic relationships?)
@Entity()
export abstract class RangedWeapons extends Weapons {
  @ManyToMany({
    entity: () => WeaponRanges,
    owner: true,
    joinColumn: "join_id",
  })
  ranges = new Collection<WeaponRanges>(this);

  @Enum({ items: () => weaponExtraClassificationEnum, nullable: true })
  extraClassification?: weaponExtraClassificationEnum;

  constructor(
    dto: WeaponType,
    relatedSkill: Ref<Skills>,
    extraClassification?: weaponExtraClassificationEnum
  ) {
    super(dto, relatedSkill);
    if (extraClassification !== undefined) {
      this.extraClassification = extraClassification;
    }
  }
}

type ProjectileWeaponType = WeaponType & {
  category: weaponCategoryEnum.Projectile;
};
@Entity({ discriminatorValue: weaponCategoryEnum.Projectile })
export class ProjectileWeapons extends RangedWeapons {
  @Property()
  subtype!: projectileWeaponTypeEnum;

  constructor(dto: ProjectileWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill, dto.extraClassification);
    this.subtype = dto.subtype;
  }
}

type FirearmWeaponType = WeaponType & {
  category: weaponCategoryEnum.Firearm;
};
@Entity({ discriminatorValue: weaponCategoryEnum.Firearm })
export class FirearmWeapons extends RangedWeapons {
  @Property()
  subtype!: firearmWeaponTypeEnum;

  @Enum({ items: () => firearmModeEnum, array: true })
  mode!: Array<firearmModeEnum>;

  @Property()
  recoilCompensation!: number;

  @Property({ type: "json", nullable: true })
  ammoWeaponClassification?: WeaponClassificationType;

  @Property()
  ammoSlots!: number;

  // join column needs to be manually set as Mikro orm
  // doesn't create a valid join column otherwise
  @ManyToMany({ entity: () => Weapons, owner: true, joinColumn: "join_id" })
  underbarrelWeapons = new Collection<Weapons>(this);

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  accessoryMountList?: Array<weaponAccessoryMountLocationEnum>;

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  doubleCostAccessoryMountList?: Array<weaponAccessoryMountLocationEnum>;

  constructor(dto: FirearmWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill, dto.extraClassification);
    this.subtype = dto.subtype;
    this.mode = dto.firearmOptions.mode;
    this.recoilCompensation = dto.firearmOptions.recoilCompensation;
    if (dto.firearmOptions.ammoWeaponClassification !== undefined)
      this.ammoWeaponClassification =
        dto.firearmOptions.ammoWeaponClassification;
    this.ammoSlots = dto.firearmOptions.ammoSlots;
    // if (dto.firearmOptions.underbarrelWeapons !== undefined)
    //   this.underbarrelWeapons = dto.firearmOptions.underbarrelWeapons;
    if (dto.firearmOptions.accessoryMountList !== undefined)
      this.accessoryMountList = dto.firearmOptions.accessoryMountList;
    if (dto.firearmOptions.doubleCostAccessoryMountList !== undefined)
      this.doubleCostAccessoryMountList =
        dto.firearmOptions.doubleCostAccessoryMountList;
  }
}

type ExplosiveWeaponType = WeaponType & {
  category: weaponCategoryEnum.Explosive;
};
@Entity({ discriminatorValue: weaponCategoryEnum.Explosive })
export class Explosives extends RangedWeapons {
  @Property()
  subtype!: explosiveTypeEnum;

  constructor(dto: ExplosiveWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill);
    this.subtype = dto.subtype;
  }
}
