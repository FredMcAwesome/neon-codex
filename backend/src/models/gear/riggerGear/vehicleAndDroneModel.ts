import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type { AvailabilityType, CostType } from "@shadowrun/common";
import {
  vehicleDroneTypeEnum,
  groundcraftSubtypeEnum,
  watercraftSubtypeEnum,
  aircraftSubtypeEnum,
  droneSubtypeEnum,
} from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class VehiclesAndDrones {
  @PrimaryKey()
  id!: number;

  @Enum(() => vehicleDroneTypeEnum)
  type!: vehicleDroneTypeEnum;

  @Enum({
    items: [
      ...Object.values(groundcraftSubtypeEnum),
      ...Object.values(watercraftSubtypeEnum),
      ...Object.values(aircraftSubtypeEnum),
      ...Object.values(droneSubtypeEnum),
    ],
  })
  subtype!:
    | groundcraftSubtypeEnum
    | watercraftSubtypeEnum
    | aircraftSubtypeEnum
    | droneSubtypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "number[]" })
  handling!: number[];

  @Property({ type: "number[]" })
  speed!: number[];

  @Property()
  acceleration!: number;

  @Property()
  body!: number;

  @Property()
  armour!: number;

  @Property()
  pilot!: number;

  @Property()
  sensor!: number;

  @Property()
  seats!: number;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;
}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Groundcrafts })
export class Groundcrafts extends VehiclesAndDrones {}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Watercrafts })
export class Watercrafts extends VehiclesAndDrones {}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Aircrafts })
export class Aircrafts extends VehiclesAndDrones {}

@Entity({ discriminatorValue: vehicleDroneTypeEnum.Drones })
export class Drones extends VehiclesAndDrones {}
