import { CollapsibleDiv } from "../../../../utils/CollapsibleDiv.js";
import styles from "./EquipmentSelect.module.css";
import { CollapsibleEquipmentDiv } from "./EquipmentHelper.js";
import { EquipmentCard } from "./EquipmentCard.js";
import { GearSubList } from "./GearSubList.js";
import { ModSubList } from "./ModSubList.js";
import { costCalculation } from "../../../../utils/calculations.js";
import { Pagination } from "../../../shared/Pagination.js";
import { ArwesSelect } from "../../../common/ArwesSelect.js";
import { ArwesButton } from "../../../common/ArwesButton.js";
import {
  armourCategoryEnum,
  armourModCategoryEnum,
  augmentationCategoryEnum,
  augmentationGradeEnum,
  equipmentTypeEnum,
  formatArmourCost,
  formatAugmentationCost,
  formatGearCost,
  formatVehicleCost,
  formatVehicleModCost,
  formatWeaponCost,
  gearCategoryEnum,
  vehicleCategoryEnum,
  vehicleModCategoryEnum,
  weaponCategoryEnum,
  type ArmourModType,
  type ArmourType,
  type AugmentationType,
  type CharacterCreatorBonusListType,
  type CostAugmentationType,
  type CostGearType,
  type CostVehicleModType,
  type CostWeaponMountModType,
  type CostWeaponType,
  type CustomisedArmourLoadedType,
  type CustomisedArmourModLoadedType,
  type CustomisedAugmentationLoadedType,
  type CustomisedGearLoadedType,
  type CustomisedVehicleLoadedType,
  type CustomisedVehicleModLoadedType,
  type CustomisedWeaponAccessoryLoadedType,
  type CustomisedWeaponLoadedType,
  type CustomisedWeaponMountType,
  type EquipmentPackType,
  type GearType,
  type SelectedEquipmentListType,
  type SelectedEquipmentLoadedListType,
  type VehicleModType,
  type VehicleType,
  type WeaponAccessoryType,
  type WeaponMountModType,
  type WeaponType,
} from "@neon-codex/common";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import {
  hydrateEquipmentList,
  dehydrateEquipmentList,
} from "../../../../utils/equipmentHydration.js";
import {
  useEquipmentSearch,
  getWorker,
} from "../../../../hooks/useEquipmentSearch.js";
import type {
  ArmourListSearchItemList,
  ArmourModListSearchItemList,
  AugmentationListSearchItemList,
  EquipmentPackListSearchItemList,
  GearListSearchItemList,
  SearchResultEquipmentType,
  SearchResultItemType,
  VehicleListSearchItemList,
  VehicleModListSearchItemList,
  WeaponListSearchItemList,
  WeaponAccessoryListSearchItemList,
  WeaponMountModListSearchItemList,
} from "../../../../workers/types.js";

// Cost calculation helper functions that take data as a parameter
// These enable memoization with useCallback

function calculateWeaponCostHelper(weapon: CustomisedWeaponLoadedType): number {
  const baseWeapon = weapon.baseWeapon;
  const accessoryList =
    weapon.accessoryList !== undefined ? weapon.accessoryList : [];
  const baseWeaponAccessoryList = accessoryList.map((accessory) => {
    return calculateWeaponAccessoryCostHelper(accessory);
  });

  return (
    costCalculation<CostWeaponType>(baseWeapon.cost, {}) +
    baseWeaponAccessoryList.reduce((total: number, accessory) => {
      return total + accessory;
    }, 0)
  );
}

function calculateWeaponAccessoryCostHelper(
  accessory: CustomisedWeaponAccessoryLoadedType
): number {
  const baseAccessory = accessory.baseAccessory;
  const gearList =
    accessory.gearList?.map((gear) => {
      return calculateGearCostHelper(gear);
    }) ?? [];
  return (
    costCalculation<CostWeaponType>(baseAccessory.cost, {}) +
    gearList.reduce((total: number, gear) => {
      return total + gear;
    }, 0)
  );
}

function calculateArmourCostHelper(armour: CustomisedArmourLoadedType): number {
  const baseArmour = armour.baseArmour;
  const modList = armour.modList !== undefined ? armour.modList : [];
  const baseArmourModList = modList.map((mod) => {
    return calculateArmourModCostHelper(mod);
  });
  return (
    costCalculation<CostGearType>(baseArmour.cost, {}) +
    baseArmourModList.reduce((total: number, mod) => {
      return total + mod;
    }, 0)
  );
}

function calculateArmourModCostHelper(
  mod: CustomisedArmourModLoadedType
): number {
  const baseArmourMod = mod.baseMod;
  const gearList =
    mod.gearList !== undefined
      ? mod.gearList.map((gear) => {
          return calculateGearCostHelper(gear);
        })
      : [];
  return (
    costCalculation<CostGearType>(baseArmourMod.cost, {}) +
    gearList.reduce((total: number, gear) => {
      return total + gear;
    }, 0)
  );
}

function calculateGearCostHelper(gear: CustomisedGearLoadedType): number {
  const baseGear = gear.baseGear;
  const gearList = gear.innerGearList !== undefined ? gear.innerGearList : [];
  const childGearList = gearList.map((childGear) => {
    return calculateGearCostHelper(childGear);
  });

  return (
    costCalculation<CostGearType>(baseGear.cost, {}) +
    childGearList.reduce((total: number, innerGear) => {
      return total + innerGear;
    }, 0)
  );
}

function calculateAugmentationCostHelper(
  augmentation: CustomisedAugmentationLoadedType
): number {
  const baseAugmentation = augmentation.baseAugmentation;
  const gearList =
    augmentation.gearList !== undefined ? augmentation.gearList : [];
  const childGearList = gearList.map((gear) => {
    return calculateGearCostHelper(gear);
  });
  return (
    costCalculation<CostAugmentationType>(baseAugmentation.cost, {}) +
    childGearList.reduce((total: number, gear) => {
      return total + gear;
    }, 0)
  );
}

function calculateVehicleCostHelper(
  vehicle: CustomisedVehicleLoadedType
): number {
  const baseVehicle = vehicle.baseVehicle;
  const modList = vehicle.modList !== undefined ? vehicle.modList : [];
  const baseVehicleModList = modList.map((mod) => {
    return calculateVehicleModCostHelper(mod);
  });
  return (
    costCalculation<CostGearType>(baseVehicle.cost, {}) +
    baseVehicleModList.reduce((total: number, mod) => {
      return total + mod;
    }, 0)
  );
}

function calculateVehicleModCostHelper(
  mod: CustomisedVehicleModLoadedType
): number {
  const baseVehicleMod = mod.baseMod;
  return costCalculation<CostVehicleModType>(baseVehicleMod.cost, {});
}

function calculateWeaponMountModCostHelper(mod: WeaponMountModType): number {
  return costCalculation<CostWeaponMountModType>(mod.cost, {});
}

interface IProps {
  equipmentSelections: SelectedEquipmentListType;
  setEquipmentSelections: (
    loadingEquipmentSelections: SelectedEquipmentListType
  ) => void;
  nuyen: number;
  setNuyen: (nuyen: number) => void;
  essencePoints: number;
  setEssencePoints: (essencePoints: number) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

const categoryDisplayNames: Record<equipmentTypeEnum, string> = {
  Weapon: "Weapons",
  Armour: "Armour",
  Gear: "Gear",
  Vehicle: "Vehicles & Drones",
  Augmentation: "Augmentations",
  EquipmentPack: "Equipment Packs",
  WeaponAccessory: "Weapon Accessories",
  ArmourMod: "Armour Modifications",
  VehicleMod: "Vehicle Modifications",
  WeaponMountMod: "Weapon Mount Modifications",
};

interface ConfigurationPathItem {
  category: equipmentTypeEnum | "WeaponMount";
  index: number;
  name: string;
}

interface ConfigurationContext {
  path: ConfigurationPathItem[];
}

const subtypeOptions: Record<equipmentTypeEnum, string[]> = {
  Weapon: Object.values(weaponCategoryEnum),
  Armour: Object.values(armourCategoryEnum),
  Gear: Object.values(gearCategoryEnum),
  Vehicle: Object.values(vehicleCategoryEnum),
  Augmentation: Object.values(augmentationCategoryEnum),
  EquipmentPack: [],
  WeaponAccessory: [],
  ArmourMod: Object.values(armourModCategoryEnum),
  VehicleMod: Object.values(vehicleModCategoryEnum),
  WeaponMountMod: Object.values(vehicleModCategoryEnum),
};

export const EquipmentSelect = function (props: IProps) {
  // Local state for equipment selections - syncs to parent on unmount
  const [localEquipment, setLocalEquipment] =
    useState<SelectedEquipmentLoadedListType>({
      weaponList: [],
      armourList: [],
      gearList: [],
      vehicleList: [],
      augmentationList: [],
      equipmentPackList: [],
    });
  const [localNuyen, setLocalNuyen] = useState<number>(() => props.nuyen);

  // Category and filter state
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] =
    useState<SearchResultEquipmentType>({ category: equipmentTypeEnum.Weapon });
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Sync local state to parent on unmount (step change)
  // Using a ref to avoid stale closure issues
  const localEquipmentRef = useRef(localEquipment);
  const localNuyenRef = useRef(localNuyen);

  console.log("Rendering EquipmentSelect");

  useEffect(() => {
    localEquipmentRef.current = localEquipment;
    localNuyenRef.current = localNuyen;
  }, [localEquipment, localNuyen]);

  // Hydrate on mount
  useEffect(() => {
    const worker = getWorker();
    hydrateEquipmentList(props.equipmentSelections, worker).then(
      setLocalEquipment,
      (error) => {
        console.error("Error hydrating equipment selections:", error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      console.log("Unmounting EquipmentSelect, syncing to parent");
      // Sync to parent on unmount
      if (localEquipmentRef.current) {
        props.setEquipmentSelections(
          dehydrateEquipmentList(localEquipmentRef.current)
        );
      }
      props.setNuyen(localNuyenRef.current);
    };
    // Intentionally empty deps - we only want this to run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Query for paginated equipment based on selected category
  // Build query input, only including optional properties if they have values
  const {
    search,
    results: searchResults,
    isReady,
    isSearching,
    error: searchError,
  } = useEquipmentSearch();

  useEffect(() => {
    if (isReady && !isSearching) {
      search(searchQuery, selectedEquipmentDetails);
    }
  }, [searchQuery, selectedEquipmentDetails, isReady]);

  const paginatedData = useMemo(() => {
    const start = offset;
    const end = offset + ITEMS_PER_PAGE;
    const items = searchResults.slice(start, end);
    return {
      items,
      total: searchResults.length,
      hasMore: end < searchResults.length,
      offset,
      limit: ITEMS_PER_PAGE,
    };
  }, [searchResults, offset]);

  const isPending = !isReady || !isSearching;
  const isError = searchError !== undefined;
  const error = searchError !== undefined ? new Error(searchError) : undefined;

  // Track if we've ever loaded data - only show initial loading screen once
  const hasEverLoaded = useRef(false);
  if (paginatedData !== undefined) {
    hasEverLoaded.current = true;
  }

  // Reset offset when category or subtype changes
  useEffect(() => {
    setOffset(0);
  }, [selectedEquipmentDetails, searchQuery]);

  // Only show initial loading screen if we've never loaded data before
  if (isPending && paginatedData === undefined && !hasEverLoaded.current) {
    return <div>Loading equipment...</div>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  if (!localEquipment) {
    return <div>Hydrating equipment...</div>;
  }

  return (
    <EquipmentSelectLoaded
      localEquipment={localEquipment}
      setLocalEquipment={setLocalEquipment}
      localNuyen={localNuyen}
      setLocalNuyen={setLocalNuyen}
      essencePoints={props.essencePoints}
      setEssencePoints={props.setEssencePoints}
      bonusInfo={props.bonusInfo}
      setBonusInfo={props.setBonusInfo}
      paginatedData={paginatedData}
      selectedEquipmentDetails={selectedEquipmentDetails}
      setSelectedEquipmentDetails={setSelectedEquipmentDetails}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      offset={offset}
      setOffset={setOffset}
      itemsPerPage={ITEMS_PER_PAGE}
      worker={getWorker()}
    />
  );
};

interface ILoadedProps {
  localEquipment: SelectedEquipmentLoadedListType;
  setLocalEquipment: Dispatch<SetStateAction<SelectedEquipmentLoadedListType>>;
  localNuyen: number;
  setLocalNuyen: Dispatch<SetStateAction<number>>;
  essencePoints: number;
  setEssencePoints: (essencePoints: number) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
  paginatedData: {
    items: SearchResultItemType[];
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
  selectedEquipmentDetails: SearchResultEquipmentType;
  setSelectedEquipmentDetails: (
    equipmentDetails: SearchResultEquipmentType
  ) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  offset: number;
  setOffset: (offset: number) => void;
  itemsPerPage: number;
  worker: Worker;
}

const EquipmentSelectLoaded = function (props: ILoadedProps) {
  const [configContext, setConfigContext] =
    useState<ConfigurationContext | null>(null);

  const startConfiguration = useCallback(
    (path: ConfigurationPathItem[], initialCategory?: equipmentTypeEnum) => {
      setConfigContext({ path });
      if (initialCategory !== undefined) {
        props.setSelectedEquipmentDetails({
          category: initialCategory,
        } as SearchResultEquipmentType);
      }
    },
    [props]
  );

  const finishConfiguration = useCallback(() => {
    setConfigContext(null);
  }, []);

  const checkConfigPathAndExit = useCallback(
    (
      removedPath: {
        category: equipmentTypeEnum | "WeaponMount";
        index: number;
      }[]
    ) => {
      if (!configContext) return;
      if (removedPath.length <= configContext.path.length) {
        const match = removedPath.every(
          (item, idx) =>
            configContext.path[idx].category === item.category &&
            configContext.path[idx].index === item.index
        );
        if (match) {
          finishConfiguration();
        }
      }
    },
    [configContext, finishConfiguration]
  );

  // Memoized add/remove functions to prevent unnecessary re-renders
  const addWeapon = useCallback(
    function (weapon: WeaponType) {
      const newWeapon: CustomisedWeaponLoadedType = {
        baseWeapon: weapon,
      };

      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        if (last.category === "WeaponMount") {
          props.setLocalEquipment((prev) => {
            const next = { ...prev };
            // Path for weapon mount: [Vehicle, index, WeaponMount, index]
            const vehicleIdx = configContext.path[0].index;
            const mountIdx = configContext.path[1].index;
            const newVehicles = [...next.vehicleList];
            const newVehicle = { ...newVehicles[vehicleIdx] };
            const newMounts = [...(newVehicle.weaponMountList || [])];
            newMounts[mountIdx] = {
              ...newMounts[mountIdx],
              weaponMounted: newWeapon,
            };
            newVehicle.weaponMountList = newMounts;
            newVehicles[vehicleIdx] = newVehicle;
            next.vehicleList = newVehicles;
            return next;
          });
          const cost = calculateWeaponCostHelper(newWeapon);
          props.setLocalNuyen((prev) => prev - cost);
          return;
        }
      }

      props.setLocalEquipment((prev) => ({
        ...prev,
        weaponList: [...prev.weaponList, newWeapon],
      }));
      const cost = calculateWeaponCostHelper(newWeapon);
      props.setLocalNuyen((prev) => prev - cost);
    },
    [configContext, props]
  );

  const removeWeapon = useCallback(
    function (weapon: CustomisedWeaponLoadedType, index: number) {
      checkConfigPathAndExit([{ category: equipmentTypeEnum.Weapon, index }]);
      props.setLocalEquipment((prev) => {
        if (prev.weaponList[index] === weapon) {
          const newList = [...prev.weaponList];
          newList.splice(index, 1);
          return { ...prev, weaponList: newList };
        }
        console.error("No weapon at index: " + index);
        return prev;
      });
      const cost = calculateWeaponCostHelper(weapon);
      props.setLocalNuyen((prev) => prev + cost);
    },
    [checkConfigPathAndExit, props]
  );

  // Armour methods
  const addArmour = useCallback(function (armour: ArmourType) {
    const newArmour: CustomisedArmourLoadedType = {
      baseArmour: armour,
    };
    props.setLocalEquipment((prev) => ({
      ...prev,
      armourList: [...prev.armourList, newArmour],
    }));
    const cost = calculateArmourCostHelper(newArmour);
    props.setLocalNuyen((prev) => prev - cost);
  }, []);

  const removeArmour = useCallback(
    function (armour: CustomisedArmourLoadedType, index: number) {
      checkConfigPathAndExit([{ category: equipmentTypeEnum.Armour, index }]);
      props.setLocalEquipment((prev) => {
        if (prev.armourList[index] === armour) {
          const newList = [...prev.armourList];
          newList.splice(index, 1);
          return { ...prev, armourList: newList };
        }
        console.error("No armour at index: " + index);
        return prev;
      });
      const cost = calculateArmourCostHelper(armour);
      props.setLocalNuyen((prev) => prev + cost);
    },
    [checkConfigPathAndExit, props]
  );

  // Gear methods
  const addGear = useCallback(
    function (gear: GearType) {
      const newGear: CustomisedGearLoadedType = {
        baseGear: gear,
      };

      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        props.setLocalEquipment((prev) => {
          const next = { ...prev };
          if (last.category === equipmentTypeEnum.Weapon) {
            const idx = last.index;
            const newList = [...next.weaponList];
            // Weapon doesn't directly have gearList in schema, but accessories do.
            // Wait, WeaponAccessory has gearList.
            // Let's check Weapon schema.
            // Weapon has allowedGearList.
          } else if (last.category === equipmentTypeEnum.Armour) {
            const idx = last.index;
            const newList = [...next.armourList];
            const newItem = { ...newList[idx] };
            newItem.gearList = [...(newItem.gearList || []), newGear];
            newList[idx] = newItem;
            next.armourList = newList;
          } else if (last.category === equipmentTypeEnum.Gear) {
            const idx = last.index;
            const newList = [...next.gearList];
            // Need to handle recursive path for gear
            // For now, only top level gear nesting
            const newItem = { ...newList[idx] };
            newItem.innerGearList = [
              ...(newItem.innerGearList !== undefined
                ? newItem.innerGearList
                : []),
              newGear,
            ];
            newList[idx] = newItem;
            next.gearList = newList;
          } else if (last.category === equipmentTypeEnum.Augmentation) {
            const idx = last.index;
            const newList = [...next.augmentationList];
            const newItem = { ...newList[idx] };
            newItem.gearList = [...(newItem.gearList || []), newGear];
            newList[idx] = newItem;
            next.augmentationList = newList;
          } else if (last.category === equipmentTypeEnum.WeaponAccessory) {
            const weaponIdx = configContext.path[0].index;
            const accIdx = configContext.path[1].index;
            const newWeapons = [...next.weaponList];
            const newWeapon = { ...newWeapons[weaponIdx] };
            const newAccessories = [...(newWeapon.accessoryList || [])];
            const newAccessory = { ...newAccessories[accIdx] };
            newAccessory.gearList = [
              ...(newAccessory.gearList !== undefined
                ? newAccessory.gearList
                : []),
              newGear,
            ];
            newAccessories[accIdx] = newAccessory;
            newWeapon.accessoryList = newAccessories;
            newWeapons[weaponIdx] = newWeapon;
            next.weaponList = newWeapons;
          } else if (last.category === equipmentTypeEnum.Vehicle) {
            const idx = last.index;
            const newList = [...next.vehicleList];
            const newItem = { ...newList[idx] };
            newItem.gearList = [...(newItem.gearList || []), newGear];
            newList[idx] = newItem;
            next.vehicleList = newList;
          }
          return next;
        });
        const cost = calculateGearCostHelper(newGear);
        props.setLocalNuyen((prev) => prev - cost);
        return;
      }

      props.setLocalEquipment((prev) => ({
        ...prev,
        gearList: [...prev.gearList, newGear],
      }));
      const cost = calculateGearCostHelper(newGear);
      props.setLocalNuyen((prev) => prev - cost);
    },
    [configContext, props]
  );

  const removeGear = useCallback(
    function (gear: CustomisedGearLoadedType, index: number) {
      checkConfigPathAndExit([{ category: equipmentTypeEnum.Gear, index }]);
      props.setLocalEquipment((prev) => {
        if (prev.gearList[index] === gear) {
          const newList = [...prev.gearList];
          newList.splice(index, 1);
          return { ...prev, gearList: newList };
        }
        console.error("No gear at index: " + index);
        return prev;
      });
      const cost = calculateGearCostHelper(gear);
      props.setLocalNuyen((prev) => prev + cost);
    },
    [checkConfigPathAndExit, props]
  );

  // Augmentation methods
  const addAugmentation = useCallback(
    function (augmentation: AugmentationType) {
      const newAugmentation: CustomisedAugmentationLoadedType = {
        baseAugmentation: augmentation,
        grade: augmentationGradeEnum.Standard,
      };
      props.setLocalEquipment((prev) => ({
        ...prev,
        augmentationList: [...prev.augmentationList, newAugmentation],
      }));
      const cost = calculateAugmentationCostHelper(newAugmentation);
      props.setLocalNuyen((prev) => prev - cost);
      // Update essence for augmentations
      const essenceCost =
        typeof augmentation.essenceCost === "number"
          ? augmentation.essenceCost
          : 0;
      props.setEssencePoints(props.essencePoints - essenceCost);
    },
    [props.essencePoints]
  );

  const removeAugmentation = useCallback(
    function (augmentation: CustomisedAugmentationLoadedType, index: number) {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Augmentation, index },
      ]);
      props.setLocalEquipment((prev) => {
        if (prev.augmentationList[index] === augmentation) {
          const newList = [...prev.augmentationList];
          newList.splice(index, 1);
          return { ...prev, augmentationList: newList };
        }
        console.error("No augmentation at index: " + index);
        return prev;
      });
      const cost = calculateAugmentationCostHelper(augmentation);
      props.setLocalNuyen((prev) => prev + cost);
      // Restore essence for augmentations
      const baseAugmentation = augmentation.baseAugmentation;
      const essenceCost =
        typeof baseAugmentation.essenceCost === "number"
          ? baseAugmentation.essenceCost
          : 0;
      props.setEssencePoints(props.essencePoints + essenceCost);
    },
    [props.essencePoints]
  );

  // Vehicle methods
  const addVehicle = useCallback(function (vehicle: VehicleType) {
    const newVehicle: CustomisedVehicleLoadedType = {
      baseVehicle: vehicle,
    };
    props.setLocalEquipment((prev) => ({
      ...prev,
      vehicleList: [...prev.vehicleList, newVehicle],
    }));
    const cost = calculateVehicleCostHelper(newVehicle);
    props.setLocalNuyen((prev) => prev - cost);
  }, []);

  const addWeaponAccessory = useCallback(
    (accessory: WeaponAccessoryType) => {
      const newAccessory: CustomisedWeaponAccessoryLoadedType = {
        baseAccessory: accessory,
        gearList: [],
        mountList: [],
      };
      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        if (last.category === equipmentTypeEnum.Weapon) {
          props.setLocalEquipment((prev) => {
            const next = { ...prev };
            const idx = last.index;
            const newList = [...next.weaponList];
            const newItem = { ...newList[idx] };
            newItem.accessoryList = [
              ...(newItem.accessoryList || []),
              newAccessory,
            ];
            newList[idx] = newItem;
            next.weaponList = newList;
            return next;
          });
          const cost = calculateWeaponAccessoryCostHelper(newAccessory);
          props.setLocalNuyen((prev) => prev - cost);
        }
      }
    },
    [configContext, props]
  );

  const addArmourMod = useCallback(
    (mod: ArmourModType) => {
      const newMod: CustomisedArmourModLoadedType = {
        baseMod: mod,
        gearList: [],
      };
      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        if (last.category === equipmentTypeEnum.Armour) {
          props.setLocalEquipment((prev) => {
            const next = { ...prev };
            const idx = last.index;
            const newList = [...next.armourList];
            const newItem = { ...newList[idx] };
            newItem.modList = [...(newItem.modList || []), newMod];
            newList[idx] = newItem;
            next.armourList = newList;
            return next;
          });
          const cost = calculateArmourModCostHelper(newMod);
          props.setLocalNuyen((prev) => prev - cost);
        }
      }
    },
    [configContext, props]
  );

  const addVehicleMod = useCallback(
    (mod: VehicleModType) => {
      const newMod: CustomisedVehicleModLoadedType = {
        baseMod: mod,
      };
      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        if (last.category === equipmentTypeEnum.Vehicle) {
          props.setLocalEquipment((prev) => {
            const next = { ...prev };
            const idx = last.index;
            const newList = [...next.vehicleList];
            const newItem = { ...newList[idx] };
            newItem.modList = [...(newItem.modList || []), newMod];
            newList[idx] = newItem;
            next.vehicleList = newList;
            return next;
          });
          const cost = calculateVehicleModCostHelper(newMod);
          props.setLocalNuyen((prev) => prev - cost);
        }
      }
    },
    [configContext, props]
  );

  const addWeaponMountMod = useCallback(
    (mod: WeaponMountModType) => {
      if (configContext) {
        const last = configContext.path[configContext.path.length - 1];
        if (last.category === "WeaponMount") {
          props.setLocalEquipment((prev) => {
            const next = { ...prev };
            const vehicleIdx = configContext.path[0].index;
            const mountIdx = configContext.path[1].index;
            const vehicleList = [...next.vehicleList];
            const vehicle = { ...vehicleList[vehicleIdx] };
            const mountList = [...(vehicle.weaponMountList || [])];
            const mount = { ...mountList[mountIdx] };
            mount.weaponMountModList = [
              ...(mount.weaponMountModList || []),
              mod.name,
            ];
            mountList[mountIdx] = mount;
            vehicle.weaponMountList = mountList;
            vehicleList[vehicleIdx] = vehicle;
            next.vehicleList = vehicleList;
            return next;
          });
          const cost = calculateWeaponMountModCostHelper(mod);
          props.setLocalNuyen((prev) => prev - cost);
        }
      }
    },
    [configContext, props]
  );

  const removeVehicle = useCallback(
    function (vehicle: CustomisedVehicleLoadedType, index: number) {
      checkConfigPathAndExit([{ category: equipmentTypeEnum.Vehicle, index }]);
      props.setLocalEquipment((prev) => {
        if (prev.vehicleList[index] === vehicle) {
          const newList = [...prev.vehicleList];
          newList.splice(index, 1);
          return { ...prev, vehicleList: newList };
        }
        console.error("No vehicle at index: " + index);
        return prev;
      });
      const cost = calculateVehicleCostHelper(vehicle);
      props.setLocalNuyen((prev) => prev + cost);
    },
    [checkConfigPathAndExit, props]
  );

  const removeWeaponAccessory = useCallback(
    (weaponIndex: number, accessoryIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Weapon, index: weaponIndex },
        { category: equipmentTypeEnum.WeaponAccessory, index: accessoryIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const weaponList = [...next.weaponList];
        const weapon = { ...weaponList[weaponIndex] };
        const accessoryList = [...(weapon.accessoryList || [])];
        const removed = accessoryList.splice(accessoryIndex, 1)[0];
        weapon.accessoryList = accessoryList;
        weaponList[weaponIndex] = weapon;
        next.weaponList = weaponList;

        const cost = calculateWeaponAccessoryCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeArmourMod = useCallback(
    (armourIndex: number, modIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Armour, index: armourIndex },
        { category: equipmentTypeEnum.ArmourMod, index: modIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const armourList = [...next.armourList];
        const armour = { ...armourList[armourIndex] };
        const modList = [...(armour.modList || [])];
        const removed = modList.splice(modIndex, 1)[0];
        armour.modList = modList;
        armourList[armourIndex] = armour;
        next.armourList = armourList;

        const cost = calculateArmourModCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeVehicleMod = useCallback(
    (vehicleIndex: number, modIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Vehicle, index: vehicleIndex },
        { category: equipmentTypeEnum.VehicleMod, index: modIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const vehicleList = [...next.vehicleList];
        const vehicle = { ...vehicleList[vehicleIndex] };
        const modList = [...(vehicle.modList || [])];
        const removed = modList.splice(modIndex, 1)[0];
        vehicle.modList = modList;
        vehicleList[vehicleIndex] = vehicle;
        next.vehicleList = vehicleList;

        const cost = calculateVehicleModCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeGearFromArmour = useCallback(
    (armourIndex: number, gearIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Armour, index: armourIndex },
        { category: equipmentTypeEnum.Gear, index: gearIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const armourList = [...next.armourList];
        const armour = { ...armourList[armourIndex] };
        const gearList = [...(armour.gearList || [])];
        const removed = gearList.splice(gearIndex, 1)[0];
        armour.gearList = gearList;
        armourList[armourIndex] = armour;
        next.armourList = armourList;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeGearFromVehicle = useCallback(
    (vehicleIndex: number, gearIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Vehicle, index: vehicleIndex },
        { category: equipmentTypeEnum.Gear, index: gearIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const vehicleList = [...next.vehicleList];
        const vehicle = { ...vehicleList[vehicleIndex] };
        const gearList = [...(vehicle.gearList || [])];
        const removed = gearList.splice(gearIndex, 1)[0];
        vehicle.gearList = gearList;
        vehicleList[vehicleIndex] = vehicle;
        next.vehicleList = vehicleList;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeGearFromAugmentation = useCallback(
    (augIndex: number, gearIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Augmentation, index: augIndex },
        { category: equipmentTypeEnum.Gear, index: gearIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const augmentationList = [...next.augmentationList];
        const augmentation = { ...augmentationList[augIndex] };
        const gearList = [...(augmentation.gearList || [])];
        const removed = gearList.splice(gearIndex, 1)[0];
        augmentation.gearList = gearList;
        augmentationList[augIndex] = augmentation;
        next.augmentationList = augmentationList;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeGearFromGear = useCallback(
    (parentIndex: number, gearIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Gear, index: parentIndex },
        { category: equipmentTypeEnum.Gear, index: gearIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const gearList = [...next.gearList];
        const gear = { ...gearList[parentIndex] };
        const innerGearList = [
          ...(gear.innerGearList !== undefined ? gear.innerGearList : []),
        ];
        const removed = innerGearList.splice(gearIndex, 1)[0];
        gear.innerGearList = innerGearList;
        gearList[parentIndex] = gear;
        next.gearList = gearList;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeWeaponFromMount = useCallback(
    (vehicleIndex: number, mountIndex: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Vehicle, index: vehicleIndex },
        { category: "WeaponMount", index: mountIndex },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const vehicleList = [...next.vehicleList];
        const vehicle = { ...vehicleList[vehicleIndex] };
        const mountList = [...(vehicle.weaponMountList || [])];
        const mount = { ...mountList[mountIndex] };
        const removed = mount.weaponMounted;
        delete mount.weaponMounted;
        mountList[mountIndex] = mount;
        vehicle.weaponMountList = mountList;
        vehicleList[vehicleIndex] = vehicle;
        next.vehicleList = vehicleList;

        if (removed) {
          const cost = calculateWeaponCostHelper(removed);
          props.setLocalNuyen((n) => n + cost);
        }
        return next;
      });
    },
    [props]
  );

  // Equipment pack methods
  const addEquipmentPack = useCallback(function (
    equipmentPack: EquipmentPackType
  ) {
    props.setLocalEquipment((prev) => ({
      ...prev,
      equipmentPackList: [...prev.equipmentPackList, equipmentPack],
    }));
    props.setLocalNuyen((prev) => prev - equipmentPack.nuyen);
  }, []);

  const configTabs = useMemo(() => {
    if (!configContext) return null;
    const last = configContext.path[configContext.path.length - 1];
    if (last.category === "WeaponMount") {
      return [equipmentTypeEnum.Weapon, equipmentTypeEnum.WeaponMountMod];
    }
    switch (last.category) {
      case equipmentTypeEnum.Weapon:
        return [equipmentTypeEnum.WeaponAccessory, equipmentTypeEnum.Gear];
      case equipmentTypeEnum.Armour:
        return [equipmentTypeEnum.ArmourMod, equipmentTypeEnum.Gear];
      case equipmentTypeEnum.Vehicle:
        return [equipmentTypeEnum.VehicleMod, equipmentTypeEnum.Gear];
      case equipmentTypeEnum.Augmentation:
        return [equipmentTypeEnum.Gear];
      case equipmentTypeEnum.Gear:
        return [equipmentTypeEnum.Gear];
      default:
        return [];
    }
  }, [configContext]);

  const removeWeaponMountMod = useCallback(
    (vehicleIndex: number, mountIndex: number, modName: string) => {
      // Need to find the mod in the indexed data to get the cost
      // For now, we will just remove it.
      // Ideally we would have hydrated this.
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const vehicleList = [...next.vehicleList];
        const vehicle = { ...vehicleList[vehicleIndex] };
        const mountList = [...(vehicle.weaponMountList || [])];
        const mount = { ...mountList[mountIndex] };
        const modIdx = (mount.weaponMountModList || []).indexOf(modName);
        if (modIdx > -1) {
          const newMods = [...(mount.weaponMountModList || [])];
          newMods.splice(modIdx, 1);
          mount.weaponMountModList = newMods;
          mountList[mountIndex] = mount;
          vehicle.weaponMountList = mountList;
          vehicleList[vehicleIndex] = vehicle;
          next.vehicleList = vehicleList;
        }
        return next;
      });
      // TODO: refund cost
    },
    [props]
  );

  const removeGearFromAccessory = useCallback(
    (weaponIdx: number, accIdx: number, gearIdx: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Weapon, index: weaponIdx },
        { category: equipmentTypeEnum.WeaponAccessory, index: accIdx },
        { category: equipmentTypeEnum.Gear, index: gearIdx },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const weapons = [...next.weaponList];
        const weapon = { ...weapons[weaponIdx] };
        const accessories = [...(weapon.accessoryList || [])];
        const accessory = { ...accessories[accIdx] };
        const gearList = [
          ...(accessory.gearList !== undefined ? accessory.gearList : []),
        ];
        const removed = gearList.splice(gearIdx, 1)[0];
        accessory.gearList = gearList;
        accessories[accIdx] = accessory;
        weapon.accessoryList = accessories;
        weapons[weaponIdx] = weapon;
        next.weaponList = weapons;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const removeGearFromArmourMod = useCallback(
    (armourIdx: number, modIdx: number, gearIdx: number) => {
      checkConfigPathAndExit([
        { category: equipmentTypeEnum.Armour, index: armourIdx },
        { category: equipmentTypeEnum.ArmourMod, index: modIdx },
        { category: equipmentTypeEnum.Gear, index: gearIdx },
      ]);
      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        const armourList = [...next.armourList];
        const armour = { ...armourList[armourIdx] };
        const modList = [...(armour.modList || [])];
        const mod = { ...modList[modIdx] };
        const gearList = [...(mod.gearList || [])];
        const removed = gearList.splice(gearIdx, 1)[0];
        mod.gearList = gearList;
        modList[modIdx] = mod;
        armour.modList = modList;
        armourList[armourIdx] = armour;
        next.armourList = armourList;

        const cost = calculateGearCostHelper(removed);
        props.setLocalNuyen((n) => n + cost);
        return next;
      });
    },
    [props]
  );

  const breakEquipmentPack = useCallback(
    async (equipmentPack: EquipmentPackType) => {
      const hydrated = await hydrateEquipmentList(
        {
          weaponList: equipmentPack.weaponList,
          armourList: equipmentPack.armourList,
          gearList: equipmentPack.gearList,
          augmentationList: equipmentPack.augmentationList,
          vehicleList: equipmentPack.vehicleList,
          equipmentPackList: [],
        },
        props.worker
      );

      props.setLocalEquipment((prev) => {
        const next = { ...prev };
        next.weaponList = [...next.weaponList, ...hydrated.weaponList];
        next.armourList = [...next.armourList, ...hydrated.armourList];
        next.gearList = [...next.gearList, ...hydrated.gearList];
        next.augmentationList = [
          ...next.augmentationList,
          ...hydrated.augmentationList,
        ];
        next.vehicleList = [...next.vehicleList, ...hydrated.vehicleList];
        return next;
      });
    },
    [props]
  );

  const renderIncludedItems = (item: any) => {
    const included: string[] = [];
    if (item.includedAccessoryList) {
      included.push(
        ...item.includedAccessoryList.map((a: any) => a.baseAccessory)
      );
    }
    if (item.includedModList) {
      included.push(...item.includedModList.map((m: any) => m.baseMod));
    }
    if (item.includedGearList) {
      included.push(...item.includedGearList.map((g: any) => g.baseGear));
    }
    if (item.includedWeaponMountList) {
      included.push(
        ...item.includedWeaponMountList.map(
          (m: any) => `${m.size} ${m.flexibility} Mount`
        )
      );
    }
    if (included.length > 0) {
      return (
        <div className={styles.itemIncludes}>
          Includes: {included.join(", ")}
        </div>
      );
    }
    return null;
  };

  const renderBuiltInItems = (
    list: any[] | undefined,
    label: string,
    nameField: string
  ) => {
    if (!list || list.length === 0) return null;
    return (
      <div className={styles.subListContainer}>
        <span className={styles.subListHeader}>Built-in {label}:</span>
        <ul className={styles.subList}>
          {list.map((item, idx) => {
            const displayName = item[nameField]?.name || item[nameField];
            return (
              <li
                key={displayName + idx}
                className={`${styles.subListItem} ${styles.builtIn}`}
              >
                <span className={styles.smallText}>{displayName}</span>
                <span className={styles.xsText}>Built-in</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderBuiltInWeaponMounts = (
    list: Array<CustomisedWeaponMountType> | undefined
  ) => {
    if (!list || list.length === 0) return null;
    return (
      <div className={styles.subListContainer}>
        <span className={styles.subListHeader}>Built-in Weapon Mounts:</span>
        <ul className={styles.subList}>
          {list.map((mount, idx) => {
            const mountName = `${mount.size} ${mount.flexibility} Mount`;
            return (
              <li
                key={mountName + idx}
                className={`${styles.weaponMountItem} ${styles.builtIn}`}
              >
                <div className={styles.flexRow}>
                  <span className={styles.smallText}>{mountName}</span>
                  <span className={styles.xsText}>Built-in</span>
                </div>
                {mount.weaponMounted !== undefined && (
                  <div className={styles.subListItem}>
                    <span>Weapon: {mount.weaponMounted.baseWeapon}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Calculate total pages
  const totalItems = props.paginatedData.total ?? 0;
  const totalPages = Math.ceil(totalItems / props.itemsPerPage);
  const currentPage = Math.floor(props.offset / props.itemsPerPage) + 1;

  const handlePageChange = (page: number) => {
    props.setOffset((page - 1) * props.itemsPerPage);
  };

  // Render paginated items based on category
  const renderPaginatedItems = () => {
    const { items } = props.paginatedData;

    if (items.length === 0) {
      return <div className={styles.paddedContainer}>No items found.</div>;
    }

    // We need this check as sometimes we rerender before paginatedData is ready
    if (items[0].category !== props.selectedEquipmentDetails.category) {
      return (
        <div className={styles.paddedContainer}>
          No items found for selected category.
        </div>
      );
    }

    // Type-safe renderer map
    const renderers: {
      [K in equipmentTypeEnum]?: (items: SearchResultItemType[]) => ReactNode;
    } = {
      [equipmentTypeEnum.Weapon]: (items) =>
        (items as WeaponListSearchItemList).map((weapon, index) => (
          <EquipmentCard
            key={weapon.item.name + index}
            name={weapon.item.name}
            details={`${weapon.item.category} - ${weapon.item.subtype}`}
            cost={formatWeaponCost(weapon.item.cost)}
            onAdd={() => addWeapon(weapon.item)}
            includes={renderIncludedItems(weapon.item)}
          />
        )),
      [equipmentTypeEnum.Armour]: (items) =>
        (items as ArmourListSearchItemList).map((armour, index) => (
          <EquipmentCard
            key={armour.item.name + index}
            name={armour.item.name}
            details={`${armour.item.category}`}
            cost={formatArmourCost(armour.item.cost)}
            onAdd={() => addArmour(armour.item)}
            includes={renderIncludedItems(armour.item)}
          />
        )),
      [equipmentTypeEnum.Gear]: (items) =>
        (items as GearListSearchItemList).map((gear, index) => (
          <EquipmentCard
            key={gear.item.name + index}
            name={gear.item.name}
            details={`${gear.item.category}`}
            cost={formatGearCost(gear.item.cost)}
            onAdd={() => addGear(gear.item)}
            includes={renderIncludedItems(gear.item)}
          />
        )),
      [equipmentTypeEnum.Vehicle]: (items) =>
        (items as VehicleListSearchItemList).map((vehicle, index) => (
          <EquipmentCard
            key={vehicle.item.name + index}
            name={vehicle.item.name}
            details={`${vehicle.item.category} - ${vehicle.item.subtype}`}
            cost={formatVehicleCost(vehicle.item.cost)}
            onAdd={() => addVehicle(vehicle.item)}
            includes={renderIncludedItems(vehicle.item)}
          />
        )),
      [equipmentTypeEnum.Augmentation]: (items) =>
        (items as AugmentationListSearchItemList).map((aug, index) => (
          <EquipmentCard
            key={aug.item.name + index}
            name={aug.item.name}
            details={`${aug.item.category} - ${aug.item.subtype}`}
            cost={formatAugmentationCost(aug.item.cost)}
            onAdd={() => addAugmentation(aug.item)}
            includes={renderIncludedItems(aug.item)}
          />
        )),
      [equipmentTypeEnum.EquipmentPack]: (items) =>
        (items as EquipmentPackListSearchItemList).map((pack, index) => (
          <EquipmentCard
            key={pack.item.name + index}
            name={pack.item.name}
            details=""
            cost={`${pack.item.nuyen}¥`}
            onAdd={() => addEquipmentPack(pack.item)}
            addButtonTitle={
              configContext
                ? `Add to ${
                    configContext.path[configContext.path.length - 1].name
                  }`
                : undefined
            }
          />
        )),
      [equipmentTypeEnum.WeaponAccessory]: (items) =>
        (items as WeaponAccessoryListSearchItemList).map((acc, index) => (
          <EquipmentCard
            key={acc.item.name + index}
            name={acc.item.name}
            details={`Max Rating: ${acc.item.maxRating}`}
            cost={formatGearCost(acc.item.cost)}
            onAdd={() => addWeaponAccessory(acc.item)}
            includes={renderIncludedItems(acc.item)}
            addButtonTitle={
              configContext
                ? `Add to ${
                    configContext.path[configContext.path.length - 1].name
                  }`
                : undefined
            }
          />
        )),
      [equipmentTypeEnum.ArmourMod]: (items) =>
        (items as ArmourModListSearchItemList).map((mod, index) => (
          <EquipmentCard
            key={mod.item.name + index}
            name={mod.item.name}
            details={`${mod.item.category}`}
            cost={formatGearCost(mod.item.cost)}
            onAdd={() => addArmourMod(mod.item)}
            includes={renderIncludedItems(mod.item)}
            addButtonTitle={
              configContext
                ? `Add to ${
                    configContext.path[configContext.path.length - 1].name
                  }`
                : undefined
            }
          />
        )),
      [equipmentTypeEnum.VehicleMod]: (items) =>
        (items as VehicleModListSearchItemList).map((mod, index) => (
          <EquipmentCard
            key={mod.item.name + index}
            name={mod.item.name}
            details={`${mod.item.category}`}
            cost={formatVehicleModCost(mod.item.cost)}
            onAdd={() => addVehicleMod(mod.item)}
            includes={renderIncludedItems(mod.item)}
            addButtonTitle={
              configContext
                ? `Add to ${
                    configContext.path[configContext.path.length - 1].name
                  }`
                : undefined
            }
          />
        )),
      [equipmentTypeEnum.WeaponMountMod]: (items) =>
        (items as WeaponMountModListSearchItemList).map((mod, index) => (
          <EquipmentCard
            key={mod.item.name + index}
            name={mod.item.name}
            details={`${mod.item.category}`}
            cost={formatVehicleModCost(mod.item.cost)}
            onAdd={() => addWeaponMountMod(mod.item)}
            includes={renderIncludedItems(mod.item)}
            addButtonTitle={
              configContext
                ? `Add to ${
                    configContext.path[configContext.path.length - 1].name
                  }`
                : undefined
            }
          />
        )),
    };

    const renderer = renderers[props.selectedEquipmentDetails.category];
    if (renderer) {
      return renderer(items);
    }

    return <div>Select a category to browse equipment</div>;
  };

  // Get subtype options for current category
  const currentSubtypeOptions =
    subtypeOptions[props.selectedEquipmentDetails.category];

  return (
    <div>
      <div className={styles.headerActions}>
        {configContext && (
          <div className={styles.configBanner}>
            <div>
              <span className={styles.configHeader}>CONFIGURING:</span>{" "}
              {configContext.path.map((p, i) => (
                <span key={i}>
                  {i > 0 && " > "}
                  {p.name}
                </span>
              ))}
            </div>
            <ArwesButton onClick={finishConfiguration} palette="secondary">
              Finish
            </ArwesButton>
          </div>
        )}
      </div>

      {/* Category and Filter Controls */}
      <div className={styles.filtersContainer}>
        <div className={styles.filtersRow}>
          {configTabs ? (
            <div className={styles.configSubtypeList}>
              {configTabs.map((tab) => (
                <ArwesButton
                  key={tab}
                  onClick={() => {
                    props.setSelectedEquipmentDetails({
                      category: tab,
                    } as SearchResultEquipmentType);
                  }}
                  palette={
                    props.selectedEquipmentDetails.category === tab
                      ? "primary"
                      : "secondary"
                  }
                  className={
                    props.selectedEquipmentDetails.category === tab
                      ? ""
                      : styles.tabInactive
                  }
                >
                  {categoryDisplayNames[tab] || tab}
                </ArwesButton>
              ))}
            </div>
          ) : (
            <div>
              <label className={styles.fieldLabel}>Category:</label>
              <ArwesSelect
                value={props.selectedEquipmentDetails.category}
                onChange={(event) => {
                  const option = { value: event.target.value };
                  props.setSelectedEquipmentDetails({
                    category: option.value,
                  } as SearchResultEquipmentType);
                }}
              >
                {Object.entries(categoryDisplayNames).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </ArwesSelect>
            </div>
          )}

          {currentSubtypeOptions.length > 0 && (
            <div>
              <label className={styles.fieldLabel}>Subtype:</label>
              <ArwesSelect
                value={
                  props.selectedEquipmentDetails.subtype != undefined
                    ? props.selectedEquipmentDetails.subtype
                    : ""
                }
                onChange={(event) => {
                  const option = { value: event.target.value };
                  if (option.value === "All" || option.value === "") {
                    props.setSelectedEquipmentDetails({
                      category: props.selectedEquipmentDetails.category,
                    } as SearchResultEquipmentType);
                  } else {
                    props.setSelectedEquipmentDetails({
                      category: props.selectedEquipmentDetails.category,
                      subtype: option.value,
                    } as SearchResultEquipmentType);
                  }
                }}
              >
                <option value="">All</option>
                {currentSubtypeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </ArwesSelect>
            </div>
          )}

          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>Search:</label>
            <input
              type="text"
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Paginated Equipment List */}
      <div className={styles.resultsList}>
        <div className={styles.resultsHeader}>
          <span>
            Showing {props.paginatedData.items.length ?? 0} of {totalItems}{" "}
            items
          </span>
        </div>

        {renderPaginatedItems()}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <h2>Gear Selected</h2>
      <h3>
        Nuyen Remaining: <span>{props.localNuyen}</span>
      </h3>
      <div>
        <h3>Equipment Packs</h3>
        <div>
          {props.localEquipment.equipmentPackList.map(
            (equipmentPack, index) => {
              const removeItem = function () {
                props.setLocalEquipment((prev) => {
                  if (prev.equipmentPackList[index] === equipmentPack) {
                    const newList = [...prev.equipmentPackList];
                    newList.splice(index, 1);
                    return { ...prev, equipmentPackList: newList };
                  }
                  console.error("No Pack at index: " + index);
                  return prev;
                });
                props.setLocalNuyen((prev) => prev + equipmentPack.nuyen);
              };
              const breakItem = function () {
                // TODO: not removing cost currently, fix this
                breakEquipmentPack(equipmentPack);
                removeItem();
              };

              return (
                <FormattedEquipmentPackDiv
                  key={equipmentPack.name + index}
                  equipment={equipmentPack}
                  removeEquipmentPack={removeItem}
                  breakEquipmentPack={breakItem}
                />
              );
            }
          )}
        </div>
        <h3>Augmentations</h3>
        <div>
          {props.localEquipment.augmentationList.map((augmentation, index) => {
            const isConfiguring =
              configContext?.path[0]?.category ===
                equipmentTypeEnum.Augmentation &&
              configContext?.path[0]?.index === index;
            const removeItem = function () {
              removeAugmentation(augmentation, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={augmentation.baseAugmentation.name}
                removeItem={removeItem}
                key={augmentation.baseAugmentation.name + index}
                className={isConfiguring ? styles.configuring : ""}
              >
                <div className={styles.headerActions}>
                  <ArwesButton
                    onClick={() =>
                      startConfiguration(
                        [
                          {
                            category: equipmentTypeEnum.Augmentation,
                            index,
                            name: augmentation.baseAugmentation.name,
                          },
                        ],
                        equipmentTypeEnum.Gear
                      )
                    }
                    palette="secondary"
                    className={styles.actionButton}
                  >
                    Configure Gear
                  </ArwesButton>
                </div>
                {renderBuiltInItems(
                  augmentation.baseAugmentation.includedGearList,
                  "Gear",
                  "baseGear"
                )}
                <GearSubList
                  gearList={augmentation.gearList ?? []}
                  onRemove={(gearIdx) =>
                    removeGearFromAugmentation(index, gearIdx)
                  }
                />
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Armours</h3>
        <div>
          {props.localEquipment.armourList.map((armour, index) => {
            const isConfiguring =
              configContext?.path[0]?.category === equipmentTypeEnum.Armour &&
              configContext?.path[0]?.index === index;
            const removeItem = function () {
              removeArmour(armour, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={armour.baseArmour.name}
                removeItem={removeItem}
                key={armour.baseArmour.name + index}
                className={isConfiguring ? styles.configuring : ""}
              >
                <div className={styles.headerActions}>
                  <ArwesButton
                    onClick={() =>
                      startConfiguration(
                        [
                          {
                            category: equipmentTypeEnum.Armour,
                            index,
                            name: armour.baseArmour.name,
                          },
                        ],
                        equipmentTypeEnum.ArmourMod
                      )
                    }
                    palette="secondary"
                    className={styles.actionButton}
                  >
                    Configure Mods/Gear
                  </ArwesButton>
                </div>
                {renderBuiltInItems(
                  armour.baseArmour.includedModList,
                  "Modifications",
                  "baseMod"
                )}
                {renderBuiltInItems(
                  armour.baseArmour.includedGearList,
                  "Gear",
                  "baseGear"
                )}
                <ModSubList
                  modList={armour.modList ?? []}
                  onRemove={(modIdx) => removeArmourMod(index, modIdx)}
                  renderModContent={(mod, modIdx) => (
                    <>
                      {renderBuiltInItems(
                        mod.baseMod.includedGearList,
                        "Gear",
                        "baseGear"
                      )}
                      <GearSubList
                        gearList={mod.gearList ?? []}
                        onRemove={(gearIdx) =>
                          removeGearFromArmourMod(index, modIdx, gearIdx)
                        }
                      />
                    </>
                  )}
                />
                <GearSubList
                  gearList={armour.gearList ?? []}
                  onRemove={(gearIdx) => removeGearFromArmour(index, gearIdx)}
                />
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Gear</h3>
        <div>
          {props.localEquipment.gearList.map((gear, index) => {
            const isConfiguring =
              configContext?.path[0]?.category === equipmentTypeEnum.Gear &&
              configContext?.path[0]?.index === index;
            const removeItem = function () {
              removeGear(gear, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={gear.baseGear.name}
                removeItem={removeItem}
                key={gear.baseGear.name + index}
                className={isConfiguring ? styles.configuring : ""}
              >
                <div className={styles.headerActions}>
                  <ArwesButton
                    onClick={() =>
                      startConfiguration(
                        [
                          {
                            category: equipmentTypeEnum.Gear,
                            index,
                            name: gear.baseGear.name,
                          },
                        ],
                        equipmentTypeEnum.Gear
                      )
                    }
                    palette="secondary"
                    className={styles.actionButton}
                  >
                    Configure Inner Gear
                  </ArwesButton>
                </div>
                {renderBuiltInItems(
                  gear.baseGear.includedGearList,
                  "Inner Gear",
                  "baseGear"
                )}
                <GearSubList
                  gearList={gear.innerGearList ?? []}
                  header="Inner Gear"
                  onRemove={(innerIdx) => removeGearFromGear(index, innerIdx)}
                />
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Vehicles</h3>
        <div>
          {props.localEquipment.vehicleList.map((vehicle, index) => {
            const isConfiguring =
              configContext?.path[0]?.category === equipmentTypeEnum.Vehicle &&
              configContext?.path[0]?.index === index;
            const removeItem = function () {
              removeVehicle(vehicle, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={vehicle.baseVehicle.name}
                removeItem={removeItem}
                key={vehicle.baseVehicle.name + index}
                className={isConfiguring ? styles.configuring : ""}
              >
                <div className={styles.headerActions}>
                  <ArwesButton
                    onClick={() =>
                      startConfiguration(
                        [
                          {
                            category: equipmentTypeEnum.Vehicle,
                            index,
                            name: vehicle.baseVehicle.name,
                          },
                        ],
                        equipmentTypeEnum.VehicleMod
                      )
                    }
                    palette="secondary"
                    className={styles.actionButton}
                  >
                    Configure Mods/Gear/Mounts
                  </ArwesButton>
                </div>
                {renderBuiltInItems(
                  vehicle.baseVehicle.includedModList,
                  "Modifications",
                  "baseMod"
                )}
                {renderBuiltInItems(
                  vehicle.baseVehicle.includedGearList,
                  "Gear",
                  "baseGear"
                )}
                {renderBuiltInWeaponMounts(
                  vehicle.baseVehicle.includedWeaponMountList
                )}
                <ModSubList
                  modList={vehicle.modList ?? []}
                  onRemove={(modIdx) => removeVehicleMod(index, modIdx)}
                />
                <GearSubList
                  gearList={vehicle.gearList ?? []}
                  onRemove={(gearIdx) => removeGearFromVehicle(index, gearIdx)}
                />
                {vehicle.weaponMountList !== undefined &&
                  vehicle.weaponMountList.length > 0 && (
                    <div className={styles.subListContainer}>
                      <span className={styles.subListHeader}>
                        Weapon Mounts:
                      </span>
                      <ul className={styles.subList}>
                        {vehicle.weaponMountList.map((mount, mountIdx) => {
                          const isConfiguringMount =
                            configContext?.path[0]?.category ===
                              equipmentTypeEnum.Vehicle &&
                            configContext?.path[0]?.index === index &&
                            configContext?.path[1]?.category ===
                              "WeaponMount" &&
                            configContext?.path[1]?.index === mountIdx;
                          return (
                            <li
                              key={mount.size + mount.flexibility + mountIdx}
                              className={`${styles.weaponMountItem} ${
                                isConfiguringMount
                                  ? styles.weaponMountConfiguring
                                  : ""
                              }`}
                            >
                              <div className={styles.flexRow}>
                                <span className={styles.smallText}>
                                  {mount.size} {mount.flexibility} Mount
                                </span>
                                <ArwesButton
                                  onClick={() =>
                                    startConfiguration(
                                      [
                                        {
                                          category: equipmentTypeEnum.Vehicle,
                                          index,
                                          name: vehicle.baseVehicle.name,
                                        },
                                        {
                                          category: "WeaponMount",
                                          index: mountIdx,
                                          name: `${mount.size} ${mount.flexibility} Mount`,
                                        },
                                      ],
                                      equipmentTypeEnum.Weapon
                                    )
                                  }
                                  palette="secondary"
                                  className={styles.xsText}
                                >
                                  Configure Mount
                                </ArwesButton>
                              </div>
                              {mount.weaponMountModList !== undefined &&
                                mount.weaponMountModList.length > 0 && (
                                  <div className={styles.subListContainer}>
                                    <ul className={styles.subList}>
                                      {mount.weaponMountModList.map(
                                        (modName) => (
                                          <li
                                            key={modName}
                                            className={styles.subListItem}
                                          >
                                            <span>{modName}</span>
                                            <ArwesButton
                                              onClick={() =>
                                                removeWeaponMountMod(
                                                  index,
                                                  mountIdx,
                                                  modName
                                                )
                                              }
                                              palette="error"
                                              className={styles.removeButton}
                                            >
                                              X
                                            </ArwesButton>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {mount.weaponMounted && (
                                <div
                                  className={`${styles.subListItem} ${styles.builtIn}`}
                                >
                                  <span className={styles.smallText}>
                                    Weapon:{" "}
                                    {mount.weaponMounted.baseWeapon.name}
                                  </span>
                                  <ArwesButton
                                    onClick={() =>
                                      removeWeaponFromMount(index, mountIdx)
                                    }
                                    palette="error"
                                    className={styles.removeButton}
                                  >
                                    X
                                  </ArwesButton>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Weapons</h3>
        <div>
          {props.localEquipment.weaponList.map((weapon, index) => {
            const isConfiguring =
              configContext?.path[0]?.category === equipmentTypeEnum.Weapon &&
              configContext?.path[0]?.index === index;
            const removeItem = function () {
              removeWeapon(weapon, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={weapon.baseWeapon.name}
                removeItem={removeItem}
                key={weapon.baseWeapon.name + index}
                className={isConfiguring ? styles.configuring : ""}
              >
                <div className={styles.headerActions}>
                  <ArwesButton
                    onClick={() =>
                      startConfiguration(
                        [
                          {
                            category: equipmentTypeEnum.Weapon,
                            index,
                            name: weapon.baseWeapon.name,
                          },
                        ],
                        equipmentTypeEnum.WeaponAccessory
                      )
                    }
                    palette="secondary"
                    className={styles.actionButton}
                  >
                    Configure Accessories
                  </ArwesButton>
                </div>
                {renderBuiltInItems(
                  weapon.baseWeapon.includedAccessoryList,
                  "Accessories",
                  "baseAccessory"
                )}
                {weapon.accessoryList !== undefined &&
                  weapon.accessoryList.length > 0 && (
                    <div className={styles.subListContainer}>
                      <span className={styles.subListHeader}>Accessories:</span>
                      <ul className={styles.subList}>
                        {weapon.accessoryList.map((accessory, accIdx) => {
                          return (
                            <li key={accessory.baseAccessory.name + accIdx}>
                              <div className={styles.flexRow}>
                                <span className={styles.smallText}>
                                  {accessory.baseAccessory.name}
                                </span>
                                <div className={styles.buttonGroup}>
                                  <ArwesButton
                                    onClick={() =>
                                      startConfiguration(
                                        [
                                          {
                                            category: equipmentTypeEnum.Weapon,
                                            index,
                                            name: weapon.baseWeapon.name,
                                          },
                                          {
                                            category:
                                              equipmentTypeEnum.WeaponAccessory,
                                            index: accIdx,
                                            name: accessory.baseAccessory.name,
                                          },
                                        ],
                                        equipmentTypeEnum.Gear
                                      )
                                    }
                                    palette="secondary"
                                    className={styles.removeButton}
                                  >
                                    Configure
                                  </ArwesButton>
                                  <ArwesButton
                                    onClick={() =>
                                      removeWeaponAccessory(index, accIdx)
                                    }
                                    palette="error"
                                    className={styles.removeButton}
                                  >
                                    Remove
                                  </ArwesButton>
                                </div>
                              </div>
                              {renderBuiltInItems(
                                accessory.baseAccessory.includedGearList,
                                "Gear",
                                "baseGear"
                              )}
                              <GearSubList
                                gearList={accessory.gearList ?? []}
                                header=""
                                onRemove={(gearIdx) =>
                                  removeGearFromAccessory(
                                    index,
                                    accIdx,
                                    gearIdx
                                  )
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface IFormattedEquipmentPackDivProps {
  equipment: EquipmentPackType;
  addEquipmentPack?: (equipmentPack: EquipmentPackType) => void;
  removeEquipmentPack?: () => void;
  breakEquipmentPack?: () => void;
}
const FormattedEquipmentPackDiv = function ({
  equipment,
  addEquipmentPack,
  removeEquipmentPack,
  breakEquipmentPack,
}: IFormattedEquipmentPackDivProps) {
  const addItem =
    addEquipmentPack !== undefined
      ? function () {
          addEquipmentPack(equipment);
        }
      : undefined;
  return (
    <CollapsibleEquipmentDiv
      key={equipment.name}
      title={equipment.name}
      addItem={addItem}
      removeItem={removeEquipmentPack}
    >
      {breakEquipmentPack !== undefined && (
        <ArwesButton
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            breakEquipmentPack();
          }}
        >
          Break Pack
        </ArwesButton>
      )}
      {equipment.augmentationList.length > 0 && (
        <CollapsibleDiv title="Augmentations">
          <ul>
            {equipment.augmentationList.map((augmentation) => (
              <li key={augmentation.baseAugmentation}>
                {augmentation.baseAugmentation}
              </li>
            ))}
          </ul>
        </CollapsibleDiv>
      )}
      {equipment.armourList.length > 0 && (
        <CollapsibleDiv title="Armour">
          <ul>
            {equipment.armourList.map((armour) => (
              <li key={armour.baseArmour}>{armour.baseArmour}</li>
            ))}
          </ul>
        </CollapsibleDiv>
      )}
      {equipment.gearList.length > 0 && (
        <CollapsibleDiv title="Gear">
          <ul>
            {equipment.gearList.map((gear) => (
              <li key={gear.baseGear}>{gear.baseGear}</li>
            ))}
          </ul>
        </CollapsibleDiv>
      )}
      {equipment.vehicleList.length > 0 && (
        <CollapsibleDiv title="Vehicles">
          <ul>
            {equipment.vehicleList.map((vehicle) => (
              <li key={vehicle.baseVehicle}>{vehicle.baseVehicle}</li>
            ))}
          </ul>
        </CollapsibleDiv>
      )}
      {equipment.weaponList.length > 0 && (
        <CollapsibleDiv title="Weapons">
          <ul>
            {equipment.weaponList.map((weapon) => (
              <li key={weapon.baseWeapon}>{weapon.baseWeapon}</li>
            ))}
          </ul>
        </CollapsibleDiv>
      )}
    </CollapsibleEquipmentDiv>
  );
};
