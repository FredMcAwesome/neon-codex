import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";
import { CollapsibleEquipmentDiv } from "./EquipmentHelper.js";
import { costCalculation } from "../../../utils/calculations.js";
import { Pagination } from "../../shared/Pagination.js";
import Dropdown from "react-dropdown";
import type {
  CostWeaponType,
  CustomisedWeaponLoadedType,
  WeaponType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import { formatWeaponCost } from "@neon-codex/common/build/formatters/weaponFormatter.js";
import { formatArmourCost } from "@neon-codex/common/build/formatters/armourFormatter.js";
import { formatGearCost } from "@neon-codex/common/build/formatters/gearFormatter.js";
import { formatVehicleCost } from "@neon-codex/common/build/formatters/vehicleFormatter.js";
import { formatAugmentationCost } from "@neon-codex/common/build/formatters/augmentationFormatter.js";

import {
  armourCategoryEnum,
  augmentationGradeEnum,
  augmentationCategoryEnum,
  equipmentTypeEnum,
  gearCategoryEnum,
  vehicleCategoryEnum,
  weaponCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  SelectedEquipmentListType,
  SelectedEquipmentLoadedListType,
} from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type {
  CostGearType,
  CustomisedGearLoadedType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  AugmentationType,
  CustomisedAugmentationLoadedType,
  CostAugmentationType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  CustomisedVehicleLoadedType,
  VehicleType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import type {
  ArmourType,
  CustomisedArmourLoadedType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type { EquipmentPackType } from "@neon-codex/common/build/schemas/equipment/equipmentPackSchemas.js";
import type { CustomisedArmourModLoadedType } from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import type { CustomisedWeaponAccessoryLoadedType } from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import type {
  CostVehicleModType,
  CustomisedVehicleModLoadedType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import {
  hydrateEquipmentList,
  dehydrateEquipmentList,
} from "../../../utils/equipmentHydration.js";
import {
  useEquipmentSearch,
  getWorker,
} from "../../../hooks/useEquipmentSearch.js";
import type {
  ArmourListSearchItemList,
  AugmentationListSearchItemList,
  EquipmentPackListSearchItemList,
  GearListSearchItemList,
  SearchResultEquipmentType,
  SearchResultItemType,
  VehicleListSearchItemList,
  WeaponListSearchItemList,
} from "../../../workers/types.js";

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

const subtypeOptions: Record<equipmentTypeEnum, string[]> = {
  Weapon: Object.values(weaponCategoryEnum),
  Armour: Object.values(armourCategoryEnum),
  Gear: Object.values(gearCategoryEnum),
  Vehicle: Object.values(vehicleCategoryEnum),
  Augmentation: Object.values(augmentationCategoryEnum),
  EquipmentPack: [],
  WeaponAccessory: [],
  ArmourMod: [],
  VehicleMod: [],
  WeaponMountMod: [],
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
    if (worker) {
      hydrateEquipmentList(props.equipmentSelections, worker).then(
        setLocalEquipment
      );
    }
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
}

const EquipmentSelectLoaded = function (props: ILoadedProps) {
  // Memoized add/remove functions to prevent unnecessary re-renders
  const addWeapon = useCallback(function (weapon: WeaponType) {
    const newWeapon: CustomisedWeaponLoadedType = {
      baseWeapon: weapon,
    };
    props.setLocalEquipment((prev) => ({
      ...prev,
      weaponList: [...prev.weaponList, newWeapon],
    }));
    const cost = calculateWeaponCostHelper(newWeapon);
    props.setLocalNuyen((prev) => prev - cost);
  }, []);

  const removeWeapon = useCallback(function (
    weapon: CustomisedWeaponLoadedType,
    index: number
  ) {
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
  []);

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

  const removeArmour = useCallback(function (
    armour: CustomisedArmourLoadedType,
    index: number
  ) {
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
  []);

  // Gear methods
  const addGear = useCallback(function (gear: GearType) {
    const newGear: CustomisedGearLoadedType = {
      baseGear: gear,
    };
    props.setLocalEquipment((prev) => ({
      ...prev,
      gearList: [...prev.gearList, newGear],
    }));
    const cost = calculateGearCostHelper(newGear);
    props.setLocalNuyen((prev) => prev - cost);
  }, []);

  const removeGear = useCallback(function (
    gear: CustomisedGearLoadedType,
    index: number
  ) {
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
  []);

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

  const removeVehicle = useCallback(function (
    vehicle: CustomisedVehicleLoadedType,
    index: number
  ) {
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
  []);

  // Equipment pack methods
  const addEquipmentPack = useCallback(function (
    equipmentPack: EquipmentPackType
  ) {
    props.setLocalEquipment((prev) => ({
      ...prev,
      equipmentPackList: [...prev.equipmentPackList, equipmentPack],
    }));
    props.setLocalNuyen((prev) => prev - equipmentPack.nuyen);
  },
  []);

  const breakEquipmentPack = useCallback(function (
    _equipmentPack: EquipmentPackType
  ) {
    // Break the pack into individual items
    // TODO: Actually implement the pack breaking logic
    // based on the contents of the equipment pack
    props.setLocalEquipment((prev) => {
      // For now, just return unchanged until pack breaking is implemented
      return prev;
    });
  },
  []);

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
      return <div style={{ padding: "16px" }}>No items found.</div>;
    }

    // We need this check as sometimes we rerender before paginatedData is ready
    if (items[0].category !== props.selectedEquipmentDetails.category) {
      return (
        <div style={{ padding: "16px" }}>
          No items found for selected category.
        </div>
      );
    }

    switch (props.selectedEquipmentDetails.category) {
      case equipmentTypeEnum.Weapon:
        return (items as WeaponListSearchItemList).map((weapon, index) => (
          <div
            key={weapon.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{weapon.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  {weapon.item.category} - {weapon.item.subtype} | Cost:{" "}
                  {formatWeaponCost(weapon.item.cost)}
                </div>
              </div>
              <button
                onClick={() => {
                  addWeapon(weapon.item);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ));

      case equipmentTypeEnum.Armour:
        return (items as ArmourListSearchItemList).map((armour, index) => (
          <div
            key={armour.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{armour.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  {armour.item.category} | Cost:{" "}
                  {formatArmourCost(armour.item.cost)}
                </div>
              </div>
              <button
                onClick={() => {
                  addArmour(armour.item);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ));

      case equipmentTypeEnum.Gear:
        return (items as GearListSearchItemList).map((gear, index) => (
          <div
            key={gear.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{gear.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  {gear.item.category} | Cost: {formatGearCost(gear.item.cost)}
                </div>
              </div>
              <button
                onClick={() => {
                  addGear(gear.item);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ));

      case equipmentTypeEnum.Vehicle:
        return (items as VehicleListSearchItemList).map((vehicle, index) => (
          <div
            key={vehicle.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{vehicle.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  {vehicle.item.category} - {vehicle.item.subtype} | Cost:{" "}
                  {formatVehicleCost(vehicle.item.cost)}
                </div>
              </div>
              <button
                onClick={() => {
                  addVehicle(vehicle.item);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ));

      case equipmentTypeEnum.Augmentation:
        return (items as AugmentationListSearchItemList).map((aug, index) => (
          <div
            key={aug.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{aug.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  {aug.item.category} - {aug.item.subtype} | Cost:{" "}
                  {formatAugmentationCost(aug.item.cost)}
                </div>
              </div>
              <button
                onClick={() => {
                  addAugmentation(aug.item);
                }}
              >
                Add
              </button>
            </div>
          </div>
        ));

      case equipmentTypeEnum.EquipmentPack:
        return (items as EquipmentPackListSearchItemList).map((pack, index) => (
          <div
            key={pack.item.name + index}
            style={{ padding: "8px", borderBottom: "1px solid #333" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{pack.item.name}</strong>
                <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                  Cost: {pack.item.nuyen}¥
                </div>
              </div>
              <button onClick={() => addEquipmentPack(pack.item)}>Add</button>
            </div>
          </div>
        ));

      default:
        return <div>Select a category to browse equipment</div>;
    }
  };

  // Get subtype options for current category
  const currentSubtypeOptions =
    subtypeOptions[props.selectedEquipmentDetails.category];

  return (
    <div>
      <div>
        <h1>Equipment Selection</h1>

        {/* Category and Filter Controls */}
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#1a1a2e",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Category:
              </label>
              <Dropdown
                options={Object.entries(categoryDisplayNames).map(
                  ([value, label]) => ({ value, label })
                )}
                value={{
                  value: props.selectedEquipmentDetails.category,
                  label:
                    categoryDisplayNames[
                      props.selectedEquipmentDetails.category
                    ],
                }}
                onChange={(option) =>
                  props.setSelectedEquipmentDetails({
                    category: option.value,
                  } as SearchResultEquipmentType)
                }
              />
            </div>

            {currentSubtypeOptions.length > 0 && (
              <div>
                <label style={{ display: "block", marginBottom: "4px" }}>
                  Subtype:
                </label>
                <Dropdown
                  options={[
                    { value: "", label: "All" },
                    ...currentSubtypeOptions.map((s) => ({
                      value: s,
                      label: s,
                    })),
                  ]}
                  value={{
                    value:
                      props.selectedEquipmentDetails.subtype != undefined
                        ? props.selectedEquipmentDetails.subtype
                        : "",
                    label:
                      props.selectedEquipmentDetails.subtype != undefined
                        ? props.selectedEquipmentDetails.subtype
                        : "All",
                  }}
                  onChange={(option) => {
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
                />
              </div>
            )}

            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Search:
              </label>
              <input
                type="text"
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  backgroundColor: "#2a2a4e",
                  color: "white",
                }}
              />
            </div>
          </div>
        </div>

        {/* Paginated Equipment List */}
        <div
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: "8px",
            padding: "8px",
            minHeight: "400px",
            position: "relative",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              color: "#888",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
            const removeItem = function () {
              removeAugmentation(augmentation, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={augmentation.baseAugmentation.name}
                removeItem={removeItem}
                key={augmentation.baseAugmentation.name + index}
              >
                <div>{augmentation.baseAugmentation.name}</div>
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Armours</h3>
        <div>
          {props.localEquipment.armourList.map((armour, index) => {
            const removeItem = function () {
              removeArmour(armour, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={armour.baseArmour.name}
                removeItem={removeItem}
                key={armour.baseArmour.name + index}
              >
                {/* <div>{armour.baseArmour.description}</div> */}
                {armour.modList !== undefined && armour.modList.length > 0 && (
                  <div>
                    <span>Modifications:</span>
                    <ul>
                      {armour.modList.map((mod) => {
                        return (
                          <li
                            key={
                              // TODO: This is different that other addons... standarise this
                              armour.baseArmour.name + mod.baseMod.name
                            }
                          >
                            {mod.baseMod.name}
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
        <h3>Gear</h3>
        <div>
          {props.localEquipment.gearList.map((gear, index) => {
            const removeItem = function () {
              removeGear(gear, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={gear.baseGear.name}
                removeItem={removeItem}
                key={gear.baseGear.name + index}
              >
                <div></div>
                {/* <div>{gear.baseGear.description}</div> */}
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Vehicles</h3>
        <div>
          {props.localEquipment.vehicleList.map((vehicle, index) => {
            const removeItem = function () {
              removeVehicle(vehicle, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={vehicle.baseVehicle.name}
                removeItem={removeItem}
                key={vehicle.baseVehicle.name + index}
              >
                {/* <div>{vehicle.baseVehicle.description}</div> */}
                {vehicle.modList !== undefined &&
                  vehicle.modList.length > 0 && (
                    <div>
                      <span>Modifications:</span>
                      <ul>
                        {vehicle.modList.map((mod) => {
                          return (
                            <li
                              key={vehicle.baseVehicle.name + mod.baseMod.name}
                            >
                              {mod.baseMod.name}
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
            const removeItem = function () {
              removeWeapon(weapon, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={weapon.baseWeapon.name}
                removeItem={removeItem}
                key={weapon.baseWeapon.name + index}
              >
                {/* <div>{weapon.baseWeapon.description}</div> */}
                {weapon.accessoryList !== undefined &&
                  weapon.accessoryList.length > 0 && (
                    <div>
                      <span>Accessories:</span>
                      <ul>
                        {weapon.accessoryList.map((accessory) => {
                          return (
                            <li
                              key={
                                weapon.baseWeapon.name +
                                accessory.baseAccessory.name
                              }
                            >
                              {accessory.baseAccessory.name}
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
        <button
          onClick={(event) => {
            event.stopPropagation();
            breakEquipmentPack();
          }}
        >
          Break Pack
        </button>
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
