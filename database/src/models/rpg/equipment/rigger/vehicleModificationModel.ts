import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Unique,
} from "@mikro-orm/postgresql";
import {
  cyberwareCategoryEnum,
  firearmWeaponTypeEnum,
  ratingMeaningEnum,
  sourceBookEnum,
  vehicleModTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type {
  AvailabilityVehicleModType,
  CostVehicleModType,
  VehicleModRatingType,
  SlotCostType,
  VehicleModType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class VehicleModifications {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ length: 5000 })
  description!: string;

  @Property()
  type!: vehicleModTypeEnum;

  @Property({ type: "json" })
  maxRating!: VehicleModRatingType;

  @Property({ type: "json", nullable: true })
  minRating?: VehicleModRatingType;

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
  allowedSubsystemList?: Array<cyberwareCategoryEnum>;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityVehicleModType;

  @Property({ type: "json" })
  cost!: CostVehicleModType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  constructor(dto: VehicleModType) {
    this.name = dto.name;
    this.description = dto.description;
    this.type = dto.type;
    this.type = dto.type;
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
    if (dto.allowedSubsystemList !== undefined) {
      this.allowedSubsystemList = dto.allowedSubsystemList;
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

@Entity({ discriminatorValue: "Chasis" })
export class VehicleChasisModifications extends VehicleModifications {
  @Enum({ items: () => firearmWeaponTypeEnum, nullable: true, array: true })
  weaponMountValidCategoryList?: Array<firearmWeaponTypeEnum>;

  constructor(dto: VehicleModType) {
    super(dto);
    if (dto.weaponMountValidCategoryList !== undefined) {
      this.weaponMountValidCategoryList = dto.weaponMountValidCategoryList;
    }
  }
}
