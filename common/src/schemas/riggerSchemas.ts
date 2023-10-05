import { z as zod } from "zod";
import {
  aircraftSubtypeEnum,
  costRiggerEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleDroneTypeEnum,
  watercraftSubtypeEnum,
} from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";

export const AvailabilityRiggerSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityRiggerType = zod.infer<typeof AvailabilityRiggerSchema>;

const InnerCostRiggerSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costRiggerEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostRiggerType = Array<
  zod.infer<typeof InnerCostRiggerSchema> | { subnumbers: CostRiggerType }
>;
export const CostRiggerSchema: zod.ZodType<CostRiggerType> = zod.array(
  zod.union([
    InnerCostRiggerSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostRiggerSchema),
      })
      .strict(),
  ])
);

export const VehiclesAndDronesSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    type: zod.nativeEnum(vehicleDroneTypeEnum),
    subtype: zod.union([
      zod.nativeEnum(groundcraftSubtypeEnum),
      zod.nativeEnum(watercraftSubtypeEnum),
      zod.nativeEnum(aircraftSubtypeEnum),
      zod.nativeEnum(droneSubtypeEnum),
    ]),
    handling: zod.array(zod.number()),
    speed: zod.array(zod.number()),
    acceleration: zod.number(),
    body: zod.number(),
    armour: zod.number(),
    pilot: zod.number(),
    sensor: zod.number(),
    seats: zod.number(),
    availability: AvailabilityRiggerSchema,
    cost: CostRiggerSchema,
  })
  .strict();

export type VehiclesAndDronesType = zod.infer<typeof VehiclesAndDronesSchema>;
