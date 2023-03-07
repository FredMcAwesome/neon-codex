import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import {
  AccuracySchema,
  AvailabilitySchema,
  DamageSchema,
} from "@shadowrun/common";
import type { SkillType } from "@shadowrun/common";
import {
  attributeTypeEnum,
  augmentationClassificationEnum,
  gearCategoryEnum,
  skillCategoryEnum,
  sourceBookEnum,
} from "@shadowrun/common/src/enums.js";
import { CostSchema } from "@shadowrun/common/src/schemas/commonSchema.js";
import {
  typeInformationSchema,
  ArmourPenetrationSchema,
  AccessoriesSchema,
  AmmunitionSchema,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import { z as zod } from "zod";

@Entity()
export class Skills {
  @PrimaryKey()
  id!: string;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => attributeTypeEnum)
  attribute!: attributeTypeEnum;

  @Enum(() => skillCategoryEnum)
  category!: skillCategoryEnum;

  @Property()
  default!: boolean;

  @Property()
  exotic!: boolean;

  @Property({ nullable: true })
  skillGroup?: string;

  @Property({ type: "string[]", nullable: true })
  specialisations?: Array<string>;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: SkillType) {
    this.id = dto.id;
    this.name = dto.name;
    this.attribute = dto.attribute;
    this.category = dto.category;
    this.default = dto.default;
    this.exotic = dto.exotic;
    this.skillGroup = dto.skillGroup;
    this.specialisations = dto.specialisations;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

export const WeaponSummarySchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  typeInformation: typeInformationSchema,
  concealability: zod.number(),
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  ammunition: zod.optional(AmmunitionSchema),
  availability: AvailabilitySchema,
  cost: CostSchema,
  allowedGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
  accessories: zod.optional(AccessoriesSchema),
  allowAccessories: zod.boolean(),
  isCyberware: zod.boolean(),
  augmentationType: zod.nativeEnum(augmentationClassificationEnum),
  wireless: zod.optional(zod.string()),
  relatedSkill: zod.instanceof(Skills),
  relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
  source: zod.nativeEnum(sourceBookEnum),
  page: zod.number(),
});
export type WeaponSummaryType = zod.infer<typeof WeaponSummarySchema>;
const WeaponSummaryListSchema = zod.array(WeaponSummarySchema);
export type WeaponSummaryListType = zod.infer<typeof WeaponSummaryListSchema>;
