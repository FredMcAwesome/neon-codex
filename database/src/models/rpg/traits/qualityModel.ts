import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import { qualityCategoryEnum } from "@neon-codex/common/build/enums.js";
import type {
  QualityFirstLevelBonusType,
  QualityKarmaDiscountType,
  QualityLimitType,
  QualityType,
} from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";

@Entity()
export class Qualities {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => qualityCategoryEnum)
  category!: qualityCategoryEnum;

  @Property()
  karma!: number;

  @Property({ nullable: true })
  charGenOnly?: true;

  @Property({ nullable: true })
  charGenLimit?: number;

  @Property({ nullable: true })
  charGenDoNotContributeToKarmaLimit?: true;

  @Property({ nullable: true })
  charGenNoKarma?: true;

  @Property({ nullable: true })
  chargenQualityOnly_NotSelectableIfPriorityChargen?: true;

  @Property({ nullable: true })
  careerOnly?: true;

  @Property({ nullable: true })
  charGenCostInCareer?: true;

  @Property({ type: "json", nullable: true })
  limit?: QualityLimitType;

  @ManyToMany({ entity: () => Qualities, owner: true })
  sharedLimitQualityList = new Collection<Qualities>(this);

  @Property({ type: "json", nullable: true })
  karmaDiscount?: QualityKarmaDiscountType;

  @Property({ nullable: true })
  noLevels?: true;

  @Property({ type: "json", nullable: true })
  firstLevelBonus?: QualityFirstLevelBonusType;

  @ManyToMany({ entity: () => Weapons, owner: true })
  includedWeaponList = new Collection<Weapons>(this);

  @Property({ nullable: true })
  isMetagenic?: true;

  @Property({ nullable: true })
  canBuyWithSpellPoints?: true;

  @Property({ nullable: true })
  userSelectable?: false;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Property({ type: "json", nullable: true })
  forbidden?: RequirementsType;

  @Property()
  source!: string;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: QualityType) {
    this.name = dto.name;
    this.category = dto.category;
    if (dto.karma !== undefined) this.karma = dto.karma;
    if (dto.charGenOnly !== undefined) this.charGenOnly = dto.charGenOnly;
    if (dto.charGenLimit !== undefined) this.charGenLimit = dto.charGenLimit;
    if (dto.charGenDoNotContributeToKarmaLimit !== undefined)
      this.charGenDoNotContributeToKarmaLimit =
        dto.charGenDoNotContributeToKarmaLimit;
    if (dto.charGenNoKarma !== undefined)
      this.charGenNoKarma = dto.charGenNoKarma;
    if (dto.chargenQualityOnly_NotSelectableIfPriorityChargen !== undefined)
      this.chargenQualityOnly_NotSelectableIfPriorityChargen =
        dto.chargenQualityOnly_NotSelectableIfPriorityChargen;
    if (dto.careerOnly !== undefined) this.careerOnly = dto.careerOnly;
    if (dto.charGenCostInCareer !== undefined)
      this.charGenCostInCareer = dto.charGenCostInCareer;
    if (dto.limit !== undefined) this.limit = dto.limit;
    // if (dto.sharedLimitQualityList !== undefined)
    //   this.sharedLimitQualityList = dto.sharedLimitQualityList;
    if (dto.karmaDiscount !== undefined) this.karmaDiscount = dto.karmaDiscount;
    if (dto.noLevels !== undefined) this.noLevels = dto.noLevels;
    if (dto.firstLevelBonus !== undefined)
      this.firstLevelBonus = dto.firstLevelBonus;
    if (dto.isMetagenic !== undefined) this.isMetagenic = dto.isMetagenic;
    if (dto.canBuyWithSpellPoints !== undefined)
      this.canBuyWithSpellPoints = dto.canBuyWithSpellPoints;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    if (dto.forbidden !== undefined) this.forbidden = dto.forbidden;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
