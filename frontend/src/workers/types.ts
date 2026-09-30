import {
  equipmentTypeEnum,
  type EquipmentListType,
  type armourCategoryEnum,
  type armourModCategoryEnum,
  type augmentationCategoryEnum,
  type equipmentPackCategoryEnum,
  type gearCategoryEnum,
  type vehicleCategoryEnum,
  type vehicleModCategoryEnum,
  type weaponCategoryEnum,
  type RequirementEvaluationContextType,
  type RequirementCompatibilityType,
  type RequirementFilterModeType,
} from "@neon-codex/common";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type EquipmentCategoryMap = {
  [equipmentTypeEnum.Weapon]: weaponCategoryEnum;
  [equipmentTypeEnum.Armour]: armourCategoryEnum;
  [equipmentTypeEnum.ArmourMod]: armourModCategoryEnum;
  [equipmentTypeEnum.Gear]: gearCategoryEnum;
  [equipmentTypeEnum.Augmentation]: augmentationCategoryEnum;
  [equipmentTypeEnum.Vehicle]: vehicleCategoryEnum;
  [equipmentTypeEnum.VehicleMod]: vehicleModCategoryEnum;
  [equipmentTypeEnum.EquipmentPack]: equipmentPackCategoryEnum;
};

type SearchResultWeaponListType = {
  category: equipmentTypeEnum.Weapon;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.Weapon];
};

type SearchResultWeaponAccessoryListType = {
  category: equipmentTypeEnum.WeaponAccessory;
  // subtype?: EquipmentCategoryMap[equipmentTypeEnum.WeaponAccessory];
  subtype: undefined;
};

type SearchResultArmourListType = {
  category: equipmentTypeEnum.Armour;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.Armour];
};

type SearchResultArmourModListType = {
  category: equipmentTypeEnum.ArmourMod;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.ArmourMod];
};

type SearchResultGearListType = {
  category: equipmentTypeEnum.Gear;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.Gear];
};

type SearchResultAugmentationListType = {
  category: equipmentTypeEnum.Augmentation;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.Augmentation];
};

type SearchResultVehicleListType = {
  category: equipmentTypeEnum.Vehicle;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.Vehicle];
};

type SearchResultVehicleModListType = {
  category: equipmentTypeEnum.VehicleMod;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.VehicleMod];
};

type SearchResultWeaponMountModListType = {
  category: equipmentTypeEnum.WeaponMountMod;
  subtype: undefined;
};

type SearchResultEquipmentPackListType = {
  category: equipmentTypeEnum.EquipmentPack;
  subtype?: EquipmentCategoryMap[equipmentTypeEnum.EquipmentPack];
};
export type SearchResultEquipmentType =
  | SearchResultWeaponListType
  | SearchResultWeaponAccessoryListType
  | SearchResultArmourListType
  | SearchResultArmourModListType
  | SearchResultGearListType
  | SearchResultAugmentationListType
  | SearchResultVehicleListType
  | SearchResultVehicleModListType
  | SearchResultWeaponMountModListType
  | SearchResultEquipmentPackListType;

export type SearchResultItemType = (
  | ({
      item: ArrayElement<EquipmentListType["weaponList"]>;
    } & SearchResultWeaponListType)
  | ({
      item: ArrayElement<EquipmentListType["weaponAccessoryList"]>;
    } & SearchResultWeaponAccessoryListType)
  | ({
      item: ArrayElement<EquipmentListType["armourList"]>;
    } & SearchResultArmourListType)
  | ({
      item: ArrayElement<EquipmentListType["armourModificationList"]>;
    } & SearchResultArmourModListType)
  | ({
      item: ArrayElement<EquipmentListType["gearList"]>;
    } & SearchResultGearListType)
  | ({
      item: ArrayElement<EquipmentListType["augmentationList"]>;
    } & SearchResultAugmentationListType)
  | ({
      item: ArrayElement<EquipmentListType["vehicleList"]>;
    } & SearchResultVehicleListType)
  | ({
      item: ArrayElement<EquipmentListType["vehicleModificationList"]>;
    } & SearchResultVehicleModListType)
  | ({
      item: ArrayElement<EquipmentListType["weaponMountModificationList"]>;
    } & SearchResultWeaponMountModListType)
  | ({
      item: ArrayElement<EquipmentListType["equipmentPackList"]>;
    } & SearchResultEquipmentPackListType)
) & {
  compatibility?: RequirementCompatibilityType;
};

export type WeaponListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["weaponList"]>;
  } & SearchResultWeaponListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type WeaponAccessoryListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["weaponAccessoryList"]>;
  } & SearchResultWeaponAccessoryListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type ArmourListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["armourList"]>;
  } & SearchResultArmourListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type ArmourModListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["armourModificationList"]>;
  } & SearchResultArmourModListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type GearListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["gearList"]>;
  } & SearchResultGearListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type AugmentationListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["augmentationList"]>;
  } & SearchResultAugmentationListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type VehicleListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["vehicleList"]>;
  } & SearchResultVehicleListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type VehicleModListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["vehicleModificationList"]>;
  } & SearchResultVehicleModListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type WeaponMountModListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["weaponMountModificationList"]>;
  } & SearchResultWeaponMountModListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;
export type EquipmentPackListSearchItemList = Array<
  {
    item: ArrayElement<EquipmentListType["equipmentPackList"]>;
  } & SearchResultEquipmentPackListType & {
      compatibility?: RequirementCompatibilityType;
    }
>;

export enum workerRequestEnum {
  INIT = "INIT",
  SEARCH = "SEARCH",
  GET_DETAILS = "GET_DETAILS",
  GET_ALL = "GET_ALL",
}

export enum workerResponseEnum {
  READY = "READY",
  SEARCH_RESULTS = "SEARCH_RESULTS",
  ALL_DATA = "ALL_DATA",
  DETAILS = "DETAILS",
  ERROR = "ERROR",
}

export type WorkerRequestType =
  | { type: workerRequestEnum.INIT }
  | {
      type: workerRequestEnum.SEARCH;
      query: string;
      filters?: SearchResultEquipmentType;
      context?: RequirementEvaluationContextType;
      filterMode?: RequirementFilterModeType;
    }
  | {
      type: workerRequestEnum.GET_DETAILS;
      requests: { [key: string]: string[] };
      requestId?: string;
    }
  | { type: workerRequestEnum.GET_ALL };

export type WorkerResponseType =
  | { type: workerResponseEnum.READY }
  | { type: workerResponseEnum.SEARCH_RESULTS; results: SearchResultItemType[] }
  | { type: workerResponseEnum.ALL_DATA; data: EquipmentListType }
  | {
      type: workerResponseEnum.DETAILS;
      data: EquipmentListType;
      requestId?: string;
    }
  | { type: workerResponseEnum.ERROR; error: string };
