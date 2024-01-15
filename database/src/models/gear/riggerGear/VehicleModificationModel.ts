import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/postgresql";
import {
  cyberwareCategoryEnum,
  firearmWeaponTypeEnum,
  ratingMeaningEnum,
  sourceBookEnum,
  vehicleModSubtypeEnum,
  vehicleModTypeEnum,
} from "@shadowrun/common/build/enums.js";
import type { BonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@shadowrun/common/build/schemas/shared/requiredSchemas.js";
import type {
  AvailabilityRiggerModType,
  CostRiggerModType,
  ReplaceAmmoType,
  RiggerModRatingType,
  SlotCostType,
  VehicleModType,
} from "@shadowrun/common/build/schemas/riggerModSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class VehicleMods {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ length: 5000 })
  description!: string;

  @Enum(() => vehicleModTypeEnum)
  type!: vehicleModTypeEnum;

  @Property()
  subtype!: vehicleModSubtypeEnum;

  @Property({ type: "json" })
  maxRating!: RiggerModRatingType;

  @Property({ type: "json", nullable: true })
  minRating?: RiggerModRatingType;

  @Enum({ items: () => ratingMeaningEnum, nullable: true })
  ratingMeaning?: ratingMeaningEnum;

  @Property({ nullable: true })
  capacity?: number;

  @Property({ nullable: true })
  addPhysicalBoxes?: number;

  @Property({ nullable: true })
  isDowngrade?: true;

  @Property({ nullable: true })
  requiresDroneParent?: true;

  @Property({ type: "json" })
  slotCost!: SlotCostType;

  @Enum({ items: () => cyberwareCategoryEnum, nullable: true, array: true })
  subsystemList?: Array<cyberwareCategoryEnum>;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityRiggerModType;

  @Property({ type: "json" })
  cost!: CostRiggerModType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  constructor(dto: VehicleModType) {
    this.name = dto.name;
    this.description = dto.description;
    this.type = dto.type;
    this.subtype = dto.subtype;
    this.maxRating = dto.maxRating;
    if (dto.minRating !== undefined) {
      this.minRating = dto.minRating;
    }
    if (dto.ratingMeaning !== undefined) {
      this.ratingMeaning = dto.ratingMeaning;
    }
    if (dto.capacity !== undefined) {
      this.capacity = dto.capacity;
    }
    if (dto.addPhysicalBoxes !== undefined) {
      this.addPhysicalBoxes = dto.addPhysicalBoxes;
    }
    if (dto.isDowngrade !== undefined) {
      this.isDowngrade = dto.isDowngrade;
    }
    if (dto.requiresDroneParent !== undefined) {
      this.requiresDroneParent = dto.requiresDroneParent;
    }
    this.slotCost = dto.slotCost;
    if (dto.subsystemList !== undefined) {
      this.subsystemList = dto.subsystemList;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    if (dto.userSelectable !== undefined) {
      this.userSelectable = dto.userSelectable;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}

type VehicleSpecificModType = VehicleModType & {
  type: vehicleModTypeEnum.Vehicle;
};

@Entity({ discriminatorValue: vehicleModTypeEnum.Vehicle })
export class VehicleChasisMods extends VehicleMods {
  @Enum({ items: () => firearmWeaponTypeEnum, nullable: true, array: true })
  weaponMountValidCategoryList?: Array<firearmWeaponTypeEnum>;

  constructor(dto: VehicleSpecificModType) {
    super(dto);
    if (dto.weaponMountValidCategoryList !== undefined) {
      this.weaponMountValidCategoryList = dto.weaponMountValidCategoryList;
    }
  }
}

type WeaponMountModType = VehicleModType & {
  type: vehicleModTypeEnum.WeaponMount;
};

@Entity({ discriminatorValue: vehicleModTypeEnum.WeaponMount })
export class WeaponMountMods extends VehicleMods {
  @Property({ nullable: true })
  additionalAmmo?: number;

  @Property({ nullable: true })
  percentageAmmoIncrease?: number;

  @Property({ type: "json", nullable: true })
  replaceAmmo?: ReplaceAmmoType;

  constructor(dto: WeaponMountModType) {
    super(dto);
    if (dto.additionalAmmo !== undefined) {
      this.additionalAmmo = dto.additionalAmmo;
    }
    if (dto.percentageAmmoIncrease !== undefined) {
      this.percentageAmmoIncrease = dto.percentageAmmoIncrease;
    }
    if (dto.replaceAmmo !== undefined) {
      this.replaceAmmo = dto.replaceAmmo;
    }
  }
}
