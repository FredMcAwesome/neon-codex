import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  sourceBookEnum,
  traditionDrainAttributeEnum,
} from "@neon-codex/common/build/enums.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type { RequirementsType } from "@neon-codex/common/build/schemas/shared/requiredSchemas.js";
import type { TraditionType } from "@neon-codex/common/build/schemas/abilities/magic/traditionSchemas.js";
import { TraditionSpirits } from "./traditionSpiritModel.js";

@Entity()
export class Traditions {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => traditionDrainAttributeEnum)
  drain!: traditionDrainAttributeEnum;

  @Property({ nullable: true })
  spiritForm?: string;

  @Property()
  selectSpiritTypes!: boolean;

  @OneToOne({ entity: () => TraditionSpirits, ref: true, nullable: true })
  spiritTypes?: Ref<TraditionSpirits>;

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
    this.selectSpiritTypes = typeof dto.spiritTypes === "string";
    //TODO connect spirit types

    if (dto.bonus !== undefined) this.bonus = dto.bonus;
    if (dto.requirements !== undefined) this.requirements = dto.requirements;
    this.source = dto.source;
    this.page = dto.page;
    this.description = dto.description;
  }
}
