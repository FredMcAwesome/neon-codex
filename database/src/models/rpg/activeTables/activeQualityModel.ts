import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Qualities } from "../traits/qualityModel.js";
import { Characters } from "../characters/characterModel.js";

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
  rating = 0;

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

@Entity({ discriminatorValue: "customised" })
export class CustomisedQualities extends ActiveQualities {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(quality: Ref<Qualities>, rating?: number) {
    super(quality, rating);
  }
}
