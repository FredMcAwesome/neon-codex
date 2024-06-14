import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CritterPowers } from "../abilities/critterPowerModel.js";
import { Critters } from "../creatures/critterModel.js";
import type { IncludedCritterPowerRatingType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
import { CustomisedCritters } from "./customisedCritterModel.js";

// Links to either a custom critter, or a critter in the table.

// one link to customised critter and one to critter as we don't have polymorphic relationships yet
// https://github.com/mikro-orm/mikro-orm/issues/706
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveCritterPowers {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => CritterPowers, ref: true })
  critterPower: Ref<CritterPowers>;

  @Property({ nullable: true })
  selectText?: string;

  @Property({ type: "json", nullable: true })
  rating?: IncludedCritterPowerRatingType;

  constructor(
    critterPower: Ref<CritterPowers>,
    selectText?: string,
    rating?: IncludedCritterPowerRatingType
  ) {
    this.critterPower = critterPower;
    if (selectText) this.selectText = selectText;
    if (rating) this.rating = rating;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedCritterPowers extends ActiveCritterPowers {
  @ManyToOne({ entity: () => Critters, ref: true })
  standardCritter: Ref<Critters>;

  constructor(
    critterPower: Ref<CritterPowers>,
    standardCritter: Ref<Critters>,
    selectText?: string,
    rating?: IncludedCritterPowerRatingType
  ) {
    super(critterPower, selectText, rating);
    this.standardCritter = standardCritter;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedCritterPowers extends ActiveCritterPowers {
  @ManyToOne({ entity: () => CustomisedCritters, ref: true })
  customisedCritter: Ref<CustomisedCritters>;

  constructor(
    critterPower: Ref<CritterPowers>,
    customisedCritter: Ref<CustomisedCritters>,
    selectText?: string,
    rating?: IncludedCritterPowerRatingType
  ) {
    super(critterPower, selectText, rating);
    this.customisedCritter = customisedCritter;
  }
}
