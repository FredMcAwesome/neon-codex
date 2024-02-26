import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Qualities } from "../traits/qualityModel.js";

@Entity()
export class CustomisedQualities {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Qualities, ref: true })
  quality!: Ref<Qualities>;

  @Property()
  rating = 0;

  constructor(quality: Ref<Qualities>) {
    this.quality = quality;
  }
}
