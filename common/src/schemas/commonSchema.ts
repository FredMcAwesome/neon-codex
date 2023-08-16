import { z as zod } from "zod";
import {
  availabilityTypeEnum,
  costTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "../enums.js";
export const GearCalculation = zod.array(
  zod.union([
    zod.number(),
    zod.object({
      option: zod.enum([
        "Rating",
        "Weapon",
        "Chemical",
        "Sensor",
        "Capacity",
        "Force",
      ]),
    }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
  ])
);

export type GearCalculationType = zod.infer<typeof GearCalculation>;

export const BaseOrSpecial = zod.union([
  zod.number(),
  zod.enum(["Calculation"]),
]);

// availability rating is a recursive type
export const AvailabilityRatingSubnumberSchema = zod.union([
  zod.number(),
  zod.object({
    option: zod.nativeEnum(availabilityTypeEnum),
  }),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
]);
export type AvailabilityRatingType = Array<
  | zod.infer<typeof AvailabilityRatingSubnumberSchema>
  | {
      subnumbers?: AvailabilityRatingType;
    }
>;
export const AvailabilityRatingSchema: zod.ZodType<AvailabilityRatingType> =
  zod.array(
    zod.union([
      AvailabilityRatingSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => AvailabilityRatingSchema),
        })
        .strict(),
    ])
  );

export const AvailabilitySchema = zod.object({
  rating: AvailabilityRatingSchema,
  restriction: zod.nativeEnum(restrictionEnum),
});
export type AvailabilityType = zod.infer<typeof AvailabilitySchema>;

export const ValueRangeSchema = zod.union([
  zod.object({
    minimum: zod.optional(zod.number()),
    maximum: zod.optional(zod.number()),
  }),
  zod.object({
    base: BaseOrSpecial,
    specialCalculation: GearCalculation,
  }),
]);
export const RatingSchema = ValueRangeSchema;
export type RatingType = zod.infer<typeof RatingSchema>;

const InnerCostSchema = zod.union([
  zod.number(),
  zod.object({
    option: zod.nativeEnum(costTypeEnum),
  }),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
]);

export type CostType = Array<
  zod.infer<typeof InnerCostSchema> | { subnumbers?: CostType }
>;
export const CostSchema: zod.ZodType<CostType> = zod.array(
  zod.union([
    InnerCostSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostSchema),
      })
      .strict(),
  ])
);

export const CapacitySchema = ValueRangeSchema;
export type CapacityType = zod.infer<typeof CapacitySchema>;

export enum weaponXmlSubtypeEnum {
  Blades = "Blades",
  Clubs = "Clubs",
  Gear = "Gear",
  ExoticMeleeWeapons = "Exotic Melee Weapons",
  ExoticRangedWeapons = "Exotic Ranged Weapons",
  Flamethrowers = "Flamethrowers",
  Cyberweapon = "Cyberweapon",
  Bows = "Bows",
  Crossbows = "Crossbows",
  Tasers = "Tasers",
  Holduts = "Holdouts",
  LightPistols = "Light Pistols",
  HeavyPistols = "Heavy Pistols",
  MachinePistols = "Machine Pistols",
  SubmachineGuns = "Submachine Guns",
  AssaultRifles = "Assault Rifles",
  SportingRifles = "Sporting Rifles",
  Shotguns = "Shotguns",
  SniperRifles = "Sniper Rifles",
  LightMachineguns = "Light Machine Guns",
  MediumMachineguns = "Medium Machine Guns",
  HeavyMachineguns = "Heavy Machine Guns",
  AssaultCannons = "Assault Cannons",
  GrenadeLaunchers = "Grenade Launchers",
  MissileLaunchers = "Missile Launchers",
  ImprovisedWeapons = "Improvised Weapons",
  LaserWeapons = "Laser Weapons",
  Unarmed = "Unarmed",
  Quality = "Quality",
  UnderbarrelWeapons = "Underbarrel Weapons",
  BioWeapon = "Bio-Weapon",
  Carbines = "Carbines",
  Rifles = "Rifles",
  Pistol = "Pistol",
}

export const WeaponXmlSubtypeSchema = zod.nativeEnum(weaponXmlSubtypeEnum);
export type WeaponXmlSubtypeType = zod.infer<typeof WeaponXmlSubtypeSchema>;
