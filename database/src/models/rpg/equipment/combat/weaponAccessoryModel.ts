import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToOne,
  ManyToMany,
  Collection,
  OneToMany,
  Unique,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import type {
  AmmoCapacityCalculationType,
  ConcealabilityModificationType,
  WeaponAccessoryType,
  AvailabilityWeaponAccessoryType,
  CostWeaponAccessoryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import { Weapons } from "./weaponModel.js";
import { Gears } from "../other/gearModel.js";
import {
  damageTypeEnum,
  gearCategoryEnum,
  sourceBookEnum,
  weaponAccessoryMountLocationEnum,
} from "@neon-codex/common/build/enums.js";
import { WeaponAccessoryIncludedGears } from "../../activeTables/activeGearModel.js";
import type { AmmunitionSingleType } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";

@Entity()
export class WeaponAccessories {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property()
  maxRating!: number;

  @OneToOne({ entity: () => Weapons, nullable: true, ref: true })
  linkedWeapon?: Ref<Weapons>;

  @Property({ nullable: true })
  accuracyIncrease?: number;

  @Property({ nullable: true })
  damageIncrease?: number;

  @Enum({ items: () => damageTypeEnum, nullable: true })
  newDamageType?: damageTypeEnum;

  @Property({ nullable: true })
  reachIncrease?: number;

  @Property({ nullable: true })
  armourPiercingIncrease?: number;

  @Property({ nullable: true })
  recoilCompensationIncrease?: number;

  @Property({ nullable: true })
  recoilCompensationType?: number;

  @Property()
  deploymentRequired: boolean;

  @Property({ nullable: true })
  accessoryCostMultiplier?: number;

  @ManyToMany({ entity: () => Gears, owner: true })
  allowedGearList = new Collection<Gears>(this);

  @Enum({ items: () => gearCategoryEnum, nullable: true, array: true })
  allowedGearCategories?: Array<gearCategoryEnum>;

  @OneToMany(
    () => WeaponAccessoryIncludedGears,
    (weaponAccessoryIncludedGear) => weaponAccessoryIncludedGear.weaponAccessory
  )
  includedGearList = new Collection<WeaponAccessoryIncludedGears>(this);

  @Property()
  specialModification!: boolean;

  @Property({ nullable: true })
  extraAmmoSlots?: number;

  @Property({ type: "json", nullable: true })
  ammoCapacityCalculation?: AmmoCapacityCalculationType;

  @Property({ nullable: true })
  newAmmoType?: AmmunitionSingleType;

  @Enum({
    items: () => weaponAccessoryMountLocationEnum,
    array: true,
    nullable: true,
  })
  hostWeaponMountsRequired?: Array<weaponAccessoryMountLocationEnum>;

  @Property({ type: "json", nullable: true })
  hostWeaponRequirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  hostWeaponRestrictions?: RequirementsType;

  @Property({ nullable: true })
  rangePenaltyDecrease?: number;

  @Property({ type: "json", nullable: true })
  concealabilityModification?: ConcealabilityModificationType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponAccessoryType;

  @Property({ type: "json" })
  cost!: CostWeaponAccessoryType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: WeaponAccessoryType, linkedWeapon?: Ref<Weapons>) {
    this.name = dto.name;
    this.maxRating = dto.maxRating;
    if (linkedWeapon !== undefined) {
      this.linkedWeapon = linkedWeapon;
    }
    if (dto.accuracyIncrease !== undefined)
      this.accuracyIncrease = dto.accuracyIncrease;
    if (dto.damageIncrease !== undefined)
      this.damageIncrease = dto.damageIncrease;
    if (dto.newDamageType !== undefined) this.newDamageType = dto.newDamageType;
    if (dto.reachIncrease !== undefined) this.reachIncrease = dto.reachIncrease;
    if (dto.armourPiercingIncrease !== undefined)
      this.armourPiercingIncrease = dto.armourPiercingIncrease;
    if (dto.recoilCompensationIncrease !== undefined)
      this.recoilCompensationIncrease = dto.recoilCompensationIncrease;
    if (dto.recoilCompensationType !== undefined)
      this.recoilCompensationType = dto.recoilCompensationType;
    this.deploymentRequired = dto.deploymentRequired;
    this.availability = dto.availability;
    this.cost = dto.cost;
    if (dto.accessoryCostMultiplier !== undefined)
      this.accessoryCostMultiplier = dto.accessoryCostMultiplier;
    // if (dto.allowedGearList !== undefined) this.allowedGearList = dto.allowedGearList;
    if (dto.allowedGearCategories !== undefined)
      this.allowedGearCategories = dto.allowedGearCategories;
    this.specialModification = dto.specialModification;
    if (dto.extraAmmoSlots !== undefined)
      this.extraAmmoSlots = dto.extraAmmoSlots;
    if (dto.ammoCapacityCalculation !== undefined)
      this.ammoCapacityCalculation = dto.ammoCapacityCalculation;
    if (dto.newAmmoType !== undefined) this.newAmmoType = dto.newAmmoType;
    if (dto.hostWeaponMountsRequired !== undefined)
      this.hostWeaponMountsRequired = dto.hostWeaponMountsRequired;
    if (dto.hostWeaponRequirements !== undefined)
      this.hostWeaponRequirements = dto.hostWeaponRequirements;
    if (dto.hostWeaponRestrictions !== undefined)
      this.hostWeaponRestrictions = dto.hostWeaponRestrictions;
    if (dto.rangePenaltyDecrease !== undefined)
      this.rangePenaltyDecrease = dto.rangePenaltyDecrease;
    if (dto.concealabilityModification !== undefined)
      this.concealabilityModification = dto.concealabilityModification;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
    if (dto.wireless !== undefined) this.wireless = dto.wireless;
  }
}
