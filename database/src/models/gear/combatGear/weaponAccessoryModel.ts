import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import { damageTypeEnum } from "@shadowrun/common";
import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import type {
  AmmunitionSingleType,
  UseGearListType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type {
  AmmoCapacityCalculationType,
  HostWeaponMountsRequiredType,
  AccessoryWeaponRequirementsType,
  ConcealabilityModificationType,
  WeaponAccessorySummaryType,
  AvailabilityWeaponAccessoryType,
  CostWeaponAccessoryType,
} from "@shadowrun/common/build/schemas/weaponAccessorySchemas.js";

@Entity()
export class WeaponAccessories {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property()
  maxRating!: number;

  @Property()
  isWeapon!: boolean;

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

  @Property({ nullable: true })
  deploymentRequired?: boolean;

  @Property({ type: "json" })
  availability!: AvailabilityWeaponAccessoryType;

  @Property({ type: "json" })
  cost!: CostWeaponAccessoryType;

  @Property({ nullable: true })
  accessoryCostMultiplier?: number;

  @Enum({ items: () => gearCategoryEnum, array: true, nullable: true })
  allowGear?: Array<gearCategoryEnum>;

  @Property({ type: "json", nullable: true })
  preinstalledGear?: UseGearListType;

  @Property()
  specialModification!: boolean;

  @Property({ nullable: true })
  extraAmmoSlots?: number;

  @Property({ type: "json", nullable: true })
  ammoCapacityCalculation?: AmmoCapacityCalculationType;

  @Property({ nullable: true })
  newAmmoType?: AmmunitionSingleType;

  @Property({ type: "json", nullable: true })
  hostWeaponMountsRequired?: HostWeaponMountsRequiredType;

  @Property({ type: "json", nullable: true })
  hostWeaponRequirements?: AccessoryWeaponRequirementsType;

  @Property({ type: "json", nullable: true })
  hostWeaponRestrictions?: AccessoryWeaponRequirementsType;

  @Property({ nullable: true })
  rangePenaltyDecrease?: number;

  @Property({ type: "json", nullable: true })
  concealabilityModification?: ConcealabilityModificationType;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;

  constructor(dto: WeaponAccessorySummaryType) {
    this.name = dto.name;
    this.maxRating = dto.maxRating;
    this.isWeapon = dto.isWeapon;
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
    if (dto.allowGear !== undefined) this.allowGear = dto.allowGear;
    if (dto.preinstalledGear !== undefined)
      this.preinstalledGear = dto.preinstalledGear;
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
