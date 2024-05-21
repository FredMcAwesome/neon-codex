import { Entity, Enum, PrimaryKey } from "@mikro-orm/postgresql";
import { critterTypeEnum } from "@neon-codex/common/build/enums.js";

@Entity()
export abstract class Critter {
  @PrimaryKey()
  id!: number;

  @Enum(() => critterTypeEnum)
  type!: critterTypeEnum;
}
