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
export class Ammunitions {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: ammunitionTypeEnum;

  @Property({ length: 255 })
  name!: string;

  @Property()
  damageModifier!: DamageType;

  @Property()
  armourPenetrationModifier!: ArmourPenetrationType;

  @Property()
  availability!: AvailabilityType;

  @Property()
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
  @Property()
  blast!: BlastType;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.RocketsMissiles })
export class RocketsMissiles extends Ammunitions {
  @Property()
  blast!: BlastType;
}

@Entity({ discriminatorValue: ammunitionTypeEnum.ProjectileAmmo })
export class ProjectilesAmmos extends Ammunitions {}
