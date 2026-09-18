import type { EntityManager } from "@mikro-orm/postgresql";
import { ref } from "@mikro-orm/postgresql";
import assert from "assert";
import type {
  RequirementsType,
  NonTopRequirementsType,
  RequirementOtherSubType,
  ParentRequirementsType,
} from "@neon-codex/common";
import {
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  weaponRequirementTypeEnum,
  otherRequirementTypeEnum,
} from "@neon-codex/common";
import {
  Requirements,
  ChildRequirements,
  WeaponRequirements,
  WeaponAccessoryHostRequirements,
  WeaponAccessoryHostForbidden,
  AugmentationRequirements,
  AugmentationForbidden,
  GearRequirements,
  GearForbidden,
  VehicleModificationRequirements,
  ArmourModificationRequirements,
  ArmourModificationForbidden,
  type DatabaseRequirementOtherSubType,
  CritterPowerRequirements,
} from "../models/rpg/otherData/requirementsModel.js";
import { Skills } from "../models/rpg/abilities/skillModel.js";
import { Qualities } from "../models/rpg/traits/qualityModel.js";
import { MartialArts } from "../models/rpg/abilities/martialArtModel.js";
import { MartialArtTechniques } from "../models/rpg/abilities/martialArtTechniqueModel.js";
import { Augmentations } from "../models/rpg/equipment/bodyModification/augmentationModel.js";
import { Heritages } from "../models/rpg/traits/heritageModel.js";
import { Gears } from "../models/rpg/equipment/other/gearModel.js";
import { WeaponAccessories } from "../models/rpg/equipment/combat/weaponAccessoryModel.js";
import { ArmourModifications } from "../models/rpg/equipment/combat/armourModificationModel.js";
import { Programs } from "../models/rpg/abilities/programModel.js";
import { Lifestyles } from "../models/rpg/otherData/lifestyleModel.js";
import { LifestyleQualities } from "../models/rpg/otherData/lifestyleQualityModel.js";
import { Traditions } from "../models/rpg/traits/traditionModel.js";
import { Metamagics } from "../models/rpg/otherData/metamagicModel.js";
import { Spells } from "../models/rpg/abilities/spellModel.js";
import { AdeptPowers } from "../models/rpg/abilities/adeptPowerModel.js";
import { CritterPowers } from "../models/rpg/abilities/critterPowerModel.js";
import { Critters } from "../models/rpg/creatures/critterModel.js";
import { Weapons } from "../models/rpg/equipment/combat/weaponModel.js";
import { Armours } from "../models/rpg/equipment/combat/armourModel.js";
import { Vehicles } from "../models/rpg/equipment/rigger/vehicleModel.js";

const resolveOtherDetails = async (
  em: EntityManager,
  requirement: Requirements,
  otherDetails: RequirementOtherSubType
): Promise<DatabaseRequirementOtherSubType | undefined> => {
  if (otherDetails.type === otherRequirementTypeEnum.Quality) {
    const loadedQuality = await em.findOne(Qualities, {
      name: otherDetails.value.quality,
    });
    if (loadedQuality === null) {
      throw new Error(
        `Could not find RequirementOther Quality: ${otherDetails.value.quality}`
      );
    }
    requirement.otherQuality = ref(loadedQuality);
    if (otherDetails.value.select !== undefined) {
      return {
        type: otherRequirementTypeEnum.Quality,
        value: { select: otherDetails.value.select },
      };
    }
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.MartialArt) {
    const loadedMartialArt = await em.findOne(MartialArts, {
      name: otherDetails.value,
    });
    if (loadedMartialArt === null) {
      throw new Error(
        `Could not find RequirementOther MartialArt: ${otherDetails.value}`
      );
    }
    requirement.otherMartialArt = ref(loadedMartialArt);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.MartialTechnique) {
    const loadedMartialTechnique = await em.findOne(MartialArtTechniques, {
      name: otherDetails.value,
    });
    if (loadedMartialTechnique === null) {
      throw new Error(
        `Could not find RequirementOther MartialTechnique: ${otherDetails.value}`
      );
    }
    requirement.otherMartialTechnique = ref(loadedMartialTechnique);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Bioware) {
    const loadedBioware = await em.findOne(Augmentations, {
      name: otherDetails.value,
    });
    if (loadedBioware === null) {
      throw new Error(
        `Could not find RequirementOther Bioware: ${otherDetails.value}`
      );
    }
    requirement.otherBioware = ref(loadedBioware);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Cyberware) {
    if (otherDetails.value.partialName !== undefined) {
      const loadedCyberware = await em.findOne(Augmentations, {
        name: { $ilike: `%${otherDetails.value.name}%` },
      });
      if (loadedCyberware === null) {
        throw new Error(
          `Could not find RequirementOther Cyberware matching partial: ${otherDetails.value.name}`
        );
      }
      return {
        type: otherRequirementTypeEnum.Cyberware,
        value: {
          name: otherDetails.value.name,
          partialName: otherDetails.value.partialName,
        },
      };
    } else {
      const loadedCyberware = await em.findOne(Augmentations, {
        name: otherDetails.value.name,
      });
      if (loadedCyberware === null) {
        throw new Error(
          `Could not find RequirementOther Cyberware: ${otherDetails.value.name}`
        );
      }
      requirement.otherCyberware = ref(loadedCyberware);
      return undefined;
    }
  } else if (otherDetails.type === otherRequirementTypeEnum.Metatype) {
    const loadedMetatype = await em.findOne(Heritages, {
      name: otherDetails.value,
    });
    if (loadedMetatype === null) {
      throw new Error(
        `Could not find RequirementOther Metatype: ${otherDetails.value}`
      );
    }
    requirement.otherMetatype = ref(loadedMetatype);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Gear) {
    const loadedGear = await em.findOne(Gears, {
      name: otherDetails.value.name,
    });
    if (loadedGear === null) {
      throw new Error(
        `Could not find RequirementOther Gear: ${otherDetails.value.name}`
      );
    }
    requirement.otherGear = ref(loadedGear);
    if (otherDetails.value.minimumRating !== undefined) {
      return {
        type: otherRequirementTypeEnum.Gear,
        value: { minimumRating: otherDetails.value.minimumRating },
      };
    }
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Skill) {
    const loadedSkill = await em.findOne(Skills, {
      name: otherDetails.value.name,
    });
    if (loadedSkill === null) {
      throw new Error(
        `Could not find RequirementOther Skill: ${otherDetails.value.name}`
      );
    }
    requirement.otherSkill = ref(loadedSkill);
    const { name: _, ...rest } = otherDetails.value;
    if (Object.keys(rest).length > 0) {
      return {
        type: otherRequirementTypeEnum.Skill,
        value: rest,
      };
    }
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Accessory) {
    const loadedAccessory = await em.findOne(WeaponAccessories, {
      name: otherDetails.value,
    });
    if (loadedAccessory === null) {
      throw new Error(
        `Could not find RequirementOther Accessory: ${otherDetails.value}`
      );
    }
    requirement.otherAccessory = ref(loadedAccessory);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.ArmourMod) {
    const loadedArmourMod = await em.findOne(ArmourModifications, {
      name: otherDetails.value.name,
    });
    if (loadedArmourMod === null) {
      throw new Error(
        `Could not find RequirementOther ArmourMod: ${otherDetails.value.name}`
      );
    }
    requirement.otherArmourMod = ref(loadedArmourMod);
    if (otherDetails.value.sameParent !== undefined) {
      return {
        type: otherRequirementTypeEnum.ArmourMod,
        value: { sameParent: otherDetails.value.sameParent },
      };
    }
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Program) {
    const loadedProgram = await em.findOne(Programs, {
      name: otherDetails.value,
    });
    if (loadedProgram === null) {
      throw new Error(
        `Could not find RequirementOther Program: ${otherDetails.value}`
      );
    }
    requirement.otherProgram = ref(loadedProgram);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Lifestyle) {
    const loadedLifestyle = await em.findOne(Lifestyles, {
      name: otherDetails.value,
    });
    if (loadedLifestyle === null) {
      throw new Error(
        `Could not find RequirementOther Lifestyle: ${otherDetails.value}`
      );
    }
    requirement.otherLifestyle = ref(loadedLifestyle);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.LifestyleQuality) {
    const loadedLifestyleQuality = await em.findOne(LifestyleQualities, {
      name: otherDetails.value,
    });
    if (loadedLifestyleQuality === null) {
      throw new Error(
        `Could not find RequirementOther LifestyleQuality: ${otherDetails.value}`
      );
    }
    requirement.otherLifestyleQuality = ref(loadedLifestyleQuality);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Tradition) {
    const loadedTradition = await em.findOne(Traditions, {
      name: otherDetails.value,
    });
    if (loadedTradition === null) {
      throw new Error(
        `Could not find RequirementOther Tradition: ${otherDetails.value}`
      );
    }
    requirement.otherTradition = ref(loadedTradition);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Metamagic) {
    const loadedMetamagic = await em.findOne(Metamagics, {
      name: otherDetails.value,
    });
    if (loadedMetamagic === null) {
      throw new Error(
        `Could not find RequirementOther Metamagic: ${otherDetails.value}`
      );
    }
    requirement.otherMetamagic = ref(loadedMetamagic);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.Spell) {
    const loadedSpell = await em.findOne(Spells, { name: otherDetails.value });
    if (loadedSpell === null) {
      throw new Error(
        `Could not find RequirementOther Spell: ${otherDetails.value}`
      );
    }
    requirement.otherSpell = ref(loadedSpell);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.AdeptPower) {
    const loadedAdeptPower = await em.findOne(AdeptPowers, {
      name: otherDetails.value,
    });
    if (loadedAdeptPower === null) {
      throw new Error(
        `Could not find RequirementOther AdeptPower: ${otherDetails.value}`
      );
    }
    requirement.otherAdeptPower = ref(loadedAdeptPower);
    return undefined;
  } else if (otherDetails.type === otherRequirementTypeEnum.CritterPower) {
    const loadedCritterPower = await em.findOne(CritterPowers, {
      name: otherDetails.value,
    });
    if (loadedCritterPower === null) {
      throw new Error(
        `Could not find RequirementOther CritterPower: ${otherDetails.value}`
      );
    }
    requirement.otherCritterPower = ref(loadedCritterPower);
    return undefined;
  }

  return otherDetails;
};

const resolveParentDetails = async (
  em: EntityManager,
  requirement: Requirements,
  parentDetails: ParentRequirementsType,
  rootRequirement: Requirements
): Promise<ParentRequirementsType | undefined> => {
  const nameSubObj =
    "generic" in parentDetails &&
    parentDetails.generic.type === genericRequirementTypeEnum.Name
      ? parentDetails.generic
      : "gear" in parentDetails &&
          parentDetails.gear.type === genericRequirementTypeEnum.Name
        ? parentDetails.gear
        : "vehicle" in parentDetails &&
            parentDetails.vehicle.type === genericRequirementTypeEnum.Name
          ? parentDetails.vehicle
          : "weapon" in parentDetails &&
              parentDetails.weapon.type === genericRequirementTypeEnum.Name
            ? parentDetails.weapon
            : undefined;

  if (nameSubObj !== undefined) {
    const name = nameSubObj.value.name;
    const isPartial = nameSubObj.value.partialName === true;

    if (isPartial) {
      return await getParentPartialNameRequirement(
        rootRequirement,
        em,
        name,
        parentDetails
      );
    }

    let found = false;
    if (
      rootRequirement instanceof GearRequirements ||
      rootRequirement instanceof GearForbidden
    ) {
      // Gear can be included in pretty much anything
      const loadedGear = await em.findOne(Gears, { name });
      if (loadedGear !== null) {
        requirement.parentGear = ref(loadedGear);
        found = true;
      }
      if (!found) {
        const loadedWeapon = await em.findOne(Weapons, { name });
        if (loadedWeapon !== null) {
          requirement.parentWeapon = ref(loadedWeapon);
          found = true;
        }
      }
      if (!found) {
        const loadedAugmentation = await em.findOne(Augmentations, { name });
        if (loadedAugmentation !== null) {
          requirement.parentAugmentation = ref(loadedAugmentation);
          found = true;
        }
      }
      if (!found) {
        const loadedVehicle = await em.findOne(Vehicles, { name });
        if (loadedVehicle !== null) {
          requirement.parentVehicle = ref(loadedVehicle);
          found = true;
        }
      }
      if (!found) {
        const loadedArmour = await em.findOne(Armours, { name });
        if (loadedArmour !== null) {
          requirement.parentArmour = ref(loadedArmour);
          found = true;
        }
      }
      if (!found) {
        const loadedArmourModification = await em.findOne(ArmourModifications, {
          name,
        });
        if (loadedArmourModification !== null) {
          requirement.parentArmourModification = ref(loadedArmourModification);
          found = true;
        }
      }
      if (!found) {
        const loadedWeaponAccessory = await em.findOne(WeaponAccessories, {
          name,
        });
        if (loadedWeaponAccessory !== null) {
          requirement.parentWeaponAccessory = ref(loadedWeaponAccessory);
          found = true;
        }
      }
      if (!found) {
        throw new Error(`Could not find parent for Gear: ${name}`);
      }
    } else if (
      rootRequirement instanceof WeaponRequirements ||
      rootRequirement instanceof WeaponAccessoryHostRequirements ||
      rootRequirement instanceof WeaponAccessoryHostForbidden
    ) {
      const loadedWeapon = await em.findOne(Weapons, { name });
      if (loadedWeapon === null) {
        throw new Error(`Could not find parent Weapon: ${name}`);
      }
      requirement.parentWeapon = ref(loadedWeapon);
      found = true;
    } else if (
      rootRequirement instanceof AugmentationRequirements ||
      rootRequirement instanceof AugmentationForbidden
    ) {
      // Cyber-implant weapons exist in both tables (e.g. Flametosser),
      // so fall back to Weapons like the Gear branch does.
      const loadedAugmentation = await em.findOne(Augmentations, { name });
      if (loadedAugmentation !== null) {
        requirement.parentAugmentation = ref(loadedAugmentation);
        found = true;
      }
      if (!found) {
        const loadedWeapon = await em.findOne(Weapons, { name });
        if (loadedWeapon !== null) {
          requirement.parentWeapon = ref(loadedWeapon);
          found = true;
        }
      }
      if (!found) {
        throw new Error(`Could not find parent Augmentation: ${name}`);
      }
    } else if (rootRequirement instanceof VehicleModificationRequirements) {
      const loadedVehicle = await em.findOne(Vehicles, { name });
      if (loadedVehicle === null) {
        throw new Error(`Could not find parent Vehicle: ${name}`);
      }
      requirement.parentVehicle = ref(loadedVehicle);
      found = true;
    } else if (
      rootRequirement instanceof ArmourModificationRequirements ||
      rootRequirement instanceof ArmourModificationForbidden
    ) {
      const loadedArmour = await em.findOne(Armours, { name });
      if (loadedArmour === null) {
        throw new Error(`Could not find parent Armour: ${name}`);
      }
      requirement.parentArmour = ref(loadedArmour);
      found = true;
    } else if (rootRequirement instanceof CritterPowerRequirements) {
      const loadedCritter = await em.findOne(Critters, { name });
      if (loadedCritter === null) {
        throw new Error(`Could not find parent Critter: ${name}`);
      }
      requirement.parentCritter = ref(loadedCritter);
      found = true;
    }

    if (found) {
      return parentDetails;
    } else {
      throw new Error(
        `Unhandled rootRequirement type '${rootRequirement.constructor.name}' for generic Name parent requirement. ` +
          `Add a handler branch in resolveParentDetailsFK for this entity type.`
      );
    }
  }

  if (
    "weapon" in parentDetails &&
    parentDetails.weapon.type === weaponRequirementTypeEnum.Skill
  ) {
    if ("noOverride" in parentDetails.weapon.value) {
      return parentDetails;
    }
    const skillName = parentDetails.weapon.value.skill;
    if (skillName !== undefined) {
      const loadedSkill = await em.findOne(Skills, { name: skillName });
      if (loadedSkill === null) {
        throw new Error(`Could not find parent Weapon Skill: ${skillName}`);
      }
      requirement.parentWeaponSkill = ref(loadedSkill);
      return parentDetails;
    }
  }

  return parentDetails;
};

const isRequirementNonEmpty = (requirements: Requirements): boolean => {
  if (
    requirements.parentDetails !== undefined &&
    requirements.parentDetails !== null
  ) {
    return true;
  }
  if (
    requirements.otherDetails !== undefined &&
    requirements.otherDetails !== null
  ) {
    return true;
  }
  if (
    requirements.parentWeaponSkill !== undefined ||
    requirements.parentWeapon !== undefined ||
    requirements.parentArmour !== undefined ||
    requirements.parentGear !== undefined ||
    requirements.parentVehicle !== undefined ||
    requirements.parentWeaponAccessory !== undefined ||
    requirements.parentArmourModification !== undefined ||
    requirements.parentAugmentation !== undefined ||
    requirements.parentCritter !== undefined
  ) {
    return true;
  }
  return (
    requirements.otherQuality !== undefined ||
    requirements.otherMartialArt !== undefined ||
    requirements.otherMartialTechnique !== undefined ||
    requirements.otherBioware !== undefined ||
    requirements.otherCyberware !== undefined ||
    requirements.otherMetatype !== undefined ||
    requirements.otherGear !== undefined ||
    requirements.otherSkill !== undefined ||
    requirements.otherAccessory !== undefined ||
    requirements.otherArmourMod !== undefined ||
    requirements.otherProgram !== undefined ||
    requirements.otherLifestyle !== undefined ||
    requirements.otherLifestyleQuality !== undefined ||
    requirements.otherTradition !== undefined ||
    requirements.otherMetamagic !== undefined ||
    requirements.otherSpell !== undefined ||
    requirements.otherAdeptPower !== undefined ||
    requirements.otherCritterPower !== undefined
  );
};

const populateRequirementNode = async (
  em: EntityManager,
  requirementDB: Requirements,
  unlinkedRequirement: NonTopRequirementsType,
  rootRequirement: Requirements
) => {
  if (unlinkedRequirement.type === commonRequirementTypeEnum.Inner) {
    assert(
      unlinkedRequirement.parentDetails !== undefined ||
        unlinkedRequirement.otherDetails !== undefined,
      `Requirement leaf DTO must carry parentDetails and/or otherDetails ` +
        `(root=${rootRequirement.constructor.name}): ${JSON.stringify(unlinkedRequirement)}`
    );
    if (unlinkedRequirement.parentDetails !== undefined) {
      const parentDetails = await resolveParentDetails(
        em,
        requirementDB,
        unlinkedRequirement.parentDetails,
        rootRequirement
      );
      // Empty parent details means it is only relationships not JSON
      if (parentDetails !== undefined) {
        requirementDB.parentDetails = parentDetails;
      }
    }

    if (unlinkedRequirement.otherDetails !== undefined) {
      const otherDetails = await resolveOtherDetails(
        em,
        requirementDB,
        unlinkedRequirement.otherDetails
      );
      // Empty other details means it is only relationships not JSON
      if (otherDetails !== undefined) {
        requirementDB.otherDetails = otherDetails;
      }
    }

    assert(
      isRequirementNonEmpty(requirementDB),
      `Requirement leaf is empty (no parentDetails, otherDetails) (root=${rootRequirement.constructor.name}): ` +
        `${JSON.stringify(unlinkedRequirement)}`
    );
    return;
  }

  assert(
    unlinkedRequirement.type === commonRequirementTypeEnum.AllOf ||
      unlinkedRequirement.type === commonRequirementTypeEnum.OneOf,
    `Requirement operator has unknown type (root=${rootRequirement.constructor.name}): ` +
      `${JSON.stringify(unlinkedRequirement)}`
  );
  requirementDB.subRequirementsType = unlinkedRequirement.type;
  const children =
    unlinkedRequirement.type === commonRequirementTypeEnum.AllOf
      ? unlinkedRequirement.allOf
      : unlinkedRequirement.oneOf;
  assert(
    children !== undefined && children.length > 0,
    `Requirement operator '${unlinkedRequirement.type}' must have at least one child ` +
      `(root=${rootRequirement.constructor.name}): ${JSON.stringify(unlinkedRequirement)}`
  );
  for (const child of children) {
    const childRequirement = new ChildRequirements();
    await populateRequirementNode(em, childRequirement, child, rootRequirement);
    requirementDB.subRequirements.add(childRequirement);
  }
};

export const linkRequirementEntity = async (
  em: EntityManager,
  unlinkedRequirement: RequirementsType,
  requirementDB: Requirements
) => {
  await populateRequirementNode(
    em,
    requirementDB,
    unlinkedRequirement,
    requirementDB
  );
};

async function getParentPartialNameRequirement(
  rootRequirement: Requirements,
  em: EntityManager,
  name: string,
  parentDetails: ParentRequirementsType
) {
  let matchFound = false;
  if (
    rootRequirement instanceof GearRequirements ||
    rootRequirement instanceof GearForbidden
  ) {
    const loadedGear = await em.findOne(Gears, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedGear !== null) {
      matchFound = true;
    }
    if (!matchFound) {
      const loadedWeapon = await em.findOne(Weapons, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedWeapon !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      const loadedAugmentation = await em.findOne(Augmentations, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedAugmentation !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      const loadedVehicle = await em.findOne(Vehicles, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedVehicle !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      const loadedArmour = await em.findOne(Armours, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedArmour !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      const loadedArmourModification = await em.findOne(ArmourModifications, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedArmourModification !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      const loadedWeaponAccessory = await em.findOne(WeaponAccessories, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedWeaponAccessory !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      throw new Error(
        `Could not find parent for Gear matching partial name: ${name}`
      );
    }
  } else if (
    rootRequirement instanceof WeaponRequirements ||
    rootRequirement instanceof WeaponAccessoryHostRequirements ||
    rootRequirement instanceof WeaponAccessoryHostForbidden
  ) {
    const loadedWeapon = await em.findOne(Weapons, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedWeapon === null) {
      throw new Error(
        `Could not find parent Weapon matching partial name: ${name}`
      );
    }
    matchFound = true;
  } else if (
    rootRequirement instanceof AugmentationRequirements ||
    rootRequirement instanceof AugmentationForbidden
  ) {
    const loadedAugmentation = await em.findOne(Augmentations, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedAugmentation !== null) {
      matchFound = true;
    }
    if (!matchFound) {
      const loadedWeapon = await em.findOne(Weapons, {
        name: { $ilike: `%${name}%` },
      });
      if (loadedWeapon !== null) {
        matchFound = true;
      }
    }
    if (!matchFound) {
      throw new Error(
        `Could not find parent Augmentation matching partial name: ${name}`
      );
    }
  } else if (rootRequirement instanceof VehicleModificationRequirements) {
    const loadedVehicle = await em.findOne(Vehicles, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedVehicle === null) {
      throw new Error(
        `Could not find parent Vehicle matching partial name: ${name}`
      );
    }
    matchFound = true;
  } else if (
    rootRequirement instanceof ArmourModificationRequirements ||
    rootRequirement instanceof ArmourModificationForbidden
  ) {
    const loadedArmour = await em.findOne(Armours, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedArmour === null) {
      throw new Error(
        `Could not find parent Armour matching partial name: ${name}`
      );
    }
    matchFound = true;
  } else if (rootRequirement instanceof CritterPowerRequirements) {
    const loadedCritter = await em.findOne(Critters, {
      name: { $ilike: `%${name}%` },
    });
    if (loadedCritter === null) {
      throw new Error(
        `Could not find parent Critter matching partial name: ${name}`
      );
    }
    matchFound = true;
  } else {
    throw new Error(
      `Unhandled rootRequirement type '${rootRequirement.constructor.name}' for generic Name parent requirement.`
    );
  }

  return parentDetails;
}
