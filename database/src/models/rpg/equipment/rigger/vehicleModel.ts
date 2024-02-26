import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Collection,
  OneToMany,
  Unique,
} from "@mikro-orm/postgresql";
import {
  aircraftSubtypeEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  sourceBookEnum,
  vehicleTypeEnum,
  watercraftSubtypeEnum,
} from "@neon-codex/common/build/enums.js";
import { VehicleIncludedGears } from "../../activeTables/activeGearModel.js";
import { IncludedVehicleModifications } from "../../activeTables/activeVehicleModificationModel.js";
import { IncludedWeaponMounts } from "../../activeTables/activeWeaponMountModel.js";
import type {
  VehicleOnOffRoadType,
  AvailabilityVehicleType,
  CostVehicleType,
  VehicleType,
  VehicleSeatsType,
  GroundcraftVehicleType,
  WatercraftVehicleType,
  AircraftVehicleType,
  DroneVehicleType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Vehicles {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ length: 5000 })
  description!: string;

  @Enum(() => vehicleTypeEnum)
  type!: vehicleTypeEnum;

  @Property({ type: "json" })
  handling!: VehicleOnOffRoadType;

  @Property({ type: "json" })
  speed!: VehicleOnOffRoadType;

  @Property({ type: "json" })
  acceleration!: VehicleOnOffRoadType;

  @Property()
  body!: number;

  @Property()
  armour!: number;

  @Property()
  pilot!: number;

  @Property()
  sensor!: number;

  @OneToMany(
    () => VehicleIncludedGears,
    (vehicleIncludedGear) => vehicleIncludedGear.vehicle
  )
  includedGearList = new Collection<VehicleIncludedGears>(this);

  @OneToMany(
    () => IncludedVehicleModifications,
    (vehicleIncludedMods) => vehicleIncludedMods.standardVehicle
  )
  includedModList = new Collection<IncludedVehicleModifications>(this);

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

  @OneToMany(
    () => IncludedWeaponMounts,
    (weaponMount) => weaponMount.standardVehicle
  )
  includedWeaponMountList = new Collection<IncludedWeaponMounts>(this);

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json" })
  availability!: AvailabilityVehicleType;

  @Property({ type: "json" })
  cost!: CostVehicleType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  constructor(dto: VehicleType) {
    this.name = dto.name;
    this.description = dto.description;
    this.type = dto.type;
    if (dto.handling !== undefined) {
      this.handling = dto.handling;
    }
    if (dto.speed !== undefined) {
      this.speed = dto.speed;
    }
    if (dto.acceleration !== undefined) {
      this.acceleration = dto.acceleration;
    }
    this.body = dto.body;
    this.armour = dto.armour;
    this.pilot = dto.pilot;
    this.sensor = dto.sensor;
    // if (dto.includedGearList !== undefined) {
    //   this.includedGearList = dto.includedGearList;
    // }
    // if (dto.includedMods !== undefined) {
    //   this.includedMods = dto.includedMods;
    // }
    if (dto.modSlots !== undefined) {
      this.modSlots = dto.modSlots;
    }
    if (dto.powerTrainModSlots !== undefined) {
      this.powerTrainModSlots = dto.powerTrainModSlots;
    }
    if (dto.protectionModSlots !== undefined) {
      this.protectionModSlots = dto.protectionModSlots;
    }
    if (dto.weaponModSlots !== undefined) {
      this.weaponModSlots = dto.weaponModSlots;
    }
    if (dto.bodyModSlots !== undefined) {
      this.bodyModSlots = dto.bodyModSlots;
    }
    if (dto.electromagneticModSlots !== undefined) {
      this.electromagneticModSlots = dto.electromagneticModSlots;
    }
    if (dto.cosmeticModSlots !== undefined) {
      this.cosmeticModSlots = dto.cosmeticModSlots;
    }
    // if (dto.weaponMountList !== undefined) {
    //   this.weaponMountList = dto.weaponMountList;
    // }
    if (dto.userSelectable !== undefined) {
      this.userSelectable = dto.userSelectable;
    }
    this.availability = dto.availability;
    this.cost = dto.cost;
    this.source = dto.source;
    this.page = dto.page;
  }
}

type MannedVehicleType = VehicleType &
  (
    | {
        type: vehicleTypeEnum.Groundcraft;
      }
    | {
        type: vehicleTypeEnum.Watercraft;
      }
    | {
        type: vehicleTypeEnum.Aircraft;
      }
  );

@Entity()
export abstract class MannedVehicles extends Vehicles {
  @Property({ type: "json" })
  seats!: VehicleSeatsType;

  constructor(dto: MannedVehicleType) {
    super(dto);
    this.seats = dto.seats;
  }
}

@Entity({ discriminatorValue: vehicleTypeEnum.Groundcraft })
export class Groundcrafts extends MannedVehicles {
  @Property()
  subtype!: groundcraftSubtypeEnum;

  constructor(dto: GroundcraftVehicleType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}

@Entity({ discriminatorValue: vehicleTypeEnum.Watercraft })
export class Watercrafts extends MannedVehicles {
  @Property()
  subtype!: watercraftSubtypeEnum;

  constructor(dto: WatercraftVehicleType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}

@Entity({ discriminatorValue: vehicleTypeEnum.Aircraft })
export class Aircrafts extends MannedVehicles {
  @Property()
  subtype!: aircraftSubtypeEnum;

  constructor(dto: AircraftVehicleType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}

@Entity({ discriminatorValue: vehicleTypeEnum.Drone })
export class Drones extends Vehicles {
  @Property()
  subtype!: droneSubtypeEnum;

  constructor(dto: DroneVehicleType) {
    super(dto);
    this.subtype = dto.subtype;
  }
}
