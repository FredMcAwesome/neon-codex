import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/postgresql";
import {
  commonRequirementTypeEnum,
  otherRequirementTypeEnum,
  type ParentRequirementsType,
  type RequirementOtherSubType,
} from "@neon-codex/common";

type NoFKOtherRequirementTypes =
  | typeof otherRequirementTypeEnum.MetatypeCategory
  | typeof otherRequirementTypeEnum.SpecialModificationLimit
  | typeof otherRequirementTypeEnum.Attribute
  | typeof otherRequirementTypeEnum.GameplayOption
  | typeof otherRequirementTypeEnum.EssenceMinimum
  | typeof otherRequirementTypeEnum.EssenceLoss
  | typeof otherRequirementTypeEnum.MagicEnabled
  | typeof otherRequirementTypeEnum.ResonanceEnabled
  | typeof otherRequirementTypeEnum.DepthEnabled
  | typeof otherRequirementTypeEnum.MinimumInitiateGrade
  | typeof otherRequirementTypeEnum.MinimumSubmersionGrade
  | typeof otherRequirementTypeEnum.MetamagicArt
  | typeof otherRequirementTypeEnum.SpellCategory
  | typeof otherRequirementTypeEnum.SpellDescriptor;

export type DatabaseRequirementOtherSubType =
  | Extract<RequirementOtherSubType, { type: NoFKOtherRequirementTypes }>
  | {
      type: typeof otherRequirementTypeEnum.Quality;
      value: Omit<
        Extract<
          RequirementOtherSubType,
          { type: typeof otherRequirementTypeEnum.Quality }
        >["value"],
        "quality"
      >;
    }
  | {
      type: typeof otherRequirementTypeEnum.Cyberware;
      value:
        | Omit<
            Extract<
              RequirementOtherSubType,
              { type: typeof otherRequirementTypeEnum.Cyberware }
            >["value"],
            "name"
          >
        | { name: string; partialName: true };
    }
  | {
      type: typeof otherRequirementTypeEnum.Gear;
      value: Omit<
        Extract<
          RequirementOtherSubType,
          { type: typeof otherRequirementTypeEnum.Gear }
        >["value"],
        "name"
      >;
    }
  | {
      type: typeof otherRequirementTypeEnum.Skill;
      value: Omit<
        Extract<
          RequirementOtherSubType,
          { type: typeof otherRequirementTypeEnum.Skill }
        >["value"],
        "name"
      >;
    }
  | {
      type: typeof otherRequirementTypeEnum.ArmourMod;
      value: Omit<
        Extract<
          RequirementOtherSubType,
          { type: typeof otherRequirementTypeEnum.ArmourMod }
        >["value"],
        "name"
      >;
    }
  | {
      type: typeof otherRequirementTypeEnum.TraditionSpiritForm;
      value: Omit<
        Extract<
          RequirementOtherSubType,
          { type: typeof otherRequirementTypeEnum.TraditionSpiritForm }
        >["value"],
        "name"
      >;
    };

type AllFKOnlyOtherRequirementTypes =
  | typeof otherRequirementTypeEnum.MartialArt
  | typeof otherRequirementTypeEnum.MartialTechnique
  | typeof otherRequirementTypeEnum.Bioware
  | typeof otherRequirementTypeEnum.Metatype
  | typeof otherRequirementTypeEnum.Accessory
  | typeof otherRequirementTypeEnum.Program
  | typeof otherRequirementTypeEnum.Lifestyle
  | typeof otherRequirementTypeEnum.LifestyleQuality
  | typeof otherRequirementTypeEnum.Tradition
  | typeof otherRequirementTypeEnum.Metamagic
  | typeof otherRequirementTypeEnum.Spell
  | typeof otherRequirementTypeEnum.AdeptPower
  | typeof otherRequirementTypeEnum.CritterPower
  | typeof otherRequirementTypeEnum.TraditionSpiritForm;

type PartialFKOtherRequirementTypes =
  | typeof otherRequirementTypeEnum.Quality
  | typeof otherRequirementTypeEnum.Cyberware
  | typeof otherRequirementTypeEnum.Gear
  | typeof otherRequirementTypeEnum.Skill
  | typeof otherRequirementTypeEnum.ArmourMod;

type _AssertExhaustiveOtherRequirements =
  Exclude<
    otherRequirementTypeEnum,
    | NoFKOtherRequirementTypes
    | PartialFKOtherRequirementTypes
    | AllFKOnlyOtherRequirementTypes
  > extends never
    ? true
    : false;

const _assertExhaustiveOtherRequirements: _AssertExhaustiveOtherRequirements = true;

import { Skills } from "../abilities/skillModel.js";
import { Qualities } from "../traits/qualityModel.js";
import { MartialArts } from "../abilities/martialArtModel.js";
import { MartialArtTechniques } from "../abilities/martialArtTechniqueModel.js";
import { Augmentations } from "../equipment/bodyModification/augmentationModel.js";
import { Heritages } from "../traits/heritageModel.js";
import { Gears } from "../equipment/other/gearModel.js";
import { WeaponAccessories } from "../equipment/combat/weaponAccessoryModel.js";
import { ArmourModifications } from "../equipment/combat/armourModificationModel.js";
import { Programs } from "../abilities/programModel.js";
import { Lifestyles } from "./lifestyleModel.js";
import { LifestyleQualities } from "./lifestyleQualityModel.js";
import { Traditions } from "../traits/traditionModel.js";
import { Metamagics } from "./metamagicModel.js";
import { Spells } from "../abilities/spellModel.js";
import { AdeptPowers } from "../abilities/adeptPowerModel.js";
import { CritterPowers } from "../abilities/critterPowerModel.js";
import { Critters } from "../creatures/critterModel.js";
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { MentorSpirits } from "./mentorModel.js";
import { VehicleModifications } from "../equipment/rigger/vehicleModificationModel.js";
import { WeaponMountModifications } from "../equipment/rigger/weaponMountModModel.js";
import { ComplexForms } from "../abilities/complexFormModel.js";
import { TalentPriorityDetails } from "./talentPriorityDetailModel.js";

@Entity({
  abstract: true,
  discriminatorColumn: "discr",
})
export abstract class Requirements {
  @PrimaryKey()
  id!: number;

  // For children requirements are they all required, or is only 1 required
  @Enum({ items: () => commonRequirementTypeEnum, nullable: true })
  subRequirementsType?: commonRequirementTypeEnum;

  @ManyToOne({ entity: () => Requirements, nullable: true })
  parentRequirement?: Requirements;

  @OneToMany(() => Requirements, (r) => r.parentRequirement, {
    cascade: [Cascade.PERSIST],
    // Children are appended in DTO order at seed time and get sequential
    // ids; without ORDER BY, Postgres return order is unspecified and
    // reconstructed oneOf/allOf arrays shuffle between reads.
    orderBy: { id: "ASC" },
  })
  subRequirements = new Collection<Requirements>(this);

  // --- parentDetails base JSON payload ---
  @Property({ type: "json", nullable: true })
  parentDetails?: ParentRequirementsType | null;

  // --- parentDetails references ---
  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  parentWeaponSkill?: Ref<Skills>;

  @ManyToOne({ entity: () => Weapons, ref: true, nullable: true })
  parentWeapon?: Ref<Weapons>;

  @ManyToOne({ entity: () => Armours, ref: true, nullable: true })
  parentArmour?: Ref<Armours>;

  @ManyToOne({ entity: () => Gears, ref: true, nullable: true })
  parentGear?: Ref<Gears>;

  @ManyToOne({ entity: () => Vehicles, ref: true, nullable: true })
  parentVehicle?: Ref<Vehicles>;

  @ManyToOne({ entity: () => WeaponAccessories, ref: true, nullable: true })
  parentWeaponAccessory?: Ref<WeaponAccessories>;

  @ManyToOne({ entity: () => ArmourModifications, ref: true, nullable: true })
  parentArmourModification?: Ref<ArmourModifications>;

  @ManyToOne({ entity: () => Augmentations, ref: true, nullable: true })
  parentAugmentation?: Ref<Augmentations>;

  @ManyToOne({ entity: () => Critters, ref: true, nullable: true })
  parentCritter?: Ref<Critters>;

  // --- otherDetails base JSON payload ---
  @Property({ type: "json", nullable: true })
  otherDetails?: DatabaseRequirementOtherSubType | null;

  // --- otherDetails references ---
  // For partial, we just confirm that we can get at least 1
  @ManyToOne({ entity: () => Qualities, ref: true, nullable: true })
  otherQuality?: Ref<Qualities>;

  @ManyToOne({ entity: () => MartialArts, ref: true, nullable: true })
  otherMartialArt?: Ref<MartialArts>;

  @ManyToOne({ entity: () => MartialArtTechniques, ref: true, nullable: true })
  otherMartialTechnique?: Ref<MartialArtTechniques>;

  @ManyToOne({ entity: () => Augmentations, ref: true, nullable: true })
  otherBioware?: Ref<Augmentations>;

  @ManyToOne({ entity: () => Augmentations, ref: true, nullable: true })
  otherCyberware?: Ref<Augmentations>;

  @ManyToOne({ entity: () => Heritages, ref: true, nullable: true })
  otherMetatype?: Ref<Heritages>;

  @ManyToOne({ entity: () => Gears, ref: true, nullable: true })
  otherGear?: Ref<Gears>;

  @ManyToOne({ entity: () => Skills, ref: true, nullable: true })
  otherSkill?: Ref<Skills>;

  @ManyToOne({ entity: () => WeaponAccessories, ref: true, nullable: true })
  otherAccessory?: Ref<WeaponAccessories>;

  @ManyToOne({ entity: () => ArmourModifications, ref: true, nullable: true })
  otherArmourMod?: Ref<ArmourModifications>;

  @ManyToOne({ entity: () => Programs, ref: true, nullable: true })
  otherProgram?: Ref<Programs>;

  @ManyToOne({ entity: () => Lifestyles, ref: true, nullable: true })
  otherLifestyle?: Ref<Lifestyles>;

  @ManyToOne({ entity: () => LifestyleQualities, ref: true, nullable: true })
  otherLifestyleQuality?: Ref<LifestyleQualities>;

  @ManyToOne({ entity: () => Traditions, ref: true, nullable: true })
  otherTradition?: Ref<Traditions>;

  @ManyToOne({ entity: () => Metamagics, ref: true, nullable: true })
  otherMetamagic?: Ref<Metamagics>;

  @ManyToOne({ entity: () => Spells, ref: true, nullable: true })
  otherSpell?: Ref<Spells>;

  @ManyToOne({ entity: () => AdeptPowers, ref: true, nullable: true })
  otherAdeptPower?: Ref<AdeptPowers>;

  @ManyToOne({ entity: () => CritterPowers, ref: true, nullable: true })
  otherCritterPower?: Ref<CritterPowers>;
}

// STI Subclasses (Child nodes)
// ============================================================
@Entity({ discriminatorValue: "Child" })
export class ChildRequirements extends Requirements {
  // A child Requirement node used in allOf/oneOf arrays, doesn't need an owner.
}

// STI Subclasses (This is the owner of the requirement, i.e. the requirements for that thing)
// ============================================================

@Entity({ discriminatorValue: "TraditionRequirements" })
export class TraditionRequirements extends Requirements {
  @OneToOne(() => Traditions, (t) => t.requirements, { ref: true })
  requirementTradition!: Ref<Traditions>;
}

@Entity({ discriminatorValue: "LifestyleRequirements" })
export class LifestyleRequirements extends Requirements {
  @OneToOne(() => Lifestyles, (l) => l.requirements, { ref: true })
  requirementLifestyle!: Ref<Lifestyles>;
}

@Entity({ discriminatorValue: "LifestyleForbidden" })
export class LifestyleForbidden extends Requirements {
  @OneToOne(() => Lifestyles, (l) => l.forbidden, { ref: true })
  forbiddenLifestyle!: Ref<Lifestyles>;
}

@Entity({ discriminatorValue: "LifestyleQualityRequirements" })
export class LifestyleQualityRequirements extends Requirements {
  @OneToOne(() => LifestyleQualities, (lq) => lq.requirements, { ref: true })
  requirementLifestyleQuality!: Ref<LifestyleQualities>;
}

@Entity({ discriminatorValue: "LifestyleQualityForbidden" })
export class LifestyleQualityForbidden extends Requirements {
  @OneToOne(() => LifestyleQualities, (lq) => lq.forbidden, { ref: true })
  forbiddenLifestyleQuality!: Ref<LifestyleQualities>;
}

@Entity({ discriminatorValue: "MetamagicRequirements" })
export class MetamagicRequirements extends Requirements {
  @OneToOne(() => Metamagics, (mm) => mm.requirements, { ref: true })
  requirementMetamagic!: Ref<Metamagics>;
}

@Entity({ discriminatorValue: "TalentPriorityDetailRequirements" })
export class TalentPriorityDetailRequirements extends Requirements {
  @OneToOne(() => TalentPriorityDetails, (td) => td.requirements, { ref: true })
  requirementTalentPriorityDetail!: Ref<TalentPriorityDetails>;
}

@Entity({ discriminatorValue: "TalentPriorityDetailForbidden" })
export class TalentPriorityDetailForbidden extends Requirements {
  @OneToOne(() => TalentPriorityDetails, (td) => td.forbidden, { ref: true })
  forbiddenTalentPriorityDetail!: Ref<TalentPriorityDetails>;
}

@Entity({ discriminatorValue: "MentorRequired" })
export class MentorRequired extends Requirements {
  @OneToOne(() => MentorSpirits, (m) => m.required, { ref: true })
  requirementMentor!: Ref<MentorSpirits>;
}

@Entity({ discriminatorValue: "QualityRequirements" })
export class QualityRequirements extends Requirements {
  @OneToOne(() => Qualities, (q) => q.requirements, { ref: true })
  requirementQuality!: Ref<Qualities>;
}

@Entity({ discriminatorValue: "QualityForbidden" })
export class QualityForbidden extends Requirements {
  @OneToOne(() => Qualities, (q) => q.forbidden, { ref: true })
  forbiddenQuality!: Ref<Qualities>;
}

@Entity({ discriminatorValue: "QualityKarmaDiscountRequirements" })
export class QualityKarmaDiscountRequirements extends Requirements {
  @OneToOne(() => Qualities, (q) => q.karmaDiscountRequirements, { ref: true })
  requirementQualityKarmaDiscount!: Ref<Qualities>;
}

@Entity({ discriminatorValue: "AugmentationRequirements" })
export class AugmentationRequirements extends Requirements {
  @OneToOne(() => Augmentations, (a) => a.requirements, { ref: true })
  requirementAugmentation!: Ref<Augmentations>;
}

@Entity({ discriminatorValue: "AugmentationForbidden" })
export class AugmentationForbidden extends Requirements {
  @OneToOne(() => Augmentations, (a) => a.forbidden, { ref: true })
  forbiddenAugmentation!: Ref<Augmentations>;
}

@Entity({ discriminatorValue: "VehicleModificationRequirements" })
export class VehicleModificationRequirements extends Requirements {
  @OneToOne(() => VehicleModifications, (vm) => vm.requirements, { ref: true })
  requirementVehicleModification!: Ref<VehicleModifications>;
}

@Entity({ discriminatorValue: "VehicleModificationForbidden" })
export class VehicleModificationForbidden extends Requirements {
  @OneToOne(() => VehicleModifications, (vm) => vm.forbidden, { ref: true })
  forbiddenVehicleModification!: Ref<VehicleModifications>;
}

@Entity({ discriminatorValue: "WeaponMountModRequirements" })
export class WeaponMountModRequirements extends Requirements {
  @OneToOne(() => WeaponMountModifications, (wm) => wm.requirements, {
    ref: true,
  })
  requirementWeaponMountMod!: Ref<WeaponMountModifications>;
}

@Entity({ discriminatorValue: "MartialArtTechniqueRequirements" })
export class MartialArtTechniqueRequirements extends Requirements {
  @OneToOne(() => MartialArtTechniques, (mat) => mat.requirements, {
    ref: true,
  })
  requirementMartialArtTechnique!: Ref<MartialArtTechniques>;
}

@Entity({ discriminatorValue: "GearRequirements" })
export class GearRequirements extends Requirements {
  @OneToOne(() => Gears, (g) => g.requirements, { ref: true })
  requirementGear!: Ref<Gears>;
}

@Entity({ discriminatorValue: "GearForbidden" })
export class GearForbidden extends Requirements {
  @OneToOne(() => Gears, (g) => g.forbidden, { ref: true })
  forbiddenGear!: Ref<Gears>;
}

@Entity({ discriminatorValue: "SpellRequirements" })
export class SpellRequirements extends Requirements {
  @OneToOne(() => Spells, (s) => s.requirements, { ref: true })
  requirementSpell!: Ref<Spells>;
}

@Entity({ discriminatorValue: "MartialArtRequirements" })
export class MartialArtRequirements extends Requirements {
  @OneToOne(() => MartialArts, (ma) => ma.requirements, { ref: true })
  requirementMartialArt!: Ref<MartialArts>;
}

@Entity({ discriminatorValue: "ProgramRequirements" })
export class ProgramRequirements extends Requirements {
  @OneToOne(() => Programs, (p) => p.requirements, { ref: true })
  requirementProgram!: Ref<Programs>;
}

@Entity({ discriminatorValue: "ComplexFormRequirements" })
export class ComplexFormRequirements extends Requirements {
  @OneToOne(() => ComplexForms, (cf) => cf.requirements, { ref: true })
  requirementComplexForm!: Ref<ComplexForms>;
}

@Entity({ discriminatorValue: "CritterPowerRequirements" })
export class CritterPowerRequirements extends Requirements {
  @OneToOne(() => CritterPowers, (cp) => cp.requirements, { ref: true })
  requirementCritterPower!: Ref<CritterPowers>;
}

@Entity({ discriminatorValue: "CritterPowerForbidden" })
export class CritterPowerForbidden extends Requirements {
  @OneToOne(() => CritterPowers, (cp) => cp.forbidden, { ref: true })
  forbiddenCritterPower!: Ref<CritterPowers>;
}

@Entity({ discriminatorValue: "AdeptPowerAdeptWayRequirements" })
export class AdeptPowerAdeptWayRequirements extends Requirements {
  @OneToOne(() => AdeptPowers, (ap) => ap.adeptWayRequirements, { ref: true })
  requirementAdeptPower!: Ref<AdeptPowers>;
}

@Entity({ discriminatorValue: "AdeptPowerRequirements" })
export class AdeptPowerRequirements extends Requirements {
  @OneToOne(() => AdeptPowers, (ap) => ap.requirements, { ref: true })
  forbiddenAdeptPower!: Ref<AdeptPowers>;
}

@Entity({ discriminatorValue: "AdeptPowerForbidden" })
export class AdeptPowerForbidden extends Requirements {
  @OneToOne(() => AdeptPowers, (ap) => ap.forbidden, { ref: true })
  forbiddenAdeptPower!: Ref<AdeptPowers>;
}

@Entity({ discriminatorValue: "WeaponRequirements" })
export class WeaponRequirements extends Requirements {
  @OneToOne(() => Weapons, (w) => w.requirements, { ref: true })
  requirementWeapon!: Ref<Weapons>;
}

@Entity({ discriminatorValue: "WeaponAccessoryHostRequirements" })
export class WeaponAccessoryHostRequirements extends Requirements {
  @OneToOne(() => WeaponAccessories, (wa) => wa.requirements, {
    ref: true,
  })
  requirementWeaponAccessory!: Ref<WeaponAccessories>;
}

@Entity({ discriminatorValue: "WeaponAccessoryHostForbidden" })
export class WeaponAccessoryHostForbidden extends Requirements {
  @OneToOne(() => WeaponAccessories, (wa) => wa.forbidden, {
    ref: true,
  })
  forbiddenWeaponAccessory!: Ref<WeaponAccessories>;
}

@Entity({ discriminatorValue: "ArmourModificationRequirements" })
export class ArmourModificationRequirements extends Requirements {
  @OneToOne(() => ArmourModifications, (am) => am.requirements, { ref: true })
  requirementArmourModification!: Ref<ArmourModifications>;
}

@Entity({ discriminatorValue: "ArmourModificationForbidden" })
export class ArmourModificationForbidden extends Requirements {
  @OneToOne(() => ArmourModifications, (am) => am.forbidden, { ref: true })
  forbiddenArmourModification!: Ref<ArmourModifications>;
}
