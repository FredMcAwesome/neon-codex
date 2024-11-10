import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { LifestyleQualities } from "../otherData/lifestyleQualityModel.js";
import { Lifestyles } from "../otherData/lifestyleModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
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

  @Property()
  prepurchasedDuration!: number;

  constructor(dto: Ref<Lifestyles>, prepurchasedDuration: number) {
    this.lifestyle = dto;
    this.prepurchasedDuration = prepurchasedDuration;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackLifestyles extends ActiveLifestyles {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(lifestyle: Ref<Lifestyles>, prepurchasedDuration: number) {
    super(lifestyle, prepurchasedDuration);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedLifestyles extends ActiveLifestyles {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(lifestyle: Ref<Lifestyles>, prepurchasedDuration: number) {
    super(lifestyle, prepurchasedDuration);
  }
}
