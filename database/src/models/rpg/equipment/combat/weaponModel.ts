import {
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
  augmentationTypeEnum,
  explosiveTypeEnum,
  weaponAccessoryMountLocationEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  gearCategoryEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  sourceBookEnum,
  weaponExtraClassificationEnum,
  weaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  AccuracyType,
  AmmunitionType,
  ArmourPenetrationType,
  AvailabilityWeaponType,
  CostWeaponType,
  DamageType,
  WeaponSummaryType,
} from "@neon-codex/common/build/schemas/weaponSchemas.js";
import { weaponXmlSubtypeEnum } from "@neon-codex/common/build/schemas/commonSchemas.js";
import { Skills } from "../../abilities/skillModel.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { Gears } from "../other/gearModel.js";
import { WeaponRanges } from "./helperTables/weaponRangeModel.js";
import { IncludedWeaponAccessories } from "../../activeTables/activeWeaponAccessoryModel.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Weapons {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => weaponTypeEnum)
  type!: weaponTypeEnum;

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

  @ManyToMany({ entity: () => Gears, owner: true })
  allowedGearList = new Collection<Gears>(this);

  @Enum({ items: () => gearCategoryEnum, nullable: true, array: true })
  allowedGearCategories?: Array<gearCategoryEnum>;

  @OneToMany(
    () => IncludedWeaponAccessories,
    (accessory) => accessory.standardWeapon
  )
  includedAccessories = new Collection<IncludedWeaponAccessories>(this);

  @Property()
  allowAccessories!: boolean;

  @Property({ nullable: true })
  userSelectable?: false;

  @Enum({ items: () => augmentationTypeEnum, nullable: true })
  augmentationType?: augmentationTypeEnum;

  @ManyToOne({ entity: () => Weapons, nullable: true })
  baseWeaponForm?: Weapons;

  @OneToMany(() => Weapons, (weapon) => weapon.baseWeaponForm)
  alternativeWeaponForms = new Collection<Weapons>(this);

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  hostWeaponMountsRequired?: Array<weaponAccessoryMountLocationEnum>;

  @ManyToOne({ entity: () => Skills, ref: true })
  relatedSkill!: Ref<Skills>;

  @Property({ type: "string[]", nullable: true })
  relatedSkillSpecialisations?: Array<string>;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponType;

  @Property({ type: "json" })
  cost!: CostWeaponType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: WeaponSummaryType, relatedSkill: Ref<Skills>) {
    // this.id = dto.id;
    this.name = dto.name;
    this.type = dto.type;
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
    if (dto.augmentationType !== undefined)
      this.augmentationType = dto.augmentationType;
    this.relatedSkill = relatedSkill;
    if (dto.relatedSkillSpecialisations !== undefined)
      this.relatedSkillSpecialisations = dto.relatedSkillSpecialisations;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;

    if (dto.hostWeaponRequirements?.weaponRequirements !== undefined)
      this.requirements = dto.hostWeaponRequirements.weaponRequirements;
    if (dto.hostWeaponRequirements?.hostWeaponMountsRequired !== undefined)
      this.hostWeaponMountsRequired =
        dto.hostWeaponRequirements.hostWeaponMountsRequired;
  }
}

type MeleeWeaponType = WeaponSummaryType & {
  type: weaponTypeEnum.Melee;
};
@Entity({ discriminatorValue: weaponTypeEnum.Melee })
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

// this should be fully abstract but getting an error when I do so
// just leaving as partially abstract for now... TODO: fix
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
    dto: WeaponSummaryType,
    relatedSkill: Ref<Skills>,
    extraClassification?: weaponExtraClassificationEnum
  ) {
    super(dto, relatedSkill);
    if (extraClassification !== undefined) {
      this.extraClassification = extraClassification;
    }
  }
}

type ProjectileWeaponType = WeaponSummaryType & {
  type: weaponTypeEnum.Projectile;
};
@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends RangedWeapons {
  @Property()
  subtype!: projectileWeaponTypeEnum;

  constructor(dto: ProjectileWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill, dto.extraClassification);
    this.subtype = dto.subtype;
  }
}

type FirearmWeaponType = WeaponSummaryType & {
  type: weaponTypeEnum.Firearm;
};
@Entity({ discriminatorValue: weaponTypeEnum.Firearm })
export class FirearmWeapons extends RangedWeapons {
  @Property()
  subtype!: firearmWeaponTypeEnum;

  @Enum({ items: () => firearmModeEnum, array: true })
  mode!: Array<firearmModeEnum>;

  @Property()
  recoilCompensation!: number;

  @Enum({ items: () => weaponXmlSubtypeEnum, nullable: true })
  ammoCategory?: weaponXmlSubtypeEnum;

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
  accessoryMounts?: Array<weaponAccessoryMountLocationEnum>;

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  doubleCostAccessoryMounts?: Array<weaponAccessoryMountLocationEnum>;

  constructor(dto: FirearmWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill, dto.extraClassification);
    this.subtype = dto.subtype;
    this.mode = dto.firearmOptions.mode;
    this.recoilCompensation = dto.firearmOptions.recoilCompensation;
    if (dto.firearmOptions.ammoCategory !== undefined)
      this.ammoCategory = dto.firearmOptions.ammoCategory;
    this.ammoSlots = dto.firearmOptions.ammoSlots;
    // if (dto.firearmOptions.underbarrelWeapons !== undefined)
    //   this.underbarrelWeapons = dto.firearmOptions.underbarrelWeapons;
    if (dto.firearmOptions.accessoryMounts !== undefined)
      this.accessoryMounts = dto.firearmOptions.accessoryMounts;
    if (dto.firearmOptions.doubleCostAccessoryMounts !== undefined)
      this.doubleCostAccessoryMounts =
        dto.firearmOptions.doubleCostAccessoryMounts;
  }
}

type ExplosiveWeaponType = WeaponSummaryType & {
  type: weaponTypeEnum.Explosive;
};
@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends RangedWeapons {
  @Property()
  subtype!: explosiveTypeEnum;

  constructor(dto: ExplosiveWeaponType, relatedSkill: Ref<Skills>) {
    super(dto, relatedSkill);
    this.subtype = dto.subtype;
  }
}
