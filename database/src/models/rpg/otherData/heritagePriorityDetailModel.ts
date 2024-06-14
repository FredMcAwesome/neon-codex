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
  heritagePriority: Ref<Priorities>;
  heritage: Ref<Heritages>;
  specialAttributePoints: number;
  karmaCost: number;
  corePriorityHeritage?: Ref<HeritagePriorityDetails>;
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
  corePriorityHeritage?: Ref<HeritagePriorityDetails>;

  @OneToMany(
    () => HeritagePriorityDetails,
    (metavariant) => metavariant.corePriorityHeritage
  )
  metavariantList = new Collection<HeritagePriorityDetails>(this);

  @ManyToOne({ entity: () => Priorities, ref: true })
  heritagePriority!: Ref<Priorities>;

  @ManyToOne({ entity: () => Heritages, ref: true })
  linkedHeritage!: Ref<Heritages>;

  constructor(dto: HeritagePriorityDetailsType) {
    this.heritagePriority = dto.heritagePriority;
    this.specialAttributePoints = dto.specialAttributePoints;
    this.karmaCost = dto.karmaCost;
    this.linkedHeritage = dto.heritage;
    if (dto.corePriorityHeritage !== undefined) {
      this.corePriorityHeritage = dto.corePriorityHeritage;
    }
  }
}
