import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  sourceBookEnum,
  traditionDrainAttributeEnum,
  traditionSpiritEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type { TraditionType } from "@neon-codex/common/build/schemas/abilities/magic/traditionSchemas.js";
import { Critters } from "../creatures/critterModel.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Traditions {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => traditionSpiritEnum)
  type!: traditionSpiritEnum;

  @Enum(() => traditionDrainAttributeEnum)
  drain!: traditionDrainAttributeEnum;

  @Property({ nullable: true })
  spiritForm?: string;

  @Property({ type: "json", nullable: true })
  bonus?: BonusType;

  @Property({ type: "json", nullable: true })
  requirements?: RequirementsType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  constructor(dto: TraditionType) {
    this.name = dto.name;
    this.drain = dto.drain;
    if (dto.spiritForm !== undefined) this.spiritForm = dto.spiritForm;

    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}

@Entity({ discriminatorValue: traditionSpiritEnum.Linked })
export class LinkedSpiritsTraditions extends Traditions {
  @ManyToOne({ entity: () => Critters, ref: true })
  combat!: Ref<Critters>;

  @ManyToOne({ entity: () => Critters, ref: true })
  detection!: Ref<Critters>;

  @ManyToOne({ entity: () => Critters, ref: true })
  health!: Ref<Critters>;

  @ManyToOne({ entity: () => Critters, ref: true })
  illusion!: Ref<Critters>;

  @ManyToOne({ entity: () => Critters, ref: true })
  manipulation!: Ref<Critters>;

  constructor(
    dto: TraditionType,
    combat: Ref<Critters>,
    detection: Ref<Critters>,
    health: Ref<Critters>,
    illusion: Ref<Critters>,
    manipulation: Ref<Critters>
  ) {
    super(dto);
    this.combat = combat;
    this.detection = detection;
    this.health = health;
    this.illusion = illusion;
    this.manipulation = manipulation;
  }
}

@Entity({ discriminatorValue: traditionSpiritEnum.Custom })
export class UnlinkedSpiritsTraditions extends Traditions {
  constructor(dto: TraditionType) {
    super(dto);
  }
}
@Entity({ discriminatorValue: traditionSpiritEnum.All })
export class AllSpiritsTraditions extends Traditions {
  constructor(dto: TraditionType) {
    super(dto);
  }
}
