import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type { AvailabilityType, CostType } from "@shadowrun/common";
import { damageTypeEnum } from "@shadowrun/common";
import { gearCategoryEnum } from "@shadowrun/common/src/enums.js";
import type { UseGearListType } from "@shadowrun/common/src/schemas/weaponSchemas.js";
import type {
  AmmoCapacityCalculationType,
  AmmoInformationType,
  hostWeaponMountsRequiredType,
  accessoryWeaponRequirementsType,
  concealabilityModificationType,
  WeaponAccessorySummaryType,
} from "@shadowrun/common/src/schemas/weaponAccessorySchema.js";

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
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

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
  newAmmoType?: AmmoInformationType;

  @Property({ type: "json", nullable: true })
  hostWeaponMountsRequired?: hostWeaponMountsRequiredType;

  @Property({ type: "json", nullable: true })
  hostWeaponRequirements?: accessoryWeaponRequirementsType;

  @Property({ type: "json", nullable: true })
  hostWeaponRestrictions?: accessoryWeaponRequirementsType;

  @Property({ nullable: true })
  rangePenaltyDecrease?: number;

  @Property({ type: "json", nullable: true })
  concealabilityModification?: concealabilityModificationType;

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
    this.accuracyIncrease = dto.accuracyIncrease;
    this.damageIncrease = dto.damageIncrease;
    this.newDamageType = dto.newDamageType;
    this.reachIncrease = dto.reachIncrease;
    this.armourPiercingIncrease = dto.armourPiercingIncrease;
    this.recoilCompensationIncrease = dto.recoilCompensationIncrease;
    this.recoilCompensationType = dto.recoilCompensationType;
    this.deploymentRequired = dto.deploymentRequired;
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.accessoryCostMultiplier = dto.accessoryCostMultiplier;
    this.allowGear = dto.allowGear;
    this.preinstalledGear = dto.preinstalledGear;
    this.specialModification = dto.specialModification;
    this.extraAmmoSlots = dto.extraAmmoSlots;
    this.ammoCapacityCalculation = dto.ammoCapacityCalculation;
    this.newAmmoType = dto.newAmmoType;
    this.hostWeaponMountsRequired = dto.hostWeaponMountsRequired;
    this.hostWeaponRequirements = dto.hostWeaponRequirements;
    this.hostWeaponRestrictions = dto.hostWeaponRestrictions;
    this.rangePenaltyDecrease = dto.rangePenaltyDecrease;
    this.concealabilityModification = dto.concealabilityModification;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
    this.wireless = dto.wireless;
  }
}
