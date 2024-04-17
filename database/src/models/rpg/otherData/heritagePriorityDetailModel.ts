import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
  OneToMany,
  Collection,
} from "@mikro-orm/postgresql";
import { Priorities } from "./priorityModel.js";
import { Heritages } from "../traits/heritageModel.js";

type HeritagePriorityDetailsType = {
  heritage: Ref<Heritages>;
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

  @ManyToOne({
    entity: () => HeritagePriorityDetails,
    ref: true,
    nullable: true,
  })
  coreHeritage?: Ref<HeritagePriorityDetails>;

  @OneToMany(
    () => HeritagePriorityDetails,
    (metavariant) => metavariant.coreHeritage
  )
  metavariantList = new Collection<HeritagePriorityDetails>(this);

  @ManyToOne({ entity: () => Priorities, ref: true })
  heritagePriority!: Ref<Priorities>;

  @ManyToOne({ entity: () => Heritages, ref: true })
  linkedHeritage!: Ref<Heritages>;

  constructor(dto: HeritagePriorityDetailsType) {
    this.specialAttributePoints = dto.specialAttributePoints;
    this.karmaCost = dto.karmaCost;
    this.linkedHeritage = dto.heritage;
  }
}
