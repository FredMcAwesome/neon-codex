import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import { HeritagePriorities } from "./priorityModel.js";
import { Metatypes } from "../traits/metatypeModel.js";

type HeritagePriorityDetailsType = {
  heritage: Ref<Metatypes>;
  specialAttributePoints: number;
  karmaCost: number;
};

@Entity()
export class HeritagePriorityDetails {
  @PrimaryKey()
  id!: number;

  @Property()
  specialAttributePoints!: number;

  @Property()
  karmaCost!: number;

  @ManyToOne({ entity: () => HeritagePriorities, ref: true })
  heritagePriority!: Ref<HeritagePriorities>;

  @ManyToOne({ entity: () => Metatypes, ref: true })
  linkedHeritage!: Ref<Metatypes>;

  constructor(dto: HeritagePriorityDetailsType) {
    this.specialAttributePoints = dto.specialAttributePoints;
    this.karmaCost = dto.karmaCost;
    this.linkedHeritage = dto.heritage;
  }
}
