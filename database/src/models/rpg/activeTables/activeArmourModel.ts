import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedArmourModifications } from "./activeArmourModificationModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { Characters } from "../characters/characterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { ActiveArmourIncludedGears } from "./activeGearModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveArmours {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Armours, ref: true })
  armour!: Ref<Armours>;

  @OneToMany(
    () => CustomisedArmourModifications,
    (armourModifications) => armourModifications.customisedArmour
  )
  accessories = new Collection<CustomisedArmourModifications>(this);

  @OneToMany(() => ActiveArmourIncludedGears, (gear) => gear.activeArmour)
  gears = new Collection<ActiveArmourIncludedGears>(this);

  constructor(armour: Ref<Armours>) {
    this.armour = armour;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackArmours extends ActiveArmours {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  constructor(armour: Ref<Armours>) {
    super(armour);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedArmours extends ActiveArmours {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property({ nullable: true })
  customName?: string;

  constructor(character: Ref<Characters>, armour: Ref<Armours>) {
    super(armour);
    this.character = character;
  }
}
