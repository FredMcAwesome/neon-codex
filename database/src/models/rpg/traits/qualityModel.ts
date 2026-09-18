import {
  QualityRequirements,
  QualityForbidden,
  QualityKarmaDiscountRequirements,
} from "../otherData/requirementsModel.js";
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import { qualityCategoryEnum, sourceBookEnum } from "@neon-codex/common";
import type {
  QualityFirstLevelBonusType,
  QualityLimitType,
  QualityType,
} from "@neon-codex/common";
import { Weapons } from "../equipment/combat/weaponModel.js";
import { QualityBonuses } from "../otherData/bonusModel.js";

@Entity()
export class Qualities {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum({ items: () => qualityCategoryEnum })
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

  @Property({ nullable: true })
  karmaDiscountValue?: number;

  @OneToOne(
    () => QualityKarmaDiscountRequirements,
    (req) => req.requirementQualityKarmaDiscount,
    {
      owner: true,
      nullable: true,
      ref: true,
    }
  )
  karmaDiscountRequirements?: Ref<QualityKarmaDiscountRequirements>;

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

  @OneToOne(() => QualityBonuses, (bonus) => bonus.quality, {
    owner: true,
    nullable: true,
    ref: true,
  })
  bonus?: Ref<QualityBonuses>;

  @OneToOne(() => QualityRequirements, (req) => req.requirementQuality, {
    owner: true,
    nullable: true,
    ref: true,
  })
  requirements?: Ref<QualityRequirements>;

  @OneToOne(() => QualityForbidden, (req) => req.forbiddenQuality, {
    owner: true,
    nullable: true,
    ref: true,
  })
  forbidden?: Ref<QualityForbidden>;

  @Enum({ items: () => sourceBookEnum })
  source!: sourceBookEnum;

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
    // sharedLimitQualityList, bonus, requirements, and forbidden are linked by the seeder
    // karmaDiscountValue is scalar; karmaDiscountRequirements is linked by the seeder
    if (dto.karmaDiscount !== undefined)
      this.karmaDiscountValue = dto.karmaDiscount.value;
    if (dto.noLevels !== undefined) this.noLevels = dto.noLevels;
    if (dto.firstLevelBonus !== undefined)
      this.firstLevelBonus = dto.firstLevelBonus;
    if (dto.isMetagenic !== undefined) this.isMetagenic = dto.isMetagenic;
    if (dto.canBuyWithSpellPoints !== undefined)
      this.canBuyWithSpellPoints = dto.canBuyWithSpellPoints;
    if (dto.userSelectable !== undefined)
      this.userSelectable = dto.userSelectable;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
