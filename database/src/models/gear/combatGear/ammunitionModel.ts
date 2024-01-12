import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/postgresql";
import type {
  DamageType,
  ArmourPenetrationType,
  BlastType,
} from "@shadowrun/common";
import { ammunitionTypeEnum } from "@shadowrun/common";
import type {
  AvailabilityAmmunitionType,
  CostAmmunitionType,
} from "@shadowrun/common/build/schemas/ammunitionSchemas.js";
import { sourceBookEnum } from "@shadowrun/common/build/enums.js";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Ammunitions {
  @PrimaryKey()
  id!: number;

  @Enum(() => ammunitionTypeEnum)
  type!: ammunitionTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  damageModifier!: DamageType;

  @Property({ type: "json" })
  armourPenetrationModifier!: ArmourPenetrationType;

  @Property({ type: "json" })
  availability!: AvailabilityAmmunitionType;

  @Property({ type: "json" })
  cost!: CostAmmunitionType;

  @Enum(() => sourceBookEnum)
  source!: sourceBookEnum;

  @Property()
  page!: number;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.Ammo })
export class Ammos extends Ammunitions {}

@Entity({ discriminatorValue: ammunitionTypeEnum.GrenadesTorpedoes })
export class GrenadesTorpedoes extends Ammunitions {
  @Property({ type: "json" })
  blast!: BlastType;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.RocketsMissiles })
export class RocketsMissiles extends Ammunitions {
  @Property({ type: "json" })
  blast!: BlastType;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.ProjectileAmmo })
export class ProjectilesAmmos extends Ammunitions {}
