import MiniSearch from "minisearch";
import { get, set } from "idb-keyval";
import {
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

let miniSearch: MiniSearch | undefined = undefined;
let equipmentData: EquipmentListType | undefined = undefined;
const itemsMap = new Map<string, SearchResultItemType>();

// Phase 1: shared init promise dedupes StrictMode double-mount / concurrent SEARCH+INIT.
// Phase 2: precomputed name-sorted ID windows for empty-query fast path.
let initPromise: Promise<void> | null = null;
let allSortedIds: string[] = [];
const sortedIdsByCategory = new Map<string, string[]>();

const DB_KEY = "equipment-data";
const DEFAULT_LIMIT = 20;

self.onmessage = async (event: MessageEvent<WorkerRequestType>) => {
  let message: WorkerResponseType;
  const eventType = event.data.type;

  try {
    if (eventType === workerRequestEnum.INIT) {
      // Phase 1: split boot from index — READY acks worker spawn immediately
      // (cheap compile), data load continues in background via shared promise.
      // SEARCH callers await initialize() themselves, so double-INIT under
      // StrictMode is harmless and deduped.
      console.log("[equipment-worker] INIT received, boot ack");
      postMessage({ type: workerResponseEnum.READY });
      // Background warm; errors surface via ERROR so UI can show them.
      initialize().catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Init failed";
        console.log(`[equipment-worker] background initialize failed: ${msg}`);
        postMessage({ type: workerResponseEnum.ERROR, error: msg });
      });
    } else if (eventType === workerRequestEnum.SEARCH) {
      await initialize();
      const {
        query,
        filters,
        context,
        filterMode,
        offset: rawOffset,
        limit: rawLimit,
        requestId,
      } = event.data;
      const offset = Math.max(0, rawOffset ?? 0);
      const limit = Math.max(1, Math.min(100, rawLimit ?? DEFAULT_LIMIT));

      // Phase 2: candidate IDs sorted alphabetically, filtered by query/category.
      // Empty-query fast path serves windows from precomputed per-category
      // name-sorted ID arrays without Array.from(all).map().
      let candidateIds: string[];
      const isEmptyQuery = !query || query.trim() === "";
      if (isEmptyQuery) {
        if (filters?.category !== undefined) {
          candidateIds =
            sortedIdsByCategory.get(filters.category)?.slice() ?? [];
        } else {
          candidateIds = allSortedIds.slice();
        }
        if (filters?.subtype !== undefined) {
          const subtype = filters.subtype;
          candidateIds = candidateIds.filter(
            (id) => itemsMap.get(id)?.subtype === subtype
          );
        }
      } else {
        if (!miniSearch) throw new Error("Search index not ready");
        const searchResults = miniSearch.search(query);
        const matchedIds: string[] = [];
        for (const result of searchResults) {
          if (typeof result.id !== "string") {
            throw new Error("Invalid search result ID");
          }
          const item = itemsMap.get(result.id);
          if (item === undefined) {
            throw new Error(`Item not found for ID: ${result.id}`);
          }
          if (
            filters?.category !== undefined &&
            item.category !== filters.category
          ) {
            continue;
          }
          if (
            filters?.subtype !== undefined &&
            item.subtype !== filters.subtype
          ) {
            continue;
          }
          matchedIds.push(result.id);
        }
        // Sort alphabetically by name for stable picker order.
        matchedIds.sort((a, b) => {
          const nameA = itemsMap.get(a)?.item.name ?? "";
          const nameB = itemsMap.get(b)?.item.name ?? "";
          return nameA.localeCompare(nameB);
        });
        candidateIds = matchedIds;
      }

      const scoreOne = (base: SearchResultItemType): SearchResultItemType => {
        const requirements =
          "requirements" in base.item ? base.item.requirements : undefined;
        const forbidden =
          "forbidden" in base.item ? base.item.forbidden : undefined;
        const compatibility = evaluateItemCompatibility(
          requirements,
          forbidden,
          context
        );
        return { ...base, compatibility };
      };

      let page: SearchResultItemType[];
      let total: number;

      if (
        filterMode === requirementFilterModeEnum.CompatibleOnly ||
        filterMode === requirementFilterModeEnum.IncompatibleOnly
      ) {
        // Scan candidates in chunks to count matching items and collect the page
        const wantCompatible =
          filterMode === requirementFilterModeEnum.CompatibleOnly;
        const roundSize = Math.max(limit * 3, 60);
        page = [];
        let compatibleTotal = 0;
        for (let start = 0; start < candidateIds.length; start += roundSize) {
          const end = Math.min(start + roundSize, candidateIds.length);
          for (let i = start; i < end; i++) {
            const base = itemsMap.get(candidateIds[i]);
            if (!base) continue;
            const scored = scoreOne(base);
            const isCompat = scored.compatibility?.isCompatible ?? true;
            const want = wantCompatible ? isCompat : !isCompat;
            if (want) {
              if (compatibleTotal >= offset && page.length < limit) {
                page.push(scored);
              }
              compatibleTotal++;
            }
          }
        }
        total = compatibleTotal;
      } else {
        // Fast path: slice pre-sorted candidates and score only the current page
        total = candidateIds.length;
        const windowIds = candidateIds.slice(offset, offset + limit);
        page = windowIds.map((id) => {
          const base = itemsMap.get(id);
          if (!base) throw new Error(`Item not found for ID: ${id}`);
          return scoreOne(base);
        });
      }

      message = {
        type: workerResponseEnum.SEARCH_RESULTS,
        results: page,
        total,
        offset,
        ...(requestId !== undefined && { requestId }),
      };
      postMessage(message);
    } else if (eventType === workerRequestEnum.GET_DETAILS) {
      await initialize();
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
      await initialize();
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
  if (equipmentData !== undefined && miniSearch !== undefined) return;
  if (initPromise) {
    await initPromise;
    return;
  }
  initPromise = doInit();
  try {
    await initPromise;
  } catch (err) {
    // Reset on failure so one failure doesn't stall all future SEARCHs.
    initPromise = null;
    throw err;
  }
}

async function doInit() {
  itemsMap.clear();
  allSortedIds = [];
  sortedIdsByCategory.clear();

  const cached = await get<EquipmentListType>(DB_KEY);
  if (cached !== undefined && cached.version === EQUIPMENT_DATA_VERSION) {
    equipmentData = cached;
  }
  if (equipmentData === undefined) {
    // Network fetch validated against schema at generation time
    const response = await fetch("/equipment-data.json");
    if (!response.ok) throw new Error("Failed to fetch equipment data");
    const data = (await response.json()) as EquipmentListType;
    if (data.version !== EQUIPMENT_DATA_VERSION) {
      throw new Error(
        `Stale equipment data: got version ${JSON.stringify(data.version)}, expected ${EQUIPMENT_DATA_VERSION}`
      );
    }
    equipmentData = data;
    await set(DB_KEY, equipmentData);
  }

  // Index (fresh instance per init so re-init can't double-add)
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
      const subtype = "category" in item ? String(item.category) : "";
      const baseId = `${category}-${subtype}-${item.name}`;
      let id = baseId;
      let n = 2;
      while (itemsMap.has(id)) id = `${baseId}--${n++}`;
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

  if (equipmentData !== undefined) {
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

  // Precompute per-category name-sorted ID arrays for empty-query fast path.
  allSortedIds = [...itemsMap.keys()].sort((a, b) => {
    const nameA = itemsMap.get(a)?.item.name ?? "";
    const nameB = itemsMap.get(b)?.item.name ?? "";
    return nameA.localeCompare(nameB);
  });
  for (const id of allSortedIds) {
    const cat = itemsMap.get(id)?.category;
    if (cat === undefined) continue;
    const list = sortedIdsByCategory.get(cat);
    if (list) list.push(id);
    else sortedIdsByCategory.set(cat, [id]);
  }
}
