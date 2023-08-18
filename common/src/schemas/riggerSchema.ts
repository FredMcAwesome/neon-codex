import { z as zod } from "zod";
import {
  aircraftSubtypeEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  vehicleDroneTypeEnum,
  watercraftSubtypeEnum,
} from "../enums.js";
import { AvailabilitySchema, CostSchema } from "./commonSchema.js";

export const VehiclesAndDronesSchema = zod
  .object({
    type: zod.nativeEnum(vehicleDroneTypeEnum),
    subtype: zod.union([
      zod.nativeEnum(groundcraftSubtypeEnum),
      zod.nativeEnum(watercraftSubtypeEnum),
      zod.nativeEnum(aircraftSubtypeEnum),
      zod.nativeEnum(droneSubtypeEnum),
    ]),
    name: zod.string(),
    handling: zod.array(zod.number()),
    speed: zod.array(zod.number()),
    acceleration: zod.number(),
    body: zod.number(),
    armour: zod.number(),
    pilot: zod.number(),
    sensor: zod.number(),
    seats: zod.number(),
    availability: AvailabilitySchema,
    cost: CostSchema,
    description: zod.string(),
  })
  .strict();

export type VehiclesAndDronesType = zod.infer<typeof VehiclesAndDronesSchema>;
