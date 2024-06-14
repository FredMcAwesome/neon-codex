import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Qualities } from "../traits/qualityModel.js";
import { Characters } from "../characters/characterModel.js";
import { Critters } from "../creatures/critterModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveQualities {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Qualities, ref: true })
  quality!: Ref<Qualities>;

  @Property()
  rating: number = 0;

  constructor(quality: Ref<Qualities>, rating?: number) {
    this.quality = quality;
    if (rating !== undefined) {
      this.rating = rating;
    }
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedQualities extends ActiveQualities {
  constructor(quality: Ref<Qualities>, rating?: number) {
    super(quality, rating);
  }
}

@Entity({ discriminatorValue: "critterIncluded" })
export class CritterIncludedQualities extends ActiveQualities {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter!: Ref<Critters>;

  constructor(
    standardCritter: Ref<Critters>,
    quality: Ref<Qualities>,
    rating?: number
  ) {
    super(quality, rating);
    this.standardCritter = standardCritter;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedQualities extends ActiveQualities {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(
    character: Ref<Characters>,
    quality: Ref<Qualities>,
    rating?: number
  ) {
    super(quality, rating);
    this.character = character;
  }
}
