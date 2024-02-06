import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import { CustomisedWeapons } from "../activeTables/customisedWeaponModel.js";
import type {
  AttributesType,
  SpecialAttributesType,
} from "@neon-codex/common/build/schemas/characterSchemas.js";

@Entity()
export class Characters {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  metatype!: string;

  @Property()
  priorities!: string;

  @Property({ type: "json" })
  attributes!: AttributesType;

  @Property({ type: "json" })
  specialAttributes!: SpecialAttributesType;

  @Property()
  qualities!: string;

  @Property()
  nuyen!: number;

  @Property()
  karmaPoints!: number;

  @OneToMany(() => CustomisedWeapons, (weapons) => weapons.character)
  weapons = new Collection<CustomisedWeapons>(this);

  constructor(dto: {
    name: string;
    metatype: string;
    priorities: string;
    attributes: AttributesType;
    specialAttributes: SpecialAttributesType;
    qualities: string;
    nuyen: number;
    karmaPoints: number;
  }) {
    this.name = dto.name;
    this.metatype = dto.metatype;
    this.priorities = dto.priorities;
    this.attributes = dto.attributes;
    this.specialAttributes = dto.specialAttributes;
    this.qualities = dto.qualities;
    this.nuyen = dto.nuyen;
    this.karmaPoints = dto.karmaPoints;
  }
}
