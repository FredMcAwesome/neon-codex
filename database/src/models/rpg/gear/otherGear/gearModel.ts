import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToOne,
  Collection,
  ManyToMany,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import {
  gearCategoryEnum,
  personaFormEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import type {
  BonusType,
  WeaponBonusType,
} from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import type {
  AmmoForWeaponTypeType,
  AvailabilityGearType,
  CostGearType,
  GearCapacityInformationType,
  GearDeviceAttributeType,
  GearDeviceRatingType,
  GearProgramType,
  GearRatingType,
  OtherGearType,
  WeightType,
} from "@shadowrun/common/build/schemas/otherGearSchemas.js";
import type { RequirementsType } from "@shadowrun/common/src/schemas/shared/requiredSchemas.js";
import { CustomisedWeapons } from "../../activeTables/customisedWeaponModel.js";

@Entity()
export class Gears {
  @PrimaryKey()
  id!: number;

  // Not unique as many things may have the same name
  @Property({ length: 255 })
  name!: string;

  @Enum(() => gearCategoryEnum)
  category!: gearCategoryEnum;

  @Property({ type: "json", nullable: true })
  minRating?: GearRatingType;

  @Property({ type: "json", nullable: true })
  maxRating?: GearRatingType;

  @OneToOne({ entity: () => CustomisedWeapons, nullable: true, ref: true })
  includedWeapon?: Ref<CustomisedWeapons>;

  @Enum({ items: () => gearCategoryEnum, array: true, nullable: true })
  allowCategoryList?: Array<gearCategoryEnum>;

  @Property({ nullable: true })
  quantity?: number;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  weaponBonus?: WeaponBonusType;

  @Property({ nullable: true })
  isFlechetteAmmo?: true;

  @Property({ type: "json", nullable: true })
  flechetteWeaponBonus?: WeaponBonusType;

  @Property({ type: "json", nullable: true })
  ammoForWeaponType?: Array<AmmoForWeaponTypeType>;

  @Property({ type: "json", nullable: true })
  explosiveWeight?: WeightType;

  @Property({ nullable: true })
  userSelectable?: false;

  @ManyToMany({ entity: () => Gears, owner: true })
  allowedGearList = new Collection<Gears>(this);

  @ManyToMany({ entity: () => Gears, owner: true })
  includedGearList = new Collection<Gears>(this);

  @Property({ type: "json", nullable: true })
  deviceRating?: GearDeviceRatingType;

  @Property({ type: "json", nullable: true })
  programs?: GearProgramType;

  @Property({ type: "number[]", nullable: true })
  attributeArray?: Array<number>;

  @Property({ type: "json", nullable: true })
  attack?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  sleaze?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  dataProcessing?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  firewall?: GearDeviceAttributeType;

  @Enum({ items: () => personaFormEnum, nullable: true })
  canFormPersona?: personaFormEnum;

  @Property({ type: "json", nullable: true })
  capacityInformation?: GearCapacityInformationType;

  @Property({ type: "json", nullable: true })
  armourCapacityInformation?: GearCapacityInformationType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ nullable: true })
  requireParent?: true;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @Property({ type: "number[]", nullable: true })
  modifyAttributeArray?: Array<number>;

  @Property({ type: "json", nullable: true })
  modifyAttack?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  modifySleaze?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  modifyDataProcessing?: GearDeviceAttributeType;

  @Property({ type: "json", nullable: true })
  modifyFirewall?: GearDeviceAttributeType;

  @Property({ nullable: true })
  addMatrixBoxes?: number;

  @Property({ nullable: true })
  renameCustomLabel?: true;

  @Property({ type: "json" })
  availability!: AvailabilityGearType;

  @Property({ type: "json" })
  cost!: CostGearType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: OtherGearType) {
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    if (dto.minRating !== undefined) {
      this.minRating = dto.minRating;
    }
    if (dto.maxRating !== undefined) {
      this.maxRating = dto.maxRating;
    }
    // if (dto.includedWeapon !== undefined) {
    //   this.includedWeapon = dto.includedWeapon;
    // }
    if (dto.allowCategoryList !== undefined) {
      this.allowCategoryList = dto.allowCategoryList;
    }
    if (dto.quantity !== undefined) {
      this.quantity = dto.quantity;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    if (dto.weaponBonus !== undefined) {
      this.weaponBonus = dto.weaponBonus;
    }
    if (dto.isFlechetteAmmo !== undefined) {
      this.isFlechetteAmmo = dto.isFlechetteAmmo;
    }
    if (dto.flechetteWeaponBonus !== undefined) {
      this.flechetteWeaponBonus = dto.flechetteWeaponBonus;
    }
    if (dto.ammoForWeaponType !== undefined) {
      this.ammoForWeaponType = dto.ammoForWeaponType;
    }
    if (dto.explosiveWeight !== undefined) {
      this.explosiveWeight = dto.explosiveWeight;
    }
    if (dto.userSelectable !== undefined) {
      this.userSelectable = dto.userSelectable;
    }
    // if (dto.allowedGearList !== undefined) {
    //   this.allowedGearList = dto.allowedGearList;
    // }
    // if (dto.includedGearList !== undefined) {
    //   this.includedGearList = dto.includedGearList;
    // }
    if (dto.deviceRating !== undefined) {
      this.deviceRating = dto.deviceRating;
    }
    if (dto.programs !== undefined) {
      this.programs = dto.programs;
    }
    if (dto.attributeArray !== undefined) {
      this.attributeArray = dto.attributeArray;
    }
    if (dto.attack !== undefined) {
      this.attack = dto.attack;
    }
    if (dto.sleaze !== undefined) {
      this.sleaze = dto.sleaze;
    }
    if (dto.dataProcessing !== undefined) {
      this.dataProcessing = dto.dataProcessing;
    }
    if (dto.firewall !== undefined) {
      this.firewall = dto.firewall;
    }
    if (dto.canFormPersona !== undefined) {
      this.canFormPersona = dto.canFormPersona;
    }
    if (dto.capacityInformation !== undefined) {
      this.capacityInformation = dto.capacityInformation;
    }
    if (dto.armourCapacityInformation !== undefined) {
      this.armourCapacityInformation = dto.armourCapacityInformation;
    }
    if (dto.requirements !== undefined) {
      this.requirements = dto.requirements;
    }
    if (dto.requireParent !== undefined) {
      this.requireParent = dto.requireParent;
    }
    if (dto.forbidden !== undefined) {
      this.forbidden = dto.forbidden;
    }
    if (dto.modifyAttributeArray !== undefined) {
      this.modifyAttributeArray = dto.modifyAttributeArray;
    }
    if (dto.modifyAttack !== undefined) {
      this.modifyAttack = dto.modifyAttack;
    }
    if (dto.modifySleaze !== undefined) {
      this.modifySleaze = dto.modifySleaze;
    }
    if (dto.modifyDataProcessing !== undefined) {
      this.modifyDataProcessing = dto.modifyDataProcessing;
    }
    if (dto.modifyFirewall !== undefined) {
      this.modifyFirewall = dto.modifyFirewall;
    }
    if (dto.addMatrixBoxes !== undefined) {
      this.addMatrixBoxes = dto.addMatrixBoxes;
    }
    if (dto.renameCustomLabel !== undefined) {
      this.renameCustomLabel = dto.renameCustomLabel;
    }
    if (dto.bonus !== undefined) {
      this.bonus = dto.bonus;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}
