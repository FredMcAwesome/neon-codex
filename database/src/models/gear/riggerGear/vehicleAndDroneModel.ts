import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/postgresql";
import {
  vehicleDroneTypeEnum,
  groundcraftSubtypeEnum,
  watercraftSubtypeEnum,
  aircraftSubtypeEnum,
  droneSubtypeEnum,
} from "@shadowrun/common";
import type {
  AvailabilityRiggerType,
  CostRiggerType,
  RiggerOnOffRoadType,
  VehicleSeatsType,
  WeaponMountListType,
} from "@shadowrun/common/build/schemas/riggerSchemas.js";
import { sourceBookEnum } from "@shadowrun/common/build/enums.js";
import type { UseGearListType } from "@shadowrun/common/src/schemas/commonSchemas.js";
import type { ModListType } from "@shadowrun/common/src/schemas/shared/modSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class VehiclesAndDrones {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property({ length: 5000 })
  description!: string;

  @Enum(() => vehicleDroneTypeEnum)
  type!: vehicleDroneTypeEnum;

  @Property({ type: "json" })
  handling!: RiggerOnOffRoadType;

  @Property({ type: "json" })
  speed!: RiggerOnOffRoadType;

  @Property({ type: "json" })
  acceleration!: RiggerOnOffRoadType;

  @Property()
  body!: number;

  @Property()
  armour!: number;

  @Property()
  pilot!: number;

  @Property()
  sensor!: number;

  @Property({ type: "json" })
  seats!: VehicleSeatsType;

  @Property({ nullable: true })
  includedGear?: UseGearListType;

  @Property({ type: "json" })
  includedMods?: ModListType;

  @Property({ nullable: true })
  modSlots?: number;

  @Property({ nullable: true })
  powerTrainModSlots?: number;

  @Property({ nullable: true })
  protectionModSlots?: number;

  @Property({ nullable: true })
  weaponModSlots?: number;

  @Property({ nullable: true })
  bodyModSlots?: number;

  @Property({ nullable: true })
  electromagneticModSlots?: number;

  @Property({ nullable: true })
  cosmeticModSlots?: number;

  @Property({ type: "string[]", nullable: true })
  weaponList?: Array<string>;

  @Property({ type: "json", nullable: true })
  weaponMountList?: WeaponMountListType;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityRiggerType;

  @Property({ type: "json" })
  cost!: CostRiggerType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;
}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Groundcraft })
export class Groundcrafts extends VehiclesAndDrones {
  @Property()
  subtype!: groundcraftSubtypeEnum;
}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Watercraft })
export class Watercrafts extends VehiclesAndDrones {
  @Property()
  subtype!: watercraftSubtypeEnum;
}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Aircraft })
export class Aircrafts extends VehiclesAndDrones {
  @Property()
  subtype!: aircraftSubtypeEnum;
}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Drone })
export class Drones extends VehiclesAndDrones {
  @Property()
  subtype!: droneSubtypeEnum;
}
