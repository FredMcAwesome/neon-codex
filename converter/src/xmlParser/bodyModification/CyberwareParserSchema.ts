import { z as zod } from "zod";
import {
  GearXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  WirelessXmlSchema,
} from "../ParserCommonDefines.js";

const GenericNameValueSchema = zod
  .object({
    name: zod.string(),
    val: zod.optional(StringOrNumberSchema),
    max: zod.optional(StringOrNumberSchema),
    aug: zod.optional(zod.string()),
    _precedence: zod.optional(zod.string()),
  })
  .strict();

const GenericNameForcedSchema = zod
  .object({
    name: zod.string(),
    forced: zod.optional(zod.string()),
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
    subsystems: zod.optional(
      zod
        .object({
          cyberware: zod.union([
            GenericNameForcedSchema,
            zod.array(GenericNameForcedSchema),
          ]),
        })
        .strict()
    ),
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
    bonus: zod.optional(
      zod.union([
        zod
          .object({
            damageresistance: zod.optional(zod.number()),
            unarmeddv: zod.optional(zod.number()),
            unarmeddvphysical: zod.optional(zod.literal("")),
            specificattribute: zod.optional(
              zod.union([
                GenericNameValueSchema,
                zod.array(GenericNameValueSchema),
              ])
            ),
          })
          .strict(),
        zod.literal(""),
      ])
    ),
    wirelessbonus: zod.optional(WirelessXmlSchema),
    wirelesspairbonus: zod.optional(
      zod
        .object({
          specificattribute: zod.optional(
            zod.union([
              GenericNameValueSchema,
              zod.array(GenericNameValueSchema),
            ])
          ),
          _mode: zod.optional(zod.string()),
        })
        .strict()
    ),
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
    required: zod.optional(
      zod
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
        })
        .strict()
    ),
    pairbonus: zod.optional(
      zod
        .object({
          walkmultiplier: zod.optional(
            zod
              .object({
                val: zod.optional(zod.number()),
                category: zod.string(),
                percent: zod.optional(zod.number()),
              })
              .strict()
          ),
          unarmedreach: zod.optional(zod.number()),
        })
        .strict()
    ),
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
