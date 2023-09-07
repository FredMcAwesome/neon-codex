import { z as zod } from "zod";
import {
  BonusXmlSchema,
  GearXmlSchema,
  GearXmlType,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  WirelessXmlSchema,
} from "../ParserCommonDefines.js";
const GenericNameForcedSchema = zod
  .object({
    name: zod.string(),
    forced: zod.optional(zod.string()),
    rating: zod.optional(zod.number()),
  })
  .strict();

export enum limbSlotXmlEnum {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  SKULL = "skull",
}

export enum mountLocationXmlEnum {
  WRIST = "wrist",
  ANKLE = "ankle",
  ELBOW = "elbow",
  KNEE = "knee",
  SHOULDER = "shoulder",
  HIP = "hip",
}

const CyberwareRequiredXmlSchema = zod
  .object({
    oneof: zod.optional(
      zod
        .object({
          bioware: zod.optional(StringArrayOrStringSchema),
          metatype: zod.optional(zod.string()),
        })
        .strict()
    ),
    allof: zod.optional(
      zod
        .object({
          metatype: zod.optional(zod.string()),
          cyberware: zod.optional(StringArrayOrStringSchema),
        })
        .strict()
    ),
    parentdetails: zod.optional(
      zod
        .object({
          NONE: zod.optional(zod.literal("")),
          OR: zod.optional(
            zod
              .object({
                name: zod.array(
                  zod.union([
                    zod
                      .object({
                        xmltext: zod.string(),
                        _operation: zod.string(),
                      })
                      .strict(),
                    zod.string(),
                  ])
                ),
                NONE: zod.optional(zod.literal("")),
              })
              .strict()
          ),
          category: zod.optional(zod.string()),
          name: zod.optional(zod.string()),
        })
        .strict()
    ),
  })
  .strict();

type CyberwareSubsystemsRecursiveType = {
  gears?: GearXmlType | undefined;
  subsystems?: CyberwareSubsystemsXmlType | undefined;
};

const SubsystemInternalSchema: zod.ZodType<CyberwareSubsystemsRecursiveType> =
  GenericNameForcedSchema.extend({
    gears: zod.optional(GearXmlSchema),
    subsystems: zod.optional(zod.lazy(() => CyberwareSubsystemsXmlSchema)),
  }).strict();

const CyberwareSubsystemsXmlSchema = zod
  .object({
    cyberware: zod.optional(
      zod.union([SubsystemInternalSchema, zod.array(SubsystemInternalSchema)])
    ),
    bioware: zod.optional(
      zod.union([SubsystemInternalSchema, zod.array(SubsystemInternalSchema)])
    ),
  })
  .strict();

type CyberwareSubsystemsXmlType = zod.infer<
  typeof CyberwareSubsystemsXmlSchema
>;

const CyberwareXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    limit: zod.optional(
      zod.union([zod.literal("False"), zod.string(), zod.number()])
    ),
    category: StringArrayOrStringSchema,
    bannedgrades: zod.optional(
      zod
        .object({
          grade: zod.array(zod.string()),
        })
        .strict()
    ),
    ess: StringOrNumberSchema,
    addtoparentess: zod.optional(zod.literal("")),
    gears: zod.optional(GearXmlSchema),
    subsystems: zod.optional(CyberwareSubsystemsXmlSchema),
    minrating: zod.optional(StringOrNumberSchema),
    rating: zod.optional(StringOrNumberSchema),
    ratinglabel: zod.optional(zod.string()),
    programs: zod.optional(zod.literal("Rating")),
    capacity: zod.optional(StringOrNumberSchema),
    addtoparentcapacity: zod.optional(zod.literal("")),
    addparentweaponaccessory: zod.optional(zod.string()),
    avail: StringOrNumberSchema,
    cost: zod.optional(StringOrNumberSchema),
    removalcost: zod.optional(zod.number()),
    inheritattributes: zod.optional(zod.literal("")),
    addweapon: zod.optional(zod.string()),
    limbslot: zod.optional(zod.nativeEnum(limbSlotXmlEnum)),
    limbslotcount: zod.optional(zod.union([zod.number(), zod.literal("all")])),
    mountsto: zod.optional(zod.nativeEnum(mountLocationXmlEnum)),
    modularmount: zod.optional(zod.nativeEnum(mountLocationXmlEnum)),
    blocksmounts: zod.optional(zod.string()),
    selectside: zod.optional(zod.literal("")),
    bonus: zod.optional(BonusXmlSchema),
    wirelessbonus: zod.optional(WirelessXmlSchema),
    wirelesspairbonus: zod.optional(BonusXmlSchema),
    wirelesspairinclude: zod.optional(
      zod
        .object({
          name: zod.string(),
          _includeself: zod.literal("False"),
        })
        .strict()
    ),
    forbidden: zod.optional(
      zod
        .object({
          oneof: zod.optional(
            zod
              .object({
                cyberware: zod.optional(StringArrayOrStringSchema),
                bioware: zod.optional(StringArrayOrStringSchema),
                quality: zod.optional(zod.string()),
                cyberwarecontains: zod.optional(zod.string()),
              })
              .strict()
          ),
          parentdetails: zod.optional(
            zod
              .object({
                category: zod.string(),
              })
              .strict()
          ),
        })
        .strict()
    ),
    allowgear: zod.optional(
      zod.union([
        zod
          .object({
            gearcategory: zod.optional(StringArrayOrStringSchema),
            gearname: zod.optional(zod.array(zod.string())),
          })
          .strict(),
        zod.string(),
      ])
    ),
    allowsubsystems: zod.optional(
      zod
        .object({
          category: StringArrayOrStringSchema,
        })
        .strict()
    ),
    notes: zod.optional(zod.string()),
    requireparent: zod.optional(zod.literal("")),
    required: zod.optional(CyberwareRequiredXmlSchema),
    pairbonus: zod.optional(BonusXmlSchema),
    pairinclude: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    hide: zod.optional(zod.literal("")),
    forcegrade: zod.optional(
      zod.union([zod.literal("None"), zod.literal("Standard")])
    ),
    isgeneware: zod.optional(zod.literal("")),
    devicerating: zod.optional(zod.string()),
    addvehicle: zod.optional(zod.string()),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type CyberwareXmlType = zod.infer<typeof CyberwareXmlSchema>;
export const CyberwareListXmlSchema = zod.array(CyberwareXmlSchema);
export type CyberwareListXmlType = zod.infer<typeof CyberwareListXmlSchema>;
