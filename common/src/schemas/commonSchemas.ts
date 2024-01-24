import { z as zod } from "zod";
import {
  availabilityEnum,
  gearCategoryEnum,
  mathOperatorEnum,
  ratingAugmentationEnum,
} from "../enums.js";

export const GearCalculation = zod.array(
  zod.union([
    zod.number(),
    zod
      .object({
        option: zod.enum([
          "Rating",
          "Weapon",
          "Chemical",
          "Sensor",
          "Capacity",
          "Force",
        ]),
      })
      .strict(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  ])
);

export type GearCalculationType = zod.infer<typeof GearCalculation>;

export const BaseOrSpecialSchema = zod.union([
  zod.number(),
  zod.enum(["Calculation"]),
]);

// availability rating is a recursive type
export const AvailabilityRatingSubnumberSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(availabilityEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
export type AvailabilityRatingType = Array<
  | zod.infer<typeof AvailabilityRatingSubnumberSchema>
  | {
      subnumbers: AvailabilityRatingType;
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

const ratingCalculation = zod.array(
  zod.union([
    zod.number(),
    zod
      .object({
        option: zod.nativeEnum(ratingAugmentationEnum),
      })
      .strict(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  ])
);

export const ValueRangeSchema = zod.union([
  zod
    .object({
      minimum: zod.optional(ratingCalculation),
      maximum: zod.optional(ratingCalculation),
    })
    .strict(),
  zod
    .object({
      base: BaseOrSpecialSchema,
      specialCalculation: GearCalculation,
    })
    .strict(),
]);
export const RatingSchema = ValueRangeSchema;
export type RatingType = zod.infer<typeof RatingSchema>;

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
  Holdouts = "Holdouts",
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

const UseGearSchema = zod
  .object({
    name: zod.string(),
    specificOption: zod.optional(zod.string()),
    rating: zod.optional(zod.number()),
    consumeCapacity: zod.optional(zod.literal(true)),
    quantity: zod.optional(zod.number()),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
  })
  .strict();
export type useGearType = zod.infer<typeof UseGearSchema>;

export const UseGearListSchema = zod.array(UseGearSchema);
export type UseGearListType = zod.infer<typeof UseGearListSchema>;
