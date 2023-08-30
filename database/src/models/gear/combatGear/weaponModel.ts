import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  ref,
} from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";

import {
  augmentationClassificationEnum,
  explosiveTypeEnum,
  firearmAccessoryMountLocationEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  gearCategoryEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  sourceBookEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import type {
  AccuracyType,
  AmmunitionType,
  ArmourPenetrationType,
  DamageType,
  weaponRequirementsType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type {
  AvailabilityType,
  CostType,
} from "@shadowrun/common/build/schemas/commonSchema.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchema.js";
import { Skills } from "../../chummerdb/skillModel.js";
import assert from "assert";
import type { WeaponSummaryType } from "../../../seeds/newSeeds/weaponsSeed.js";
import { IncludedWeaponAccessories } from "../../chummerdb/customTables/activeWeaponAccessoryModel.js";
import { WeaponRangeLinks } from "../../chummerdb/customTables/weaponRangeLinkModel.js";

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

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Enum({ items: () => gearCategoryEnum, array: true, nullable: true })
  allowedGear?: Array<gearCategoryEnum>;

  @OneToMany(
    () => IncludedWeaponAccessories,
    (accessory) => accessory.standardWeapon
  )
  accessories = new Collection<IncludedWeaponAccessories>(this);

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

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: WeaponSummaryType) {
    // this.id = dto.id;
    this.name = dto.name;
    this.type = dto.typeInformation.type;
    this.concealability = dto.concealability;
    this.accuracy = dto.accuracy;
    this.damage = dto.damage;
    this.armourPenetration = dto.armourPenetration;
    if (dto.ammunition !== undefined) this.ammunition = dto.ammunition;
    this.availability = dto.availability;
    this.cost = dto.cost;
    if (dto.allowedGear !== undefined) this.allowedGear = dto.allowedGear;
    this.allowAccessories = dto.allowAccessories;
    this.cyberware = dto.isCyberware;
    // this.hide  = dto.h;
    this.augmentationCategory = dto.augmentationType;
    this.relatedSkill = ref(Skills, dto.relatedSkill);
    if (dto.relatedSkillSpecialisations !== undefined)
      this.relatedSkillSpecialisations = dto.relatedSkillSpecialisations;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Melee })
export class MeleeWeapons extends Weapons {
  @Enum({
    items: () => meleeWeaponTypeEnum,
  })
  subtypeMelee!: meleeWeaponTypeEnum;

  @Property()
  reach!: number;

  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Melee);
    this.reach = dto.typeInformation.meleeOptions.reach;
    this.subtypeMelee = dto.typeInformation.subtype;
  }
}

// this should be fully abstract but getting an error when I do so
// just leaving as partially abstract for now... TODO: fix
@Entity()
export abstract class RangedWeapons extends Weapons {
  @OneToMany(() => WeaponRangeLinks, (linkTable) => linkTable.weapon)
  ranges = new Collection<WeaponRangeLinks>(this);

  constructor(dto: WeaponSummaryType) {
    super(dto);
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Projectile })
export class ProjectileWeapons extends RangedWeapons {
  @Enum({
    items: () => projectileWeaponTypeEnum,
  })
  subtypeProjectile!: projectileWeaponTypeEnum;
  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Projectile);
    this.subtypeProjectile = dto.typeInformation.subtype;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Firearm })
export class FirearmWeapons extends RangedWeapons {
  @Enum({
    items: () => firearmWeaponTypeEnum,
  })
  subtypeFirearm!: firearmWeaponTypeEnum;

  @Enum({ items: () => firearmModeEnum, array: true })
  mode!: Array<firearmModeEnum>;

  @Property()
  recoilCompensation!: number;

  @Enum({ items: () => weaponXmlSubtypeEnum, nullable: true })
  ammoCategory?: weaponXmlSubtypeEnum;

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
    this.subtypeFirearm = dto.typeInformation.subtype;
    this.mode = dto.typeInformation.firearmOptions.mode;
    this.recoilCompensation =
      dto.typeInformation.firearmOptions.recoilCompensation;
    if (dto.typeInformation.firearmOptions.ammoCategory !== undefined)
      this.ammoCategory = dto.typeInformation.firearmOptions.ammoCategory;
    this.ammoSlots = dto.typeInformation.firearmOptions.ammoSlots;
    if (
      dto.typeInformation.firearmOptions.hostWeaponRequirements
        ?.weaponRequirements !== undefined
    )
      this.weaponRequirements =
        dto.typeInformation.firearmOptions.hostWeaponRequirements.weaponRequirements;
    if (
      dto.typeInformation.firearmOptions.hostWeaponRequirements
        ?.hostWeaponMountsRequired !== undefined
    )
      this.hostWeaponMountsRequired =
        dto.typeInformation.firearmOptions.hostWeaponRequirements.hostWeaponMountsRequired;
    if (dto.typeInformation.firearmOptions.underbarrelWeapons !== undefined)
      this.underbarrelWeapons =
        dto.typeInformation.firearmOptions.underbarrelWeapons;
    if (dto.typeInformation.firearmOptions.addWeapons !== undefined)
      this.addWeapons = dto.typeInformation.firearmOptions.addWeapons;
    if (dto.typeInformation.firearmOptions.accessoryMounts !== undefined)
      this.accessoryMounts = dto.typeInformation.firearmOptions.accessoryMounts;
    if (
      dto.typeInformation.firearmOptions.doubleCostAccessoryMounts !== undefined
    )
      this.doubleCostAccessoryMounts =
        dto.typeInformation.firearmOptions.doubleCostAccessoryMounts;
  }
}

@Entity({ discriminatorValue: weaponTypeEnum.Explosive })
export class Explosives extends RangedWeapons {
  @Enum({
    items: () => explosiveTypeEnum,
  })
  subtypeExplosive!: explosiveTypeEnum;

  constructor(dto: WeaponSummaryType) {
    super(dto);
    assert(dto.typeInformation.type === weaponTypeEnum.Explosive);
    this.subtypeExplosive = dto.typeInformation.subtype;
  }
}
