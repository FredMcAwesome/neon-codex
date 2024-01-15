import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  ref,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import {
  augmentationTypeEnum,
  explosiveTypeEnum,
  firearmAccessoryMountLocationEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  sourceBookEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import type {
  AccuracyType,
  AmmunitionType,
  ArmourPenetrationType,
  AvailabilityWeaponType,
  CostWeaponType,
  DamageType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type { AllowedGearType } from "@shadowrun/common/build/schemas/commonSchemas.js";
import { Skills } from "../../chummerdb/skillModel.js";
import type { WeaponDBType } from "../../../seeds/newSeeds/weaponsSeed.js";
import { IncludedWeaponAccessories } from "../../chummerdb/customTables/activeWeaponAccessoryModel.js";
import { WeaponRangeLinks } from "../../chummerdb/customTables/weaponRangeLinkModel.js";
import type { RequirementsType } from "@shadowrun/common/build/schemas/shared/requiredSchemas.js";

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

  @Property({ type: "json", nullable: true })
  allowedGear?: AllowedGearType;

  @OneToMany(
    () => IncludedWeaponAccessories,
    (accessory) => accessory.standardWeapon
  )
  accessories = new Collection<IncludedWeaponAccessories>(this);

  @Property()
  allowAccessories!: boolean;

  @Property({ nullable: true })
  userSelectable?: false;

  @Enum({ items: () => augmentationTypeEnum, nullable: true })
  augmentationType?: augmentationTypeEnum;

  @ManyToOne({ entity: () => Weapons, nullable: true })
  baseWeaponForm?: Weapons;

  @OneToMany(() => Weapons, (weapon) => weapon.baseWeaponForm)
  otherWeaponForms = new Collection<Weapons>(this);

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum({
    items: () => firearmAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  hostWeaponMountsRequired?: Array<firearmAccessoryMountLocationEnum>;

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

  constructor(dto: WeaponDBType) {
    // this.id = dto.id;
    this.name = dto.name;
    this.type = dto.type;
    this.concealability = dto.concealability;
    this.accuracy = dto.accuracy;
    this.damage = dto.damage;
    this.armourPenetration = dto.armourPenetration;
    if (dto.ammunition !== undefined) this.ammunition = dto.ammunition;
    if (dto.allowedGear !== undefined) this.allowedGear = dto.allowedGear;
    this.allowAccessories = dto.allowAccessories;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    if (dto.augmentationType !== undefined)
      this.augmentationType = dto.augmentationType;
    this.relatedSkill = ref(Skills, dto.relatedSkill);
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

type MeleeWeaponType = WeaponDBType & {
  type: weaponTypeEnum.Melee;
};
@Entity({ discriminatorValue: weaponTypeEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Property()
  subtype!: meleeWeaponTypeEnum;

  @Property()
  reach!: number;

  constructor(dto: MeleeWeaponType) {
    super(dto);
    this.subtype = dto.subtype;
    this.reach = dto.meleeOptions.reach;
  }
}

// this should be fully abstract but getting an error when I do so
// just leaving as partially abstract for now... TODO: fix
@Entity()
export abstract class RangedWeapons extends Weapons {
  @OneToMany(() => WeaponRangeLinks, (linkTable) => linkTable.weapon)
  ranges = new Collection<WeaponRangeLinks>(this);

  constructor(dto: WeaponDBType) {
    super(dto);
  }
}

type ProjectileWeaponType = WeaponDBType & {
  type: weaponTypeEnum.Projectile;
};
@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends RangedWeapons {
  @Property()
  subtype!: projectileWeaponTypeEnum;
  constructor(dto: ProjectileWeaponType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}

type FirearmWeaponType = WeaponDBType & {
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

  @Property({ type: "string[]", nullable: true })
  underbarrelWeapons?: Array<string>;

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

  constructor(dto: FirearmWeaponType) {
    super(dto);
    this.subtype = dto.subtype;
    this.mode = dto.firearmOptions.mode;
    this.recoilCompensation = dto.firearmOptions.recoilCompensation;
    if (dto.firearmOptions.ammoCategory !== undefined)
      this.ammoCategory = dto.firearmOptions.ammoCategory;
    this.ammoSlots = dto.firearmOptions.ammoSlots;
    if (dto.firearmOptions.underbarrelWeapons !== undefined)
      this.underbarrelWeapons = dto.firearmOptions.underbarrelWeapons;
    if (dto.firearmOptions.accessoryMounts !== undefined)
      this.accessoryMounts = dto.firearmOptions.accessoryMounts;
    if (dto.firearmOptions.doubleCostAccessoryMounts !== undefined)
      this.doubleCostAccessoryMounts =
        dto.firearmOptions.doubleCostAccessoryMounts;
  }
}

type ExplosiveWeaponType = WeaponDBType & {
  type: weaponTypeEnum.Explosive;
};
@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends RangedWeapons {
  @Property()
  subtype!: explosiveTypeEnum;

  constructor(dto: ExplosiveWeaponType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}
