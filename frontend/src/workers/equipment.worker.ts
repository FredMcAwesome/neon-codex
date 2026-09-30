import MiniSearch from "minisearch";
import { get, set } from "idb-keyval";
import {
  EquipmentListSchema,
  EQUIPMENT_DATA_VERSION,
  equipmentTypeEnum,
  type ArmourModType,
  type ArmourType,
  type AugmentationType,
  type EquipmentListType,
  type EquipmentPackType,
  type GearType,
  type VehicleModType,
  type VehicleType,
  type WeaponAccessoryType,
  type WeaponMountModType,
  type WeaponType,
  evaluateItemCompatibility,
  requirementFilterModeEnum,
} from "@neon-codex/common";
import {
  workerRequestEnum,
  workerResponseEnum,
  type SearchResultEquipmentType,
  type SearchResultItemType,
  type WorkerRequestType,
  type WorkerResponseType,
} from "./types";
import { type } from "arktype";

let miniSearch: MiniSearch;
let equipmentData: EquipmentListType | undefined = undefined;
const itemsMap = new Map<string, SearchResultItemType>();

const DB_KEY = "equipment-data";

self.onmessage = async (event: MessageEvent<WorkerRequestType>) => {
  let message: WorkerResponseType;
  const eventType = event.data.type;

  try {
    if (eventType === workerRequestEnum.INIT) {
      await initialize();
      postMessage({ type: workerResponseEnum.READY });
    } else if (eventType === workerRequestEnum.SEARCH) {
      await initialize();
      const { query, filters, context, filterMode } = event.data;

      let results: SearchResultItemType[] = [];
      if (!query || query.trim() === "") {
        results = Array.from(itemsMap.values());
      } else {
        const searchResults = miniSearch.search(query);
        results = searchResults.map((result) => {
          if (typeof result.id !== "string") {
            throw new Error("Invalid search result ID");
          }
          const item = itemsMap.get(result.id);
          if (item === undefined) {
            throw new Error(`Item not found for ID: ${result.id}`);
          }
          return item;
        });
      }

      if (filters !== undefined) {
        if (filters.category !== undefined) {
          results = results.filter(
            (item) => item.category === filters.category
          );
        }
        if (filters.subtype !== undefined) {
          results = results.filter((item) => item.subtype === filters.subtype);
        }
      }

      results = results.map((item) => {
        const requirements =
          "requirements" in item.item ? item.item.requirements : undefined;
        const forbidden =
          "forbidden" in item.item ? item.item.forbidden : undefined;
        const compatibility = evaluateItemCompatibility(
          requirements,
          forbidden,
          context
        );
        return {
          ...item,
          compatibility,
        };
      });

      // Filter by requirement compatibility
      if (filterMode === requirementFilterModeEnum.CompatibleOnly) {
        results = results.filter(
          (item) => item.compatibility?.isCompatible ?? true
        );
      } else if (filterMode === requirementFilterModeEnum.IncompatibleOnly) {
        results = results.filter(
          (item) => !(item.compatibility?.isCompatible ?? true)
        );
      }

      // Sort results alphabetically by item name
      results.sort((a, b) => a.item.name.localeCompare(b.item.name));

      message = { type: workerResponseEnum.SEARCH_RESULTS, results };
      postMessage(message);
    } else if (eventType === workerRequestEnum.GET_DETAILS) {
      if (!equipmentData) await initialize();
      const { requests, requestId } = event.data;

      const result: EquipmentListType = {
        weaponList: [],
        weaponAccessoryList: [],
        armourList: [],
        armourModificationList: [],
        gearList: [],
        augmentationList: [],
        vehicleList: [],
        vehicleModificationList: [],
        weaponMountModificationList: [],
        equipmentPackList: [],
      };

      const findItems = <T extends { name: string }>(
        list: T[] | undefined,
        names: string[]
      ): T[] => {
        if (!list) return [];
        return list.filter((item) => names.includes(item.name));
      };

      if (requests.weaponNames.length > 0)
        result.weaponList = findItems(
          equipmentData?.weaponList,
          requests.weaponNames
        );
      if (requests.weaponAccessoryNames.length > 0)
        result.weaponAccessoryList = findItems(
          equipmentData?.weaponAccessoryList,
          requests.weaponAccessoryNames
        );
      if (requests.armourNames.length > 0)
        result.armourList = findItems(
          equipmentData?.armourList,
          requests.armourNames
        );
      if (requests.armourModNames.length > 0)
        result.armourModificationList = findItems(
          equipmentData?.armourModificationList,
          requests.armourModNames
        );
      if (requests.gearNames.length > 0)
        result.gearList = findItems(
          equipmentData?.gearList,
          requests.gearNames
        );
      if (requests.augmentationNames.length > 0)
        result.augmentationList = findItems(
          equipmentData?.augmentationList,
          requests.augmentationNames
        );
      if (requests.vehicleNames.length > 0)
        result.vehicleList = findItems(
          equipmentData?.vehicleList,
          requests.vehicleNames
        );
      if (requests.vehicleModNames.length > 0)
        result.vehicleModificationList = findItems(
          equipmentData?.vehicleModificationList,
          requests.vehicleModNames
        );
      if (requests.weaponMountModNames.length > 0)
        result.weaponMountModificationList = findItems(
          equipmentData?.weaponMountModificationList,
          requests.weaponMountModNames
        );
      if (requests.equipmentPackNames.length > 0)
        result.equipmentPackList = findItems(
          equipmentData?.equipmentPackList,
          requests.equipmentPackNames
        );

      message = {
        type: workerResponseEnum.DETAILS,
        data: result,
        ...(requestId !== undefined && { requestId }),
      };
      postMessage(message);
    } else if (eventType === workerRequestEnum.GET_ALL) {
      if (!equipmentData) await initialize();
      // Return raw data structure? Or flattened?
      // The UI might expect the structured EquipmentListType for initial render?
      // But we want to move away from that.
      // For now, let's return the raw data so the UI can populate its initial state if needed.
      message = { type: workerResponseEnum.ALL_DATA, data: equipmentData! };
      postMessage(message);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      message = { type: workerResponseEnum.ERROR, error: error.message };
      postMessage(message);
    } else {
      message = {
        type: workerResponseEnum.ERROR,
        error: "An unknown error occurred",
      };
      postMessage(message);
    }
  }
};

async function initialize() {
  if (equipmentData !== undefined) return;

  const cached = await get<EquipmentListType>(DB_KEY);
  if (cached !== undefined && cached.version === EQUIPMENT_DATA_VERSION) {
    equipmentData = cached;
  }
  if (equipmentData === undefined) {
    // Fetch from network
    const response = await fetch("/equipment-data.json");
    if (!response.ok) throw new Error("Failed to fetch equipment data");
    const parsedEquipment = EquipmentListSchema(await response.json());
    if (parsedEquipment instanceof type.errors) {
      console.error(parsedEquipment.summary);
    } else {
      equipmentData = parsedEquipment;
      await set(DB_KEY, equipmentData);
    }
  }

  // Index
  miniSearch = new MiniSearch({
    fields: ["name", "description", "category", "subtype", "type"],
    storeFields: ["id", "category", "name"],
    searchOptions: {
      boost: { name: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  // Type mapping from equipmentTypeEnum to  types
  type EquipmentMap = {
    [equipmentTypeEnum.Weapon]: WeaponType;
    [equipmentTypeEnum.WeaponAccessory]: WeaponAccessoryType;
    [equipmentTypeEnum.Armour]: ArmourType;
    [equipmentTypeEnum.ArmourMod]: ArmourModType;
    [equipmentTypeEnum.Gear]: GearType;
    [equipmentTypeEnum.Augmentation]: AugmentationType;
    [equipmentTypeEnum.Vehicle]: VehicleType;
    [equipmentTypeEnum.VehicleMod]: VehicleModType;
    [equipmentTypeEnum.WeaponMountMod]: WeaponMountModType;
    [equipmentTypeEnum.EquipmentPack]: EquipmentPackType;
  };
  type ProcessListArgs = {
    [K in keyof EquipmentMap]: { list: Array<EquipmentMap[K]>; category: K };
  }[keyof EquipmentMap];

  type DocumentType = {
    id: string;
    name: string;
    description: string;
  } & SearchResultEquipmentType;

  const documents: DocumentType[] = [];

  // Generic processList that enforces the list/category relationship
  const processList = ({ list, category }: ProcessListArgs) => {
    return list.forEach((item) => {
      const id = `${category}-${item.name}`;
      const searchItem = {
        item: item,
        category: category,
        ...("category" in item && { subtype: item.category }),
      } as SearchResultItemType;
      itemsMap.set(id, searchItem);
      documents.push({
        id,
        name: item.name,
        description: item.description || "",
        category,
        ...("category" in item && { subtype: item.category }),
      } as DocumentType);
    });
  };

  if (equipmentData) {
    processList({
      list: equipmentData.weaponList,
      category: equipmentTypeEnum.Weapon,
    });
    processList({
      list: equipmentData.weaponAccessoryList,
      category: equipmentTypeEnum.WeaponAccessory,
    });
    processList({
      list: equipmentData.armourList,
      category: equipmentTypeEnum.Armour,
    });
    processList({
      list: equipmentData.armourModificationList,
      category: equipmentTypeEnum.ArmourMod,
    });
    processList({
      list: equipmentData.gearList,
      category: equipmentTypeEnum.Gear,
    });
    processList({
      list: equipmentData.augmentationList,
      category: equipmentTypeEnum.Augmentation,
    });
    processList({
      list: equipmentData.vehicleList,
      category: equipmentTypeEnum.Vehicle,
    });
    processList({
      list: equipmentData.vehicleModificationList,
      category: equipmentTypeEnum.VehicleMod,
    });
    processList({
      list: equipmentData.weaponMountModificationList,
      category: equipmentTypeEnum.WeaponMountMod,
    });
    processList({
      list: equipmentData.equipmentPackList,
      category: equipmentTypeEnum.EquipmentPack,
    });
  }

  miniSearch.addAll(documents);
}
