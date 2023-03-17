import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";
import type {
  DamageType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  BlastType,
} from "@shadowrun/common";
import { ammunitionTypeEnum } from "@shadowrun/common";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Ammunitions {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: ammunitionTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property({ type: "json" })
  damageModifier!: DamageType;

  @Property({ type: "json" })
  armourPenetrationModifier!: ArmourPenetrationType;

  @Property({ type: "json" })
  availability!: AvailabilityType;

  @Property({ type: "json" })
  cost!: CostType;

  @Property({ length: 5000 })
  description!: string;

  @Property({ length: 5000, nullable: true })
  wireless?: string;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.Ammo })
export class Ammos extends Ammunitions {}

@Entity({ discriminatorValue: ammunitionTypeEnum.Grenades })
export class Grenades extends Ammunitions {
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