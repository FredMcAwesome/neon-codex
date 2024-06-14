import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import type { CustomKnowledgeSkillType } from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import {
  attributeTypeEnum,
  skillCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { Critters } from "../creatures/critterModel.js";
import { Characters } from "../characters/characterModel.js";
import type { CritterIncludedKnowledgeSkillType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export class ActiveKnowledgeSkills {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Enum(() => skillCategoryEnum)
  category!: skillCategoryEnum;

  @Enum(() => attributeTypeEnum)
  attribute!: attributeTypeEnum;

  @Property()
  skillPoints: number = 0;

  @Property()
  karmaPoints: number = 0;

  @Property({ type: "string[]", nullable: true })
  specialisationsSelected?: Array<string>;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: CustomKnowledgeSkillType) {
    this.name = dto.name;
    this.category = dto.category;
    this.attribute = dto.attribute;
    this.skillPoints = dto.skillPoints;
    this.karmaPoints = dto.karmaPoints;
    if (dto.specialisationsSelected !== undefined) {
      this.specialisationsSelected = dto.specialisationsSelected;
    }
    this.description = dto.description;
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedKnowledgeSkills extends ActiveKnowledgeSkills {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  constructor(
    standardCritter: Ref<Critters>,
    critterskillInfo: CritterIncludedKnowledgeSkillType
  ) {
    const skillInfo: CustomKnowledgeSkillType = {
      ...critterskillInfo,
      karmaPoints: 0,
    };
    super(skillInfo);
    this.standardCritter = standardCritter;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedKnowledgeSkills extends ActiveKnowledgeSkills {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(character: Ref<Characters>, skillInfo: CustomKnowledgeSkillType) {
    super(skillInfo);
    this.character = character;
  }
}
