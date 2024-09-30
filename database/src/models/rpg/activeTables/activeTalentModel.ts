import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  type Ref,
} from "@mikro-orm/postgresql";
import { Spells } from "../abilities/spellModel.js";
import type {
  DepthTalentInfoType,
  MagicTalentInfoType,
  MundaneTalentInfoType,
  ResonanceTalentInfoType,
  TalentInfoType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { Characters } from "../characters/characterModel.js";
import { Traditions } from "../traits/traditionModel.js";
import { Critters } from "../creatures/critterModel.js";
import { AdeptPowers } from "../abilities/adeptPowerModel.js";
import { ComplexForms } from "../abilities/complexFormModel.js";
import { ActivePrograms } from "./activeProgramModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
@Entity()
export abstract class ActiveTalents {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => Characters, (character) => character.talent, { ref: true })
  character!: Ref<Characters>;

  constructor(_: TalentInfoType) {}
}

@Entity({
  discriminatorValue: "Magic",
})
export class ActiveMagicTalents extends ActiveTalents {
  @ManyToOne({ entity: () => Traditions, ref: true })
  tradition!: Ref<Traditions>;

  // TODO: mark this as discriminated somehow?
  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  combatSpirit?: Ref<Critters>;
  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  detectionSpirit?: Ref<Critters>;
  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  healthSpirit?: Ref<Critters>;
  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  illusionSpirit?: Ref<Critters>;
  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  manipulationSpirit?: Ref<Critters>;

  @ManyToMany({ entity: () => Spells, owner: true, joinColumn: "join_id" })
  spellList: Collection<Spells> = new Collection<Spells>(this);
  @ManyToMany({ entity: () => Spells, owner: true, joinColumn: "join_id" })
  ritualList: Collection<Spells> = new Collection<Spells>(this);
  @ManyToMany({ entity: () => Spells, owner: true, joinColumn: "join_id" })
  alchemicalPreparationList: Collection<Spells> = new Collection<Spells>(this);

  @ManyToMany({ entity: () => AdeptPowers, owner: true, joinColumn: "join_id" })
  adeptPowerList: Collection<AdeptPowers> = new Collection<AdeptPowers>(this);

  constructor(dto: MagicTalentInfoType) {
    super(dto);
  }
}

@Entity({
  discriminatorValue: "Resonance",
})
export class ActiveResonanceTalents extends ActiveTalents {
  @ManyToMany({
    entity: () => ComplexForms,
    owner: true,
    joinColumn: "join_id",
  })
  complexFormList: Collection<ComplexForms> = new Collection<ComplexForms>(
    this
  );

  constructor(dto: ResonanceTalentInfoType) {
    super(dto);
  }
}

@Entity({
  discriminatorValue: "Depth",
})
export class ActiveDepthTalents extends ActiveTalents {
  @OneToMany(() => ActivePrograms, (activeProgram) => activeProgram.talent)
  ProgramList = new Collection<ActivePrograms>(this);

  constructor(dto: DepthTalentInfoType) {
    super(dto);
  }
}

@Entity({
  discriminatorValue: "Mundane",
})
export class ActiveMundaneTalents extends ActiveTalents {
  constructor(dto: MundaneTalentInfoType) {
    super(dto);
  }
}
