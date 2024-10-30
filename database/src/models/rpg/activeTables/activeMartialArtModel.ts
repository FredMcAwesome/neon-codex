import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  type Ref,
} from "@mikro-orm/postgresql";
import { MartialArtTechniques } from "../abilities/martialArtTechniqueModel.js";
import { MartialArts } from "../abilities/martialArtModel.js";
import { Characters } from "../characters/characterModel.js";

@Entity()
export class ActiveMartialArts {
  @PrimaryKey()
  id!: number;

  @ManyToMany({
    entity: () => MartialArtTechniques,
    owner: true,
    joinColumn: "join_id",
  })
  selectedTechniqueList = new Collection<MartialArtTechniques>(this);

  @ManyToOne({ entity: () => MartialArts, ref: true })
  martialArt!: Ref<MartialArts>;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(dto: Ref<MartialArts>, character: Ref<Characters>) {
    this.martialArt = dto;
    this.character = character;
  }
}
