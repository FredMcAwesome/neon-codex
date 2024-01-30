import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Cyberwares } from "../equipment/bodyModification/augmentationModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { VehicleModifications } from "../equipment/rigger/vehicleModificationModel.js";
import { CustomisedVehicles } from "./customisedVehicleModel.js";

// Links to either a custom vehicle, or a vehicle in the table.
// When we create a custom vehicle that already has a modification
// we will need to create a new accessory with the same base details.

// one link to customised vehicle and one to vehicle as we don't have polymorphic relationships yet
// https://github.com/mikro-orm/mikro-orm/issues/706
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveVehicleModifications {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => VehicleModifications, ref: true })
  vehicleModification: Ref<VehicleModifications>;

  @Property({ nullable: true })
  actsAsCyberarm?: true;

  // TODO: should this be limited to only 1 cyberware?
  @ManyToMany({ entity: () => Cyberwares, owner: true })
  associatedCyberwareList = new Collection<Cyberwares>(this);

  @Property({ nullable: true })
  specificOption?: string;

  @Property({ nullable: true })
  rating?: number;

  constructor(
    vehicleModification: Ref<VehicleModifications>,
    specificOption?: string,
    rating?: number
  ) {
    this.vehicleModification = vehicleModification;
    if (rating) this.rating = rating;
    if (specificOption) this.specificOption = specificOption;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedVehicleModifications extends ActiveVehicleModifications {
  @ManyToOne({ entity: () => Vehicles, ref: true })
  standardVehicle: Ref<Vehicles>;

  constructor(
    vehicle: Ref<Vehicles>,
    vehicleModification: Ref<VehicleModifications>,
    specificOption?: string,
    rating?: number
  ) {
    super(vehicleModification, specificOption, rating);
    this.standardVehicle = vehicle;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedVehicleModifications extends ActiveVehicleModifications {
  @ManyToOne({ entity: () => CustomisedVehicles, ref: true })
  customisedVehicle: Ref<CustomisedVehicles>;

  constructor(
    vehicle: Ref<CustomisedVehicles>,
    vehicleModification: Ref<VehicleModifications>,
    specificOption?: string,
    rating?: number
  ) {
    super(vehicleModification, specificOption, rating);
    this.customisedVehicle = vehicle;
  }
}
