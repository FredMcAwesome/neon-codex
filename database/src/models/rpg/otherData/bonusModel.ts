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
    if (dto.spellAndMagic?.linkMentorSpirit !== undefined) {
      this.linkMentorSpirit = dto.spellAndMagic.linkMentorSpirit;
    }
    if (dto.technomancer?.linkParagon !== undefined) {
      this.linkParagon = dto.technomancer.linkParagon;
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

  constructor(quality: Ref<Qualities>, dto: BonusType) {
    super(dto);
    this.quality = quality;
  }
}
