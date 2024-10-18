import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import { Qualities } from "../traits/qualityModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
export abstract class Bonuses {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  linkMentorSpirit?: true;

  @Property({ nullable: true })
  linkParagon?: true;

  constructor(dto: BonusType) {
    if (dto.linkMentorSpirit !== undefined) {
      this.linkMentorSpirit = dto.linkMentorSpirit;
    }
    if (dto.linkParagon !== undefined) {
      this.linkParagon = dto.linkParagon;
    }
  }
}

@Entity({
  discriminatorValue: "Quality",
})
export class QualityBonuses extends Bonuses {
  @OneToOne(() => Qualities, (quality) => quality.bonus, {
    ref: true,
  })
  quality!: Ref<Qualities>;

  constructor(dto: BonusType, quality: Ref<Qualities>) {
    super(dto);
    this.quality = quality;
  }
}
