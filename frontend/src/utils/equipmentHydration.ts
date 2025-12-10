import type {
  SelectedEquipmentListType,
  SelectedEquipmentLoadedListType,
  EquipmentListType,
} from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas";
import {
  workerRequestEnum,
  workerResponseEnum,
  type WorkerRequestType,
  type WorkerResponseType,
} from "../workers/types";
import type {
  CustomisedWeaponType,
  CustomisedWeaponLoadedType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas";
import type {
  CustomisedWeaponAccessoryType,
  CustomisedWeaponAccessoryLoadedType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas";
import type {
  CustomisedGearType,
  CustomisedGearLoadedType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas";
import type {
  CustomisedArmourType,
  CustomisedArmourLoadedType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas";
import type {
  CustomisedArmourModType,
  CustomisedArmourModLoadedType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas";
import type {
  CustomisedAugmentationType,
  CustomisedAugmentationLoadedType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas";
import type {
  CustomisedVehicleType,
  CustomisedVehicleLoadedType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas";
import type {
  CustomisedVehicleModType,
  CustomisedVehicleModLoadedType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas";
import type {
  CustomisedWeaponMountType,
  CustomisedWeaponMountLoadedType,
} from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountSchemas";

function generateRequestId() {
  return Math.random().toString(36).substring(2, 15);
}

export function fetchEquipmentDetails(
  worker: Worker,
  requests: { [key: string]: string[] }
): Promise<EquipmentListType> {
  return new Promise((resolve, reject) => {
    const requestId = generateRequestId();

    const handler = (event: MessageEvent<WorkerResponseType>) => {
      if (
        event.data.type === workerResponseEnum.DETAILS &&
        event.data.requestId === requestId
      ) {
        worker.removeEventListener("message", handler);
        resolve(event.data.data);
      }
    };

    worker.addEventListener("message", handler);

    const message: WorkerRequestType = {
      type: workerRequestEnum.GET_DETAILS,
      requests,
      requestId,
    };
    worker.postMessage(message);

    // Timeout safety
    setTimeout(() => {
      worker.removeEventListener("message", handler);
      reject(new Error("Timeout fetching equipment details"));
    }, 5000);
  });
}

export async function hydrateEquipmentList(
  loaded: SelectedEquipmentListType,
  worker: Worker
): Promise<SelectedEquipmentLoadedListType> {
  // 1. Collect all IDs
  const requests: { [key: string]: Set<string> } = {
    weaponNames: new Set(),
    weaponAccessoryNames: new Set(),
    armourNames: new Set(),
    armourModNames: new Set(),
    gearNames: new Set(),
    augmentationNames: new Set(),
    vehicleNames: new Set(),
    vehicleModNames: new Set(),
    weaponMountModNames: new Set(),
    equipmentPackNames: new Set(),
  };

  // Helper to collect gear recursively
  const collectGear = (list?: CustomisedGearType[]) => {
    if (!list) return;
    list.forEach((gear) => {
      requests.gearNames.add(gear.baseGear);
      collectGear(gear.innerGearList);
    });
  };

  // Weapons
  loaded.weaponList.forEach((weapon) => {
    requests.weaponNames.add(weapon.baseWeapon);
    if (weapon.accessoryList) {
      weapon.accessoryList.forEach((acc) => {
        requests.weaponAccessoryNames.add(acc.baseAccessory);
        collectGear(acc.gearList);
      });
    }
  });

  // Armour
  loaded.armourList.forEach((armour) => {
    requests.armourNames.add(armour.baseArmour);
    if (armour.modList) {
      armour.modList.forEach((mod) => {
        requests.armourModNames.add(mod.baseMod);
        collectGear(mod.gearList);
      });
    }
    collectGear(armour.gearList);
  });

  // Gear
  collectGear(loaded.gearList);

  // Augmentations
  loaded.augmentationList.forEach((aug) => {
    requests.augmentationNames.add(aug.baseAugmentation);
    collectGear(aug.gearList);
  });

  // Vehicles
  loaded.vehicleList.forEach((vehicle) => {
    requests.vehicleNames.add(vehicle.baseVehicle);
    if (vehicle.modList) {
      vehicle.modList.forEach((mod) => {
        requests.vehicleModNames.add(mod.baseMod);
      });
    }
    collectGear(vehicle.gearList);
    if (vehicle.weaponMountList) {
      vehicle.weaponMountList.forEach((mount) => {
        if (mount.weaponMounted) {
          requests.weaponNames.add(mount.weaponMounted.baseWeapon);
          // Recurse for weapon accessories?
          if (mount.weaponMounted.accessoryList) {
            mount.weaponMounted.accessoryList.forEach((acc) => {
              requests.weaponAccessoryNames.add(acc.baseAccessory);
              collectGear(acc.gearList);
            });
          }
        }
      });
    }
  });

  // Convert Sets to arrays
  const requestArrays: { [key: string]: string[] } = {};
  for (const key in requests) {
    requestArrays[key] = Array.from(requests[key]);
  }

  // 2. Fetch data
  const data = await fetchEquipmentDetails(worker, requestArrays);

  // 3. Reconstruct
  // Helper to find item
  const find = <T extends { name: string }>(list: T[], name: string): T => {
    const item = list.find((i) => i.name === name);
    if (!item) throw new Error(`Item not found: ${name}`);
    return item;
  };

  const hydrateGear = ({
    baseGear,
    innerGearList,
    ...gear
  }: CustomisedGearType): CustomisedGearLoadedType => {
    return {
      ...gear,
      baseGear: find(data.gearList, baseGear),
      ...(innerGearList && { innerGearList: innerGearList.map(hydrateGear) }),
    };
  };

  const hydrateWeaponAccessory = ({
    baseAccessory,
    gearList,
    ...acc
  }: CustomisedWeaponAccessoryType): CustomisedWeaponAccessoryLoadedType => {
    return {
      ...acc,
      baseAccessory: find(data.weaponAccessoryList, baseAccessory),
      gearList: gearList.map(hydrateGear),
    };
  };

  const hydrateWeapon = ({
    baseWeapon,
    accessoryList,
    ...weapon
  }: CustomisedWeaponType): CustomisedWeaponLoadedType => {
    return {
      ...weapon,
      baseWeapon: find(data.weaponList, baseWeapon),
      ...(accessoryList && {
        accessoryList: accessoryList.map(hydrateWeaponAccessory),
      }),
    };
  };

  const hydrateArmourMod = ({
    baseMod,
    gearList,
    ...mod
  }: CustomisedArmourModType): CustomisedArmourModLoadedType => {
    return {
      ...mod,
      baseMod: find(data.armourModificationList, baseMod),
      ...(gearList && { gearList: gearList.map(hydrateGear) }),
    };
  };

  const hydrateArmour = ({
    baseArmour,
    modList,
    gearList,
    ...armour
  }: CustomisedArmourType): CustomisedArmourLoadedType => {
    return {
      ...armour,
      baseArmour: find(data.armourList, baseArmour),
      ...(modList && { modList: modList.map(hydrateArmourMod) }),
      ...(gearList && { gearList: gearList.map(hydrateGear) }),
    };
  };

  const hydrateAugmentation = ({
    baseAugmentation,
    gearList,
    ...aug
  }: CustomisedAugmentationType): CustomisedAugmentationLoadedType => {
    return {
      ...aug,
      baseAugmentation: find(data.augmentationList, baseAugmentation),
      ...(gearList && { gearList: gearList.map(hydrateGear) }),
    };
  };

  const hydrateVehicleMod = ({
    baseMod,
    ...mod
  }: CustomisedVehicleModType): CustomisedVehicleModLoadedType => {
    return {
      ...mod,
      baseMod: find(data.vehicleModificationList, baseMod),
    };
  };

  const hydrateWeaponMount = ({
    weaponMounted,
    ...mount
  }: CustomisedWeaponMountType): CustomisedWeaponMountLoadedType => {
    return {
      ...mount,
      ...(weaponMounted && { weaponMounted: hydrateWeapon(weaponMounted) }),
    };
  };

  const hydrateVehicle = ({
    baseVehicle,
    modList,
    gearList,
    weaponMountList,
    ...vehicle
  }: CustomisedVehicleType): CustomisedVehicleLoadedType => {
    return {
      ...vehicle,
      baseVehicle: find(data.vehicleList, baseVehicle),
      ...(modList && { modList: modList.map(hydrateVehicleMod) }),
      ...(gearList && { gearList: gearList.map(hydrateGear) }),
      ...(weaponMountList && {
        weaponMountList: weaponMountList.map(hydrateWeaponMount),
      }),
    };
  };

  return {
    equipmentPackList: loaded.equipmentPackList,
    weaponList: loaded.weaponList.map(hydrateWeapon),
    armourList: loaded.armourList.map(hydrateArmour),
    gearList: loaded.gearList.map(hydrateGear),
    augmentationList: loaded.augmentationList.map(hydrateAugmentation),
    vehicleList: loaded.vehicleList.map(hydrateVehicle),
  };
}

export function dehydrateEquipmentList(
  loaded: SelectedEquipmentLoadedListType
): SelectedEquipmentListType {
  const dehydrateGear = ({
    baseGear,
    innerGearList,
    ...gear
  }: CustomisedGearLoadedType): CustomisedGearType => {
    return {
      ...gear,
      baseGear: baseGear.name,
      ...(innerGearList && { innerGearList: innerGearList.map(dehydrateGear) }),
    };
  };

  const dehydrateWeaponAccessory = ({
    baseAccessory,
    gearList,
    ...acc
  }: CustomisedWeaponAccessoryLoadedType): CustomisedWeaponAccessoryType => {
    return {
      ...acc,
      baseAccessory: baseAccessory.name,
      gearList: gearList.map(dehydrateGear),
    };
  };

  const dehydrateWeapon = ({
    baseWeapon,
    accessoryList,
    ...weapon
  }: CustomisedWeaponLoadedType): CustomisedWeaponType => {
    return {
      ...weapon,
      baseWeapon: baseWeapon.name,
      ...(accessoryList && {
        accessoryList: accessoryList.map(dehydrateWeaponAccessory),
      }),
    };
  };

  const dehydrateArmourMod = ({
    baseMod,
    gearList,
    ...mod
  }: CustomisedArmourModLoadedType): CustomisedArmourModType => {
    return {
      ...mod,
      baseMod: baseMod.name,
      ...(gearList && { gearList: gearList.map(dehydrateGear) }),
    };
  };

  const dehydrateArmour = ({
    baseArmour,
    modList,
    gearList,
    ...armour
  }: CustomisedArmourLoadedType): CustomisedArmourType => {
    return {
      ...armour,
      baseArmour: baseArmour.name,
      ...(modList && { modList: modList.map(dehydrateArmourMod) }),
      ...(gearList && { gearList: gearList.map(dehydrateGear) }),
    };
  };

  const dehydrateAugmentation = ({
    baseAugmentation,
    gearList,
    ...aug
  }: CustomisedAugmentationLoadedType): CustomisedAugmentationType => {
    return {
      ...aug,
      baseAugmentation: baseAugmentation.name,
      ...(gearList && { gearList: gearList.map(dehydrateGear) }),
    };
  };

  const dehydrateVehicleMod = ({
    baseMod,
    ...mod
  }: CustomisedVehicleModLoadedType): CustomisedVehicleModType => {
    return {
      ...mod,
      baseMod: baseMod.name,
    };
  };

  const dehydrateWeaponMount = ({
    weaponMounted,
    ...mount
  }: CustomisedWeaponMountLoadedType): CustomisedWeaponMountType => {
    return {
      ...mount,
      ...(weaponMounted && { weaponMounted: dehydrateWeapon(weaponMounted) }),
    };
  };

  const dehydrateVehicle = ({
    baseVehicle,
    modList,
    gearList,
    weaponMountList,
    ...vehicle
  }: CustomisedVehicleLoadedType): CustomisedVehicleType => {
    return {
      ...vehicle,
      baseVehicle: baseVehicle.name,
      ...(modList && { modList: modList.map(dehydrateVehicleMod) }),
      ...(gearList && { gearList: gearList.map(dehydrateGear) }),
      ...(weaponMountList && {
        weaponMountList: weaponMountList.map(dehydrateWeaponMount),
      }),
    };
  };

  return {
    equipmentPackList: loaded.equipmentPackList,
    weaponList: loaded.weaponList.map(dehydrateWeapon),
    armourList: loaded.armourList.map(dehydrateArmour),
    gearList: loaded.gearList.map(dehydrateGear),
    augmentationList: loaded.augmentationList.map(dehydrateAugmentation),
    vehicleList: loaded.vehicleList.map(dehydrateVehicle),
  };
}
