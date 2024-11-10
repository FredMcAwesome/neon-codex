import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import { CustomisedWeapons } from "../activeTables/activeWeaponModel.js";
import type {
  AttributesType,
  PriorityLevelsType,
  SpecialAttributesType,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { CustomisedSkills } from "../activeTables/activeSkillModel.js";
import { Heritages } from "../traits/heritageModel.js";
import { CustomisedQualities } from "../activeTables/activeQualityModel.js";
import { CustomisedArmours } from "../activeTables/activeArmourModel.js";
import { CustomisedGears } from "../activeTables/activeGearModel.js";
import { CustomisedVehicles } from "../activeTables/activeVehicleModel.js";
import { CustomisedAugmentations } from "../activeTables/activeAugmentationModel.js";
import { CustomisedSkillGroups } from "../activeTables/activeSkillGroupModel.js";
import Users from "../../accounts/userModel.js";
import { ActiveTalents } from "../activeTables/activeTalentModel.js";
import { ActiveMartialArts } from "../activeTables/activeMartialArtModel.js";
import { CustomisedLifestyles } from "../activeTables/activeLIfestyleModel.js";

@Entity()
export class Characters {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToOne({ entity: () => Heritages, ref: true })
  heritage!: Ref<Heritages>;

  @Property({ type: "json" })
  priorities!: PriorityLevelsType;

  @Property({ type: "json" })
  attributes!: AttributesType;

  @Property({ type: "json" })
  specialAttributes!: SpecialAttributesType;

  @OneToOne(() => ActiveTalents, (activeTalent) => activeTalent.character, {
    owner: true,
    nullable: true,
    ref: true,
  })
  talent?: Ref<ActiveTalents>;

  @OneToMany(() => CustomisedSkills, (skill) => skill.character)
  skills = new Collection<CustomisedSkills>(this);

  @OneToMany(() => CustomisedSkillGroups, (skillGroup) => skillGroup.character)
  skillGroups = new Collection<CustomisedSkillGroups>(this);

  @OneToMany(() => CustomisedQualities, (quality) => quality.character)
  qualities = new Collection<CustomisedQualities>(this);

  @Property()
  nuyen!: number;

  @Property()
  karmaPoints!: number;

  @OneToMany(() => CustomisedWeapons, (weapon) => weapon.character)
  weapons = new Collection<CustomisedWeapons>(this);

  @OneToMany(() => CustomisedArmours, (armour) => armour.character)
  armours = new Collection<CustomisedArmours>(this);

  @OneToMany(() => CustomisedGears, (gear) => gear.character)
  gears = new Collection<CustomisedGears>(this);

  @OneToMany(
    () => CustomisedAugmentations,
    (augmentation) => augmentation.character
  )
  augmentations = new Collection<CustomisedAugmentations>(this);

  @OneToMany(() => CustomisedVehicles, (vehicle) => vehicle.character)
  vehicles = new Collection<CustomisedVehicles>(this);

  @OneToMany(() => ActiveMartialArts, (martialArt) => martialArt.character)
  martialArts = new Collection<ActiveMartialArts>(this);

  @OneToMany(
    () => CustomisedLifestyles,
    (activeLifestyle) => activeLifestyle.character
  )
  lifestyles = new Collection<CustomisedLifestyles>(this);

  @ManyToOne({ entity: () => Users, ref: true })
  user!: Ref<Users>;

  constructor(dto: {
    name: string;
    heritage: Ref<Heritages>;
    priorities: PriorityLevelsType;
    attributes: AttributesType;
    specialAttributes: SpecialAttributesType;
    nuyen: number;
    karmaPoints: number;
    user: Ref<Users>;
  }) {
    this.name = dto.name;
    this.heritage = dto.heritage;
    this.priorities = dto.priorities;
    this.attributes = dto.attributes;
    this.specialAttributes = dto.specialAttributes;
    this.nuyen = dto.nuyen;
    this.karmaPoints = dto.karmaPoints;
    this.user = dto.user;
  }
}
