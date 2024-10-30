import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  type Ref,
} from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { LifestyleQualities } from "../otherData/lifestyleQualityModel.js";
import { Lifestyles } from "../otherData/lifestyleModel.js";

@Entity()
export class ActiveLifestyles {
  @PrimaryKey()
  id!: number;

  @ManyToMany({
    entity: () => LifestyleQualities,
    owner: true,
    joinColumn: "join_id",
  })
  lifestyleQualityList = new Collection<LifestyleQualities>(this);

  @ManyToOne({ entity: () => Lifestyles, ref: true })
  lifestyle!: Ref<Lifestyles>;

  @OneToOne(() => Characters, (character) => character.lifestyle, { ref: true })
  character!: Ref<Characters>;

  // No constructor as this should be added to character, not the other way around
  // constructor(dto: Ref<Lifestyles>, character: Ref<Characters>) {
  //   this.lifestyle = dto;
  //   this.character = character;
  // }
}
