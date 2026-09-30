import {
  augmentationCategoryEnum,
  equipmentTypeEnum,
  gearCategoryEnum,
  talentCategoryEnum,
  vehicleCategoryEnum,
  weaponCategoryEnum,
  weaponMountParentCategory,
  type AttributesType,
  type CustomisedArmourLoadedType,
  type CustomisedAugmentationLoadedType,
  type CustomisedGearLoadedListType,
  type CustomisedGearLoadedType,
  type CustomisedVehicleLoadedType,
  type CustomisedWeaponAccessoryLoadedType,
  type CustomisedWeaponLoadedType,
  type CustomisedWeaponMountLoadedType,
  type CustomSkillListType,
  type HeritagePrioritySelectedType,
  type LifestyleSelectedListType,
  type MartialArtSelectedType,
  type QualitySelectedListType,
  type RequirementCharacterContextType,
  type RequirementEvaluationContextType,
  type RequirementParentContextType,
  type SelectedEquipmentLoadedListType,
  type SpecialAttributesType,
  type TalentInfoType,
} from "@neon-codex/common";

export interface RequirementContextPathItem {
  category: equipmentTypeEnum | typeof weaponMountParentCategory;
  index: number;
  name: string;
}

export interface RequirementCharacterInput {
  heritageInfo?: HeritagePrioritySelectedType | undefined;
  positiveQualityListSelected?: QualitySelectedListType | undefined;
  negativeQualityListSelected?: QualitySelectedListType | undefined;
  skillSelections?: CustomSkillListType | undefined;
  talentInfo?: TalentInfoType | undefined;
  attributeInfo?: AttributesType | undefined;
  specialAttributeInfo?: SpecialAttributesType | undefined;
  martialArtSelected?: MartialArtSelectedType | undefined;
  lifestyleSelections?: LifestyleSelectedListType | undefined;
  essencePoints: number;
}

export function buildWeaponParentContext(
  weapon: CustomisedWeaponLoadedType | undefined
): RequirementParentContextType | undefined {
  if (weapon === undefined) {
    return undefined;
  }
  const bw = weapon.baseWeapon;
  const ammoTypes = bw.ammunition?.map((a) => a.reloadMethod) ?? [];
  const installedAccessories =
    weapon.accessoryList?.map((a) => a.baseAccessory.name) ?? [];
  const mountsAvailable =
    "firearmOptions" in bw ? (bw.firearmOptions.accessoryMountList ?? []) : [];
  const modes = "firearmOptions" in bw ? (bw.firearmOptions.mode ?? []) : [];
  const specialModificationCount =
    weapon.accessoryList?.filter(
      (a) => a.baseAccessory.specialModification === true
    ).length ?? 0;
  const skills = bw.relatedSkill ? [bw.relatedSkill] : [];
  const common = {
    category: equipmentTypeEnum.Weapon as const,
    name: bw.name,
    ammoTypes,
    concealability: bw.concealability,
    mountsAvailable,
    installedAccessories,
    specialModificationCount,
    skills,
    ...(modes.length > 0 && { modes }),
    ...("damage" in bw && bw.damage !== undefined && { damage: bw.damage }),
    ...("firearmOptions" in bw &&
      bw.firearmOptions.ammoWeaponClassification !== undefined && {
        ammoWeaponClassification: bw.firearmOptions.ammoWeaponClassification,
      }),
  };
  // Correlated pair: narrowing on the item category keeps
  // weaponCategory/subtype from drifting apart. Literals stay inline
  // so the union contextually types each branch.
  switch (bw.category) {
    case weaponCategoryEnum.Firearm:
      return { ...common, weaponCategory: bw.category, subtype: bw.subtype };
    case weaponCategoryEnum.Melee:
      return { ...common, weaponCategory: bw.category, subtype: bw.subtype };
    case weaponCategoryEnum.Projectile:
      return { ...common, weaponCategory: bw.category, subtype: bw.subtype };
    case weaponCategoryEnum.Explosive:
      return { ...common, weaponCategory: bw.category, subtype: bw.subtype };
  }
}

export function buildArmourParentContext(
  armour: CustomisedArmourLoadedType | undefined
): RequirementParentContextType | undefined {
  if (armour?.baseArmour === undefined) {
    return undefined;
  }
  const ba = armour.baseArmour;
  return {
    category: equipmentTypeEnum.Armour,
    name: ba.name,
    subtype: ba.category,
    installedMods: armour.modList?.map((m) => m.baseMod.name) ?? [],
  };
}

export function buildVehicleParentContext(
  vehicle: CustomisedVehicleLoadedType | undefined
): RequirementParentContextType | undefined {
  if (vehicle === undefined) {
    return undefined;
  }
  const bv = vehicle.baseVehicle;
  const installedMods = vehicle.modList?.map((m) => m.baseMod.name) ?? [];
  const seats =
    "seats" in bv
      ? typeof bv.seats === "number"
        ? bv.seats
        : bv.seats.max
      : undefined;
  const common = {
    category: equipmentTypeEnum.Vehicle as const,
    name: bv.name,
    body: bv.body,
    ...(seats !== undefined && { seats }),
    installedMods,
  };
  // Correlated pair: narrowing on the item category keeps
  // vehicleCategory/subtype from drifting apart.
  switch (bv.category) {
    case vehicleCategoryEnum.Groundcraft:
      return { ...common, vehicleCategory: bv.category, subtype: bv.subtype };
    case vehicleCategoryEnum.Watercraft:
      return { ...common, vehicleCategory: bv.category, subtype: bv.subtype };
    case vehicleCategoryEnum.Aircraft:
      return { ...common, vehicleCategory: bv.category, subtype: bv.subtype };
    case vehicleCategoryEnum.Drone:
      return { ...common, vehicleCategory: bv.category, subtype: bv.subtype };
  }
}

export function buildGearParentContext(
  gear: CustomisedGearLoadedType | undefined
): RequirementParentContextType | undefined {
  if (gear?.baseGear === undefined) {
    return undefined;
  }
  const bg = gear.baseGear;
  return {
    category: equipmentTypeEnum.Gear,
    name: bg.name,
    subtype: bg.category,
    hasAttributeArray: bg.attributeArray !== undefined,
    isCyberdeck: bg.category === gearCategoryEnum.Cyberdecks,
    ...("attack" in bg && bg.attack !== undefined && { attack: bg.attack }),
    ...("sleaze" in bg && bg.sleaze !== undefined && { sleaze: bg.sleaze }),
    ...("dataProcessing" in bg &&
      bg.dataProcessing !== undefined && {
        dataProcessing: bg.dataProcessing,
      }),
    ...("firewall" in bg &&
      bg.firewall !== undefined && { firewall: bg.firewall }),
  };
}

export function buildWeaponAccessoryParentContext(
  accessory: CustomisedWeaponAccessoryLoadedType | undefined
): RequirementParentContextType | undefined {
  if (accessory?.baseAccessory === undefined) {
    return undefined;
  }
  return {
    category: equipmentTypeEnum.WeaponAccessory,
    name: accessory.baseAccessory.name,
  };
}

export function buildAugmentationParentContext(
  augmentation: CustomisedAugmentationLoadedType | undefined
): RequirementParentContextType | undefined {
  if (augmentation === undefined) {
    return undefined;
  }
  const baseAugmentation = augmentation.baseAugmentation;
  // Correlated pair: narrowing on the item category keeps
  // augmentationCategory/subtype from drifting apart.
  if (baseAugmentation.category === augmentationCategoryEnum.Cyberware) {
    return {
      category: equipmentTypeEnum.Augmentation,
      name: baseAugmentation.name,
      subtype: baseAugmentation.subtype,
      augmentationCategory: baseAugmentation.category,
    };
  }
  return {
    category: equipmentTypeEnum.Augmentation,
    name: baseAugmentation.name,
    subtype: baseAugmentation.subtype,
    augmentationCategory: baseAugmentation.category,
  };
}

export function buildWeaponMountParentContext(
  mount: CustomisedWeaponMountLoadedType | undefined,
  mountName: string
): RequirementParentContextType | undefined {
  if (mount === undefined) {
    return undefined;
  }
  return {
    category: weaponMountParentCategory,
    name: mountName,
    control: mount.control,
    flexibility: mount.flexibility,
    visibility: mount.visibility,
  };
}

function resolveAncestorAt(
  pathEntries: readonly RequirementContextPathItem[],
  equipment: SelectedEquipmentLoadedListType,
  position: number
): RequirementParentContextType | undefined {
  const entry = pathEntries[position];
  if (entry === undefined) {
    return undefined;
  }
  if (entry.category === equipmentTypeEnum.Weapon) {
    return buildWeaponParentContext(equipment.weaponList[entry.index]);
  }
  if (entry.category === equipmentTypeEnum.Armour) {
    return buildArmourParentContext(equipment.armourList[entry.index]);
  }
  if (entry.category === equipmentTypeEnum.Vehicle) {
    return buildVehicleParentContext(equipment.vehicleList[entry.index]);
  }
  if (entry.category === equipmentTypeEnum.Gear) {
    return buildGearParentContext(equipment.gearList[entry.index]);
  }
  if (entry.category === equipmentTypeEnum.WeaponAccessory) {
    // Accessory paths follow the [Weapon, WeaponAccessory] pattern: the
    // weapon entry precedes the accessory entry. The accessory itself is
    // the direct parent for gear browsed inside it.
    const weaponEntry = pathEntries[position + 1];
    if (
      weaponEntry !== undefined &&
      weaponEntry.category === equipmentTypeEnum.Weapon
    ) {
      const hostWeapon = equipment.weaponList[weaponEntry.index];
      return buildWeaponAccessoryParentContext(
        hostWeapon?.accessoryList?.[entry.index]
      );
    }
    return undefined;
  }
  if (entry.category === equipmentTypeEnum.Augmentation) {
    return buildAugmentationParentContext(
      equipment.augmentationList[entry.index]
    );
  }
  if (entry.category === weaponMountParentCategory) {
    // Mount paths follow the [Vehicle, WeaponMount] pattern: the vehicle
    // entry precedes the mount entry, so resolve the mount through both
    // indexes, skipping name matching entirely.
    const vehicleEntry = pathEntries[position + 1];
    if (
      vehicleEntry !== undefined &&
      vehicleEntry.category === equipmentTypeEnum.Vehicle
    ) {
      const mountVehicle = equipment.vehicleList[vehicleEntry.index];
      return buildWeaponMountParentContext(
        mountVehicle?.weaponMountList?.[entry.index],
        entry.name
      );
    }
    return undefined;
  }
  // Unknown entry categories intentionally resolve to undefined
  // rather than falling back to an ancestor.
  return undefined;
}

export function resolveRequirementAncestors(
  path: readonly RequirementContextPathItem[],
  equipment: SelectedEquipmentLoadedListType
): {
  parent: RequirementParentContextType | undefined;
  grandparent: RequirementParentContextType | undefined;
} {
  // Position 0 is the direct parent, position 1 the grandparent
  // (e.g. the vehicle containing a weapon mount, or the weapon hosting
  // an accessory). Reverse so the innermost path entry comes first.
  const pathEntries = [...path].reverse();
  const parent = resolveAncestorAt(pathEntries, equipment, 0);
  const grandparent =
    pathEntries.length > 1
      ? resolveAncestorAt(pathEntries, equipment, 1)
      : undefined;
  return { parent, grandparent };
}

export function buildRequirementCharacterContext(
  equipment: SelectedEquipmentLoadedListType,
  input: RequirementCharacterInput
): RequirementCharacterContextType {
  const skillsMap: Record<string, number> = {};
  if (input.skillSelections) {
    for (const skill of input.skillSelections) {
      // Keys normalize to lowercase since requirement names vary in
      // casing; the evaluator compares case-insensitively.
      skillsMap[skill.name.toLowerCase()] =
        (skill.skillPoints ?? 0) + (skill.karmaPoints ?? 0);
    }
  }

  const installedCyberware: string[] = [];
  const installedBioware: string[] = [];
  for (const aug of equipment.augmentationList) {
    if (aug.baseAugmentation.category === augmentationCategoryEnum.Cyberware) {
      installedCyberware.push(aug.baseAugmentation.name);
    } else if (
      aug.baseAugmentation.category === augmentationCategoryEnum.Bioware
    ) {
      installedBioware.push(aug.baseAugmentation.name);
    }
  }

  // Include nested inner gear so accessory/gear requirements resolve.
  const installedGear: string[] = [];
  const installedGearRatings: Record<string, number> = {};
  const collectGear = (
    list: CustomisedGearLoadedListType | undefined
  ): void => {
    if (list === undefined) {
      return;
    }
    for (const gearItem of list) {
      installedGear.push(gearItem.baseGear.name);
      if (gearItem.rating !== undefined) {
        installedGearRatings[gearItem.baseGear.name] = gearItem.rating;
      }
      collectGear(gearItem.innerGearList);
    }
  };
  collectGear(equipment.gearList);
  for (const weapon of equipment.weaponList) {
    for (const acc of weapon.accessoryList ?? []) {
      collectGear(acc.gearList);
    }
  }

  const installedArmourMods: string[] = [];
  for (const armour of equipment.armourList) {
    for (const mod of armour.modList ?? []) {
      installedArmourMods.push(mod.baseMod.name);
    }
  }

  const metatype = input.heritageInfo?.heritage;
  const positiveQualities = input.positiveQualityListSelected?.map(
    (q) => q.name
  );
  const negativeQualities = input.negativeQualityListSelected?.map(
    (q) => q.name
  );

  const talent = input.talentInfo;
  const magicEnabled =
    talent !== undefined
      ? talent.category === talentCategoryEnum.Magic
      : undefined;
  const resonanceEnabled =
    talent !== undefined
      ? talent.category === talentCategoryEnum.Resonance
      : undefined;
  const depthEnabled =
    talent !== undefined
      ? talent.category === talentCategoryEnum.Depth
      : undefined;
  let tradition: string | undefined;
  let spells: string[] | undefined;
  let adeptPowers: string[] | undefined;
  let programs: string[] | undefined;
  let traditionSpiritForms: string[] | undefined;
  if (talent !== undefined && talent.category === talentCategoryEnum.Magic) {
    tradition = talent.selectedTradition?.name;
    const customSpirits = talent.selectedTradition?.customSpirits;
    if (customSpirits !== undefined && customSpirits.customSpirits === true) {
      traditionSpiritForms = Object.values(customSpirits.selectedSpiritTypes);
    }
    if (
      talent.selectedFormulae !== undefined &&
      typeof talent.selectedFormulae === "object" &&
      "selectFormulae" in talent.selectedFormulae &&
      talent.selectedFormulae.selectFormulae === true
    ) {
      spells = [
        ...(talent.selectedFormulae.spells ?? []),
        ...(talent.selectedFormulae.rituals ?? []),
      ];
    }
    if (
      talent.selectedAdeptPowers !== undefined &&
      typeof talent.selectedAdeptPowers === "object" &&
      "selectAdeptPowers" in talent.selectedAdeptPowers &&
      talent.selectedAdeptPowers.selectAdeptPowers === true
    ) {
      adeptPowers = [...talent.selectedAdeptPowers.adeptPowers];
    }
  } else if (
    talent !== undefined &&
    talent.category === talentCategoryEnum.Depth
  ) {
    programs = talent.programs?.map((p) => p.name);
  }

  const installedMartialArts =
    input.martialArtSelected !== undefined
      ? [input.martialArtSelected.martialArt.name]
      : undefined;
  const installedMartialTechniques =
    input.martialArtSelected !== undefined
      ? input.martialArtSelected.techniqueList.map((t) => t.name)
      : undefined;

  const lifestyles = input.lifestyleSelections?.map((l) => l.lifestyle.name);
  const lifestyleQualities = input.lifestyleSelections?.flatMap((l) =>
    l.lifestyleQualityList.map((q) => q.name)
  );

  // Core attributes plus special attributes (edge, magic/resonance/depth
  // by talent) plus derived Initiative. Keys normalize to lowercase since
  // requirement names use capitalized enum values.
  const mergedAttributes: Record<string, number> = {
    ...(input.attributeInfo ?? {}),
  };
  const specialAttributes = input.specialAttributeInfo;
  if (specialAttributes !== undefined) {
    mergedAttributes.edge = specialAttributes.edge;
    const specialTalent = specialAttributes.talent;
    if (specialTalent.category === talentCategoryEnum.Magic) {
      mergedAttributes.magic = specialTalent.magic;
    } else if (specialTalent.category === talentCategoryEnum.Resonance) {
      mergedAttributes.resonance = specialTalent.resonance;
    } else if (specialTalent.category === talentCategoryEnum.Depth) {
      mergedAttributes.depth = specialTalent.depth;
    }
    mergedAttributes.initiative =
      (mergedAttributes.reaction ?? 0) + (mergedAttributes.intuition ?? 0);
  }
  const attributes: Record<string, number> = {};
  for (const [key, rating] of Object.entries(mergedAttributes)) {
    attributes[key.toLowerCase()] = rating;
  }

  return {
    ...(metatype !== undefined && { metatype }),
    ...(positiveQualities !== undefined && { positiveQualities }),
    ...(negativeQualities !== undefined && { negativeQualities }),
    skills: skillsMap,
    installedCyberware,
    installedBioware,
    installedGear,
    ...(Object.keys(installedGearRatings).length > 0 && {
      installedGearRatings,
    }),
    ...(installedArmourMods.length > 0 && { installedArmourMods }),
    ...(installedMartialArts !== undefined && { installedMartialArts }),
    ...(installedMartialTechniques !== undefined && {
      installedMartialTechniques,
    }),
    ...(input.attributeInfo !== undefined ||
    input.specialAttributeInfo !== undefined
      ? { attributes }
      : {}),
    ...(programs !== undefined && { programs }),
    ...(lifestyles !== undefined && { lifestyles }),
    ...(lifestyleQualities !== undefined && { lifestyleQualities }),
    essence: input.essencePoints,
    ...(magicEnabled !== undefined && { magicEnabled }),
    ...(resonanceEnabled !== undefined && { resonanceEnabled }),
    ...(depthEnabled !== undefined && { depthEnabled }),
    ...(tradition !== undefined && { tradition }),
    ...(spells !== undefined && { spells }),
    ...(adeptPowers !== undefined && { adeptPowers }),
    ...(traditionSpiritForms !== undefined && { traditionSpiritForms }),
  };
}

export function buildRequirementEvaluationContext(
  equipment: SelectedEquipmentLoadedListType,
  path: readonly RequirementContextPathItem[],
  input: RequirementCharacterInput,
  isRoot: boolean
): RequirementEvaluationContextType {
  const { parent, grandparent } = resolveRequirementAncestors(path, equipment);
  return {
    ...(parent !== undefined && { parent }),
    ...(grandparent !== undefined && { grandparent }),
    character: buildRequirementCharacterContext(equipment, input),
    isRoot,
  };
}
