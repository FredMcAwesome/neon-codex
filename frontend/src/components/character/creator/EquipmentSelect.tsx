import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";
import { CollapsibleEquipmentDiv } from "./EquipmentHelper.js";
import { costCalculation } from "../../../utils/calculations.js";
import Dropdown from "react-dropdown";
import type {
  CostWeaponType,
  CustomisedWeaponType,
  WeaponListType,
  WeaponType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import {
  formatAccuracy,
  formatAmmunition,
  formatArmourPenetration,
  formatWeaponAvailability,
  formatDamage,
  formatWeaponCost,
} from "@neon-codex/common/build/formatters/weaponFormatter.js";
import {
  formatArmourAvailability,
  formatArmourCost,
  formatArmourDamageReduction,
} from "@neon-codex/common/build/formatters/armourFormatter.js";
import {
  formatGearAvailability,
  formatGearCost,
} from "@neon-codex/common/build/formatters/gearFormatter.js";
import {
  formatOnOffRoad,
  formatVehicleAvailability,
  formatVehicleCost,
  formatVehicleModSlotCount,
  formatVehicleSeats,
  formatWeaponMountSlotCost,
} from "@neon-codex/common/build/formatters/vehicleFormatter.js";
import {
  formatEssenceCost,
  formatAugmentationCapacity,
  formatAugmentationCost,
  formatAugmentationAvailability,
} from "@neon-codex/common/build/formatters/augmentationFormatter.js";
import { trpc } from "../../../utils/trpc.js";
import {
  armourCategoryEnum,
  augmentationGradeEnum,
  augmentationTypeEnum,
  gearCategoryEnum,
  vehicleTypeEnum,
  weaponAccessoryMountLocationEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
  weaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  EquipmentListType,
  SelectedEquipmentListType,
} from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type {
  CostGearType,
  CustomisedGearListType,
  CustomisedGearType,
  GearListType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  AugmentationType,
  AugmentationListType,
  CustomisedAugmentationType,
  CostAugmentationType,
  AugmentationSubsystemListType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  CustomisedVehicleType,
  VehicleListType,
  VehicleType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import type {
  ArmourListType,
  ArmourType,
  CustomisedArmourType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import { Fragment, useState } from "react";
import type { CharacterCreatorBonusListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type { EquipmentPackType } from "@neon-codex/common/build/schemas/equipment/equipmentPackSchemas.js";
import type {
  ArmourModListType,
  ArmourModType,
  CustomisedArmourModListType,
  CustomisedArmourModType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import type {
  CustomisedWeaponAccessoryType,
  WeaponAccessoryListType,
  WeaponAccessoryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import type {
  CostVehicleModType,
  CustomisedVehicleModType,
  VehicleModListType,
  VehicleModType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import type { WeaponMountModType } from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountModSchemas.js";
import type { CustomisedWeaponMountType } from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountSchemas.js";

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

export const EquipmentSelect = function (props: IProps) {
  const { data, error, isError, isLoading } = trpc.character.all.useQuery();
  console.log("EquipmentSelect re-rendered");
  if (isLoading) {
    return <div>Loading equipment...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }
  return (
    <EquipmentSelectLoaded
      equipmentSelections={props.equipmentSelections}
      setEquipmentSelections={props.setEquipmentSelections}
      nuyen={props.nuyen}
      setNuyen={props.setNuyen}
      essencePoints={props.essencePoints}
      setEssencePoints={props.setEssencePoints}
      bonusInfo={props.bonusInfo}
      setBonusInfo={props.setBonusInfo}
      data={data}
    />
  );
};

const EquipmentSelectLoaded = function (
  props: IProps & { data: EquipmentListType }
) {
  const equipmentSelections = props.equipmentSelections;

  const addWeapon = function (weapon: CustomisedWeaponType) {
    const equipment = { ...equipmentSelections };
    equipment.weaponList.push(weapon);

    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - calculateWeaponCost(weapon));
  };
  const removeWeapon = function (weapon: CustomisedWeaponType, index: number) {
    const equipment = { ...equipmentSelections };
    if (equipment.weaponList[index] === weapon) {
      equipment.weaponList.splice(index, 1);
      props.setEquipmentSelections(equipment);
      props.setNuyen(props.nuyen + calculateWeaponCost(weapon));
    } else {
      console.error("No weapon at index: " + index);
    }
  };
  const calculateWeaponCost = function (weapon: CustomisedWeaponType): number {
    const baseWeapon = findBaseWeapon(weapon.baseWeapon, props.data.weaponList);
    const accessoryList =
      weapon.accessoryList !== undefined ? weapon.accessoryList : [];
    const baseWeaponAccessoryList = accessoryList.map((accessory) => {
      return calculateWeaponAccessoryCost(accessory);
    });

    return (
      costCalculation<CostWeaponType>(baseWeapon.cost, {}) +
      baseWeaponAccessoryList.reduce((total: number, accessory) => {
        return total + accessory;
      }, 0)
    );
  };
  const calculateWeaponAccessoryCost = function (
    accessory: CustomisedWeaponAccessoryType
  ) {
    const baseAccessory = findBaseWeaponAccessory(
      accessory.baseAccessory,
      props.data.weaponAccessoryList
    );
    const gearList = accessory.gearList.map((gear) => {
      return calculateGearCost(gear);
    });
    return (
      costCalculation<CostWeaponType>(baseAccessory.cost, {}) +
      gearList.reduce((total: number, gear) => {
        return total + gear;
      }, 0)
    );
  };

  const addArmour = function (armour: CustomisedArmourType) {
    const equipment = { ...equipmentSelections };
    equipment.armourList.push(armour);
    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - calculateArmourCost(armour));
  };
  const removeArmour = function (armour: CustomisedArmourType, index: number) {
    const equipment = { ...equipmentSelections };
    if (equipment.armourList[index] === armour) {
      equipment.armourList.splice(index, 1);
      props.setEquipmentSelections(equipment);
      props.setNuyen(props.nuyen + calculateArmourCost(armour));
    } else {
      console.error("No armour at index: " + index);
    }
  };
  const calculateArmourCost = function (armour: CustomisedArmourType): number {
    const baseArmour = findBaseArmour(armour.baseArmour, props.data.armourList);
    const modList = armour.modList !== undefined ? armour.modList : [];
    const baseArmourModList = modList.map((mod) => {
      return calculateArmourModCost(mod);
    });
    return (
      costCalculation<CostGearType>(baseArmour.cost, {}) +
      baseArmourModList.reduce((total: number, mod) => {
        return total + mod;
      }, 0)
    );
  };
  const calculateArmourModCost = function (
    mod: CustomisedArmourModType
  ): number {
    const baseArmourMod = findBaseArmourMod(
      mod.baseMod,
      props.data.armourModificationList
    );
    const gearList =
      mod.gearList !== undefined
        ? mod.gearList.map((gear) => {
            return calculateGearCost(gear);
          })
        : [];
    return (
      costCalculation<CostGearType>(baseArmourMod.cost, {}) +
      gearList.reduce((total: number, gear) => {
        return total + gear;
      }, 0)
    );
  };

  const addGear = function (gear: CustomisedGearType) {
    const equipment = Object.assign({}, equipmentSelections);
    equipment.gearList.push(gear);
    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - calculateGearCost(gear));
  };
  const removeGear = function (gear: CustomisedGearType, index: number) {
    const equipment = Object.assign({}, equipmentSelections);
    if (equipment.gearList[index] === gear) {
      equipment.gearList.splice(index, 1);
      props.setEquipmentSelections(equipment);
      props.setNuyen(props.nuyen + calculateGearCost(gear));
    } else {
      console.error("No gear at index: " + index);
    }
  };
  const calculateGearCost = function (gear: CustomisedGearType): number {
    const baseGear = findBaseGear(gear.baseGear, props.data.gearList);
    const gearList = gear.innerGearList !== undefined ? gear.innerGearList : [];
    const childGearList = gearList.map((childGear) => {
      return calculateGearCost(childGear);
    });

    return (
      costCalculation<CostGearType>(baseGear.cost, {}) +
      childGearList.reduce((total: number, gear) => {
        return total + gear;
      }, 0)
    );
  };

  const addAugmentation = function (augmentation: CustomisedAugmentationType) {
    const equipment = Object.assign({}, equipmentSelections);
    equipment.augmentationList.push(augmentation);
    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - calculateAugmentationCost(augmentation));
  };
  const removeAugmentation = function (
    augmentation: CustomisedAugmentationType,
    index: number
  ) {
    const equipment = Object.assign({}, equipmentSelections);
    if (equipment.augmentationList[index] === augmentation) {
      equipment.augmentationList.splice(index, 1);
      props.setEquipmentSelections(equipment);
      props.setNuyen(props.nuyen + calculateAugmentationCost(augmentation));
    } else {
      console.error("No augmentation at index: " + index);
    }
  };
  const calculateAugmentationCost = function (
    augmentation: CustomisedAugmentationType
  ): number {
    const baseAugmentation = findBaseAugmentation(
      augmentation.baseAugmentation,
      props.data.augmentationList
    );
    const gearList =
      augmentation.gearList !== undefined ? augmentation.gearList : [];
    const childGearList = gearList.map((gear) => {
      return calculateGearCost(gear);
    });
    return (
      costCalculation<CostAugmentationType>(baseAugmentation.cost, {}) +
      childGearList.reduce((total: number, gear) => {
        return total + gear;
      }, 0)
    );
  };

  const addVehicle = function (vehicle: CustomisedVehicleType) {
    const equipment = Object.assign({}, equipmentSelections);
    equipment.vehicleList.push(vehicle);
    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - calculateVehicleCost(vehicle));
  };
  const removeVehicle = function (
    vehicle: CustomisedVehicleType,
    index: number
  ) {
    const equipment = Object.assign({}, equipmentSelections);
    if (equipment.vehicleList[index] === vehicle) {
      equipment.vehicleList.splice(index, 1);
      props.setEquipmentSelections(equipment);
      props.setNuyen(props.nuyen + calculateVehicleCost(vehicle));
    } else {
      console.error("No vehicle/drone at index: " + index);
    }
  };
  const calculateVehicleCost = function (
    vehicle: CustomisedVehicleType
  ): number {
    const baseVehicle = findBaseVehicle(
      vehicle.baseVehicle,
      props.data.vehicleList
    );
    const modList = vehicle.modList !== undefined ? vehicle.modList : [];
    const baseVehicleModList = modList.map((mod) => {
      return calculateVehicleModCost(mod);
    });
    return (
      costCalculation<CostGearType>(baseVehicle.cost, {}) +
      baseVehicleModList.reduce((total: number, mod) => {
        return total + mod;
      }, 0)
    );
  };
  const calculateVehicleModCost = function (
    mod: CustomisedVehicleModType
  ): number {
    const baseVehicleMod = findBaseVehicleMod(
      mod.baseMod,
      props.data.vehicleModificationList
    );
    return costCalculation<CostVehicleModType>(baseVehicleMod.cost, {});
  };

  const addEquipmentPack = function (equipmentPack: EquipmentPackType) {
    const equipment = Object.assign({}, equipmentSelections);
    equipment.equipmentPackList.push(equipmentPack);
    props.setEquipmentSelections(equipment);
    props.setNuyen(props.nuyen - equipmentPack.nuyen);
  };

  const breakEquipmentPack = function (equipmentPack: EquipmentPackType) {
    for (const vehicle of equipmentPack.vehicleList) {
      addVehicle(vehicle);
    }
    for (const weapon of equipmentPack.weaponList) {
      addWeapon(weapon);
    }
    for (const armour of equipmentPack.armourList) {
      addArmour(armour);
    }
    for (const gear of equipmentPack.gearList) {
      addGear(gear);
    }
    for (const augmentation of equipmentPack.augmentationList) {
      addAugmentation(augmentation);
    }
  };

  // const removeEquipmentPack = function (
  //   equipmentPack: VehicleType,
  //   index: number
  // ) {
  //   const equipment = Object.assign({}, equipmentSelections);
  //   if (equipment.vehicleList[index].baseVehicle === equipmentPack) {
  //     equipment.vehicleList.splice(index, 1);
  //     props.setEquipmentSelections(equipment);
  //     props.setNuyen(props.nuyen + costCalculation(equipmentPack.cost, {}));
  //   } else {
  //     console.error("No vehicle/drone at index: " + index);
  //   }
  // };

  return (
    <div>
      <div>
        <h1>Equipment Selection</h1>
        <CollapsibleDiv title="Equipment Pack">
          <div id="Equipment_Pack_Div">
            <EquipmentPackDiv
              data={props.data}
              addEquipmentPack={addEquipmentPack}
            />
          </div>
        </CollapsibleDiv>
        <CollapsibleDiv title="Augmentations">
          <div id="Augmentations_Div">
            {Object.values(augmentationTypeEnum).map((value, index) => {
              return (
                <AugmentationsDiv
                  title={value}
                  data={props.data}
                  augmentationType={value}
                  addAugmentations={addAugmentation}
                  key={index}
                />
              );
            })}
          </div>
        </CollapsibleDiv>
        <CollapsibleDiv title="Armour">
          <div id="Armour_Div">
            {Object.values(armourCategoryEnum).map((value, index) => {
              return (
                <ArmourDiv
                  title={value}
                  data={props.data}
                  armourType={value}
                  addArmour={addArmour}
                  key={index}
                />
              );
            })}
          </div>
        </CollapsibleDiv>
        <CollapsibleDiv title="Gear">
          <div id="Gear_Div">
            {Object.values(gearCategoryEnum).map((value, index) => {
              return (
                <GearDiv
                  title={value}
                  data={props.data}
                  gearCategory={value}
                  addGear={addGear}
                  key={index}
                />
              );
            })}
          </div>
        </CollapsibleDiv>
        <CollapsibleDiv title="Vehicles and Drones">
          <div id="Vehicles">
            {Object.values(vehicleTypeEnum).map((value, index) => {
              return (
                <VehiclesDiv
                  title={value}
                  data={props.data}
                  vehicleType={value}
                  addVehicles={addVehicle}
                  key={index}
                />
              );
            })}
          </div>
        </CollapsibleDiv>
        <CollapsibleDiv title="Weapons">
          <div id="Weapons_Div">
            {Object.values(weaponTypeEnum).map((value, index) => {
              return (
                <WeaponDiv
                  title={value}
                  data={props.data}
                  weaponType={value}
                  addWeapon={addWeapon}
                  key={index}
                />
              );
            })}
          </div>
        </CollapsibleDiv>
      </div>
      <h2>Gear Selected</h2>
      <h3>
        Nuyen Remaining: <span>{props.nuyen}</span>
      </h3>
      <div>
        <h3>Equipment Packs</h3>
        <div>
          {equipmentSelections.equipmentPackList.map((equipmentPack, index) => {
            const removeItem = function () {
              const equipment = Object.assign({}, equipmentSelections);
              if (equipment.equipmentPackList[index] === equipmentPack) {
                equipment.equipmentPackList.splice(index, 1);
                props.setEquipmentSelections(equipment);
                props.setNuyen(props.nuyen + equipmentPack.nuyen);
              } else {
                console.error("No Pack at index: " + index);
              }
            };
            const breakItem = function () {
              // TODO: not removing cost currently, fix this
              breakEquipmentPack(equipmentPack);
              removeItem();
            };

            return (
              <FormattedEquipmentPackDiv
                equipment={equipmentPack}
                data={props.data}
                removeEquipmentPack={removeItem}
                breakEquipmentPack={breakItem}
              />
            );
          })}
        </div>
        <h3>Augmentations</h3>
        <div>
          {equipmentSelections.augmentationList.map((augmentation, index) => {
            const removeItem = function () {
              removeAugmentation(augmentation, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={augmentation.baseAugmentation}
                removeItem={removeItem}
                key={augmentation.baseAugmentation + index}
              >
                <div>{augmentation.baseAugmentation}</div>
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Armours</h3>
        <div>
          {equipmentSelections.armourList.map((armour, index) => {
            const removeItem = function () {
              removeArmour(armour, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={armour.baseArmour}
                removeItem={removeItem}
                key={armour.baseArmour + index}
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
                              armour.baseArmour + mod.baseMod
                            }
                          >
                            {mod.baseMod}
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
          {equipmentSelections.gearList.map((gear, index) => {
            const removeItem = function () {
              removeGear(gear, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={gear.baseGear}
                removeItem={removeItem}
                key={gear.baseGear + index}
              >
                <div></div>
                {/* <div>{gear.baseGear.description}</div> */}
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Vehicles</h3>
        <div>
          {equipmentSelections.vehicleList.map((vehicle, index) => {
            const removeItem = function () {
              removeVehicle(vehicle, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={vehicle.baseVehicle}
                removeItem={removeItem}
                key={vehicle.baseVehicle + index}
              >
                {/* <div>{vehicle.baseVehicle.description}</div> */}
                {vehicle.modList !== undefined &&
                  vehicle.modList.length > 0 && (
                    <div>
                      <span>Modifications:</span>
                      <ul>
                        {vehicle.modList.map((mod) => {
                          return (
                            <li key={vehicle.baseVehicle + mod.baseMod}>
                              {mod.baseMod}
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
          {equipmentSelections.weaponList.map((weapon, index) => {
            const removeItem = function () {
              removeWeapon(weapon, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={weapon.baseWeapon}
                removeItem={removeItem}
                key={weapon.baseWeapon + index}
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
                              key={weapon.baseWeapon + accessory.baseAccessory}
                            >
                              {accessory.baseAccessory}
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

function findBaseAugmentation(
  augmentationName: string,
  augmentationList: AugmentationListType
): AugmentationType {
  const baseAugmentation = augmentationList.find((fullAugmentation) => {
    return fullAugmentation.name == augmentationName;
  });
  if (baseAugmentation === undefined) {
    throw new Error(`Base Augmentation not found for ${augmentationName}`);
  }
  return baseAugmentation;
}

function findBaseArmour(
  armourName: string,
  armourList: ArmourListType
): ArmourType {
  const baseArmour = armourList.find((fullArmour) => {
    return fullArmour.name == armourName;
  });
  if (baseArmour === undefined) {
    throw new Error(`Base Armour not found for ${armourName}`);
  }
  return baseArmour;
}

function findBaseArmourMod(
  armourModName: string,
  armourModList: ArmourModListType
): ArmourModType {
  const baseArmourMod = armourModList.find((fullArmourMod) => {
    return fullArmourMod.name == armourModName;
  });
  if (baseArmourMod === undefined) {
    throw new Error(`Base Armour Mod not found for ${armourModName}`);
  }
  return baseArmourMod;
}

function findBaseWeapon(
  weaponName: string,
  weaponList: WeaponListType
): WeaponType {
  const baseWeapon = weaponList.find((fullWeapon) => {
    return fullWeapon.name == weaponName;
  });
  if (baseWeapon === undefined) {
    throw new Error(`Base Weapon not found for ${weaponName}`);
  }
  return baseWeapon;
}

function findBaseWeaponAccessory(
  weaponAccessoryName: string,
  weaponAccessoryList: WeaponAccessoryListType
): WeaponAccessoryType {
  const baseWeaponAccessory = weaponAccessoryList.find(
    (fullWeaponAccessory) => {
      return fullWeaponAccessory.name == weaponAccessoryName;
    }
  );
  if (baseWeaponAccessory === undefined) {
    throw new Error(
      `Base Weapon Accessory not found for ${weaponAccessoryName}`
    );
  }
  return baseWeaponAccessory;
}

function findBaseGear(gearName: string, gearList: GearListType): GearType {
  const baseGear = gearList.find((fullGear) => {
    return fullGear.name == gearName;
  });
  if (baseGear === undefined) {
    throw new Error(`Base Gear not found for ${gearName}`);
  }
  return baseGear;
}

function findBaseVehicle(
  vehicleName: string,
  vehicleList: VehicleListType
): VehicleType {
  const baseVehicle = vehicleList.find((fullVehicle) => {
    return fullVehicle.name == vehicleName;
  });
  if (baseVehicle === undefined) {
    throw new Error(`Base Vehicle not found for ${vehicleName}`);
  }
  return baseVehicle;
}
function findBaseVehicleMod(
  vehicleModName: string,
  vehicleModList: VehicleModListType
): VehicleModType {
  const baseVehicleMod = vehicleModList.find((fullVehicleMod) => {
    return fullVehicleMod.name == vehicleModName;
  });
  if (baseVehicleMod === undefined) {
    throw new Error(`Base Vehicle Mod not found for ${vehicleModName}`);
  }
  return baseVehicleMod;
}

interface IEquipmentPackDivProps {
  data: EquipmentListType;
  addEquipmentPack: (equipmentPack: EquipmentPackType) => void;
}
const EquipmentPackDiv = function ({
  data,
  addEquipmentPack,
}: IEquipmentPackDivProps) {
  return (
    <div>
      {data.equipmentPackList.map((equipment) => {
        return (
          <FormattedEquipmentPackDiv
            data={data}
            equipment={equipment}
            addEquipmentPack={addEquipmentPack}
          />
        );
      })}
    </div>
  );
};

interface IFormattedEquipmentPackDivProps {
  equipment: EquipmentPackType;
  data: EquipmentListType;
  addEquipmentPack?: (equipmentPack: EquipmentPackType) => void;
  removeEquipmentPack?: () => void;
  breakEquipmentPack?: () => void;
}
const FormattedEquipmentPackDiv = function ({
  equipment,
  data,
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
          {equipment.augmentationList.map((augmentation) => {
            return (
              <FormattedPackAugmentationDiv
                data={data}
                augmentation={augmentation}
              />
            );
          })}
        </CollapsibleDiv>
      )}
      {equipment.armourList.length > 0 && (
        <CollapsibleDiv title="Armour">
          {equipment.armourList.map((armour) => {
            return <FormattedPackArmourDiv data={data} armour={armour} />;
          })}
        </CollapsibleDiv>
      )}
      {equipment.gearList.length > 0 && (
        <CollapsibleDiv title="Gear">
          {equipment.gearList.map((gear) => {
            return <FormattedPackGearDiv data={data} gear={gear} />;
          })}
        </CollapsibleDiv>
      )}
      {equipment.vehicleList.length > 0 && (
        <CollapsibleDiv title="Vehicles">
          {equipment.vehicleList.map((vehicle) => {
            return <FormattedPackVehicleDiv data={data} vehicle={vehicle} />;
          })}
        </CollapsibleDiv>
      )}
      {equipment.weaponList.length > 0 && (
        <CollapsibleDiv title="Weapons">
          {equipment.weaponList.map((weapon) => {
            return <FormattedPackWeaponDiv data={data} weapon={weapon} />;
          })}
        </CollapsibleDiv>
      )}
    </CollapsibleEquipmentDiv>
  );
};

const FormattedPackAugmentationDiv = function ({
  data,
  augmentation,
}: {
  data: EquipmentListType;
  augmentation: CustomisedAugmentationType;
}) {
  const baseAugmentation = data.augmentationList.find((fullAugmentation) => {
    return fullAugmentation.name == augmentation.baseAugmentation;
  });
  if (baseAugmentation === undefined) {
    throw new Error(
      `Base Augmentation not found for ${augmentation.baseAugmentation}`
    );
  }

  return (
    <li key={augmentation.baseAugmentation}>
      <FormattedAugmentationDiv
        data={data}
        augmentation={baseAugmentation}
        customisedAugmentation={augmentation}
      />
    </li>
  );
};

const FormattedPackArmourDiv = function ({
  data,
  armour,
}: {
  data: EquipmentListType;
  armour: CustomisedArmourType;
}) {
  const baseArmour = data.armourList.find((fullArmour) => {
    return fullArmour.name == armour.baseArmour;
  });
  if (baseArmour === undefined) {
    throw new Error(`Base Armour not found for ${armour.baseArmour}`);
  }

  return (
    <li key={armour.baseArmour}>
      <FormattedArmourDiv
        data={data}
        armour={baseArmour}
        customisedArmour={armour}
      />
    </li>
  );
};

const FormattedPackGearDiv = function ({
  data,
  gear,
}: {
  data: EquipmentListType;
  gear: CustomisedGearType;
}) {
  const baseGear = data.gearList.find((fullGear) => {
    return fullGear.name == gear.baseGear;
  });
  if (baseGear === undefined) {
    throw new Error(`Base Gear not found for ${gear.baseGear}`);
  }

  return (
    <li key={gear.baseGear}>
      <FormattedGearDiv data={data} gear={baseGear} customisedGear={gear} />
    </li>
  );
};

const FormattedPackVehicleDiv = function ({
  data,
  vehicle,
}: {
  data: EquipmentListType;
  vehicle: CustomisedVehicleType;
}) {
  const baseVehicle = data.vehicleList.find((fullVehicle) => {
    return fullVehicle.name == vehicle.baseVehicle;
  });
  if (baseVehicle === undefined) {
    throw new Error(`Base Vehicle not found for ${vehicle.baseVehicle}`);
  }

  return (
    <li key={vehicle.baseVehicle}>
      <FormattedVehicleDiv
        data={data}
        vehicle={baseVehicle}
        customisedVehicle={vehicle}
      />
    </li>
  );
};

const FormattedPackWeaponDiv = function ({
  data,
  weapon,
}: {
  data: EquipmentListType;
  weapon: CustomisedWeaponType;
}) {
  const baseWeapon = data.weaponList.find((fullWeapon) => {
    return fullWeapon.name == weapon.baseWeapon;
  });
  if (baseWeapon === undefined) {
    throw new Error(`Base Weapon not found for ${weapon.baseWeapon}`);
  }

  return (
    <li key={weapon.baseWeapon}>
      <FormattedWeaponDiv
        data={data}
        weapon={baseWeapon}
        customisedWeapon={weapon}
      />
    </li>
  );
};

interface IWeaponDivProps {
  title: string;
  data: EquipmentListType;
  weaponType: weaponTypeEnum;
  addWeapon: (weapon: CustomisedWeaponType) => void;
}

const WeaponDiv = function ({
  data,
  weaponType,
  title,
  addWeapon,
}: IWeaponDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data.weaponList
          .filter((gear) => gear.type === weaponType)
          .map((weapon) => {
            return (
              <li key={weapon.name}>
                <FormattedWeaponDiv
                  data={data}
                  weapon={weapon}
                  addWeapon={addWeapon}
                />
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IWeaponDescriptionDivProps {
  data: EquipmentListType;
  weapon: WeaponType;
  addWeapon?: (weapon: CustomisedWeaponType) => void;
  customisedWeapon?: CustomisedWeaponType;
}
const FormattedWeaponDiv = function ({
  data,
  weapon,
  addWeapon,
  customisedWeapon,
}: IWeaponDescriptionDivProps) {
  const addItem =
    addWeapon !== undefined
      ? function () {
          addWeapon({
            baseWeapon: weapon.name,
            accessoryList: weapon.includedAccessoryList,
          });
        }
      : undefined;
  return (
    <div>
      <CollapsibleEquipmentDiv title={weapon.name} addItem={addItem}>
        <div>
          <div>{weapon.description}</div>
          <div>Acc: {formatAccuracy(weapon.accuracy)}</div>
          <div>Damage: {formatDamage(weapon.damage)}</div>
          <div>AP: {formatArmourPenetration(weapon.armourPenetration)}</div>
          <FormattedWeaponTypeInformation weapon={weapon} />
          {weapon.ammunition !== undefined && (
            <div>Ammo: {formatAmmunition(weapon.ammunition)}</div>
          )}
          <div>Avail: {formatWeaponAvailability(weapon.availability)}</div>
          <div>Cost: {formatWeaponCost(weapon.cost)}</div>
          {customisedWeapon !== undefined && (
            <div>
              {customisedWeapon.accessoryList !== undefined &&
                customisedWeapon.accessoryList.map((accessory) => {
                  return (
                    <FormattedWeaponAccessoryDiv
                      data={data}
                      accessory={accessory}
                      key={accessory.baseAccessory}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </CollapsibleEquipmentDiv>
      <div>{weapon.subtype}</div>
    </div>
  );
};

const FormattedWeaponTypeInformation = function ({
  weapon: weapon,
}: {
  weapon: WeaponType;
}) {
  switch (weapon.type) {
    case weaponTypeEnum.Melee:
      return <div>Reach: {weapon.meleeOptions.reach}</div>;
    case weaponTypeEnum.Projectile:
      return <Fragment></Fragment>;
    case weaponTypeEnum.Firearm: {
      const recoilCompensation =
        weapon.firearmOptions.recoilCompensation == 0
          ? "-"
          : weapon.firearmOptions.recoilCompensation;
      return (
        <Fragment>
          <div>Mode: {weapon.firearmOptions.mode}</div>
          <div>RC: {recoilCompensation}</div>
        </Fragment>
      );
    }
    case weaponTypeEnum.Explosive:
      return <Fragment></Fragment>;
  }
};

const FormattedWeaponAccessoryDiv = function ({
  data,
  accessory,
}: {
  data: EquipmentListType;
  accessory: CustomisedWeaponAccessoryType;
}) {
  return (
    <div>
      <CollapsibleEquipmentDiv title={accessory.baseAccessory}>
        <div>
          {/* <div>{accessory.baseAccessory.description}</div> */}
          {accessory.gearList !== undefined &&
            accessory.gearList.length > 0 && (
              <div>
                <span>Gear:</span>
                <ul>
                  {accessory.gearList.map((gear) => {
                    const baseGear = data.gearList.find((fullGear) => {
                      return fullGear.name == gear.baseGear;
                    });
                    if (baseGear === undefined) {
                      throw new Error(
                        `Base Gear not found for ${gear.baseGear}`
                      );
                    }
                    return (
                      <FormattedGearDiv
                        data={data}
                        gear={baseGear}
                        customisedGear={gear}
                      />
                    );
                  })}
                </ul>
              </div>
            )}
        </div>
      </CollapsibleEquipmentDiv>
    </div>
  );
};

interface IArmourDivProps {
  title: string;
  data: EquipmentListType;
  armourType: armourCategoryEnum;
  addArmour: (armour: CustomisedArmourType) => void;
}

const ArmourDiv = function ({
  data,
  armourType,
  title,
  addArmour,
}: IArmourDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data.armourList
          .filter((armour) => armour.category === armourType)
          .map((armour) => {
            return (
              <li key={armour.name}>
                <FormattedArmourDiv
                  data={data}
                  addArmour={addArmour}
                  armour={armour}
                />
                ;
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IArmourDescriptionDivProps {
  data: EquipmentListType;
  armour: ArmourType;
  addArmour?: (armour: CustomisedArmourType) => void;
  customisedArmour?: CustomisedArmourType;
}

function FormattedArmourDiv({
  data,
  addArmour,
  armour,
  customisedArmour,
}: IArmourDescriptionDivProps) {
  const addItem =
    addArmour !== undefined
      ? function () {
          addArmour({
            baseArmour: armour.name,
            modList: armour.includedModList,
            gearList: armour.includedGearList,
          });
        }
      : undefined;
  return (
    <li key={armour.name}>
      <CollapsibleEquipmentDiv title={armour.name} addItem={addItem}>
        <div>
          <div>{armour.description}</div>
          <div>
            Armour Rating:
            {formatArmourDamageReduction(armour.damageReduction)}
          </div>
          <div>
            Avail:
            {formatArmourAvailability(armour.availability)}
          </div>
          <div>Cost: {formatArmourCost(armour.cost)}</div>
          {customisedArmour !== undefined && (
            <div>
              {customisedArmour.modList !== undefined &&
                customisedArmour.modList.length > 0 && (
                  <div>
                    Added Modifications:
                    {customisedArmour.modList.map((mod) => {
                      return <FormattedArmourModDiv mod={mod} />;
                    })}
                  </div>
                )}
              {customisedArmour.gearList !== undefined &&
                customisedArmour.gearList.length > 0 && (
                  <div>
                    Added Gear:
                    {customisedArmour.gearList.map((gear) => {
                      const baseGear = data.gearList.find((fullGear) => {
                        return fullGear.name == gear.baseGear;
                      });
                      if (baseGear === undefined) {
                        throw new Error(
                          `Base Gear not found for ${gear.baseGear}`
                        );
                      }
                      return (
                        <FormattedGearDiv
                          data={data}
                          gear={baseGear}
                          customisedGear={gear}
                        />
                      );
                    })}
                  </div>
                )}
            </div>
          )}
        </div>
      </CollapsibleEquipmentDiv>
    </li>
  );
}

function FormattedArmourModDiv({ mod }: { mod: CustomisedArmourModType }) {
  return (
    <li key={mod.baseMod}>
      <CollapsibleEquipmentDiv title={mod.baseMod}>
        <div>
          {/* <div>{mod.baseMod.description}</div> */}
          {/* <div>{mod.baseMod.category}</div> */}
        </div>
      </CollapsibleEquipmentDiv>
    </li>
  );
}

interface IGearDivProps {
  title: string;
  data: EquipmentListType;
  gearCategory: gearCategoryEnum;
  addGear: (gear: CustomisedGearType) => void;
}

const GearDiv = function ({
  data,
  gearCategory,
  title,
  addGear,
}: IGearDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data.gearList
          .filter((gear) => gear.category === gearCategory)
          .map((gear) => {
            return (
              <FormattedGearDiv data={data} gear={gear} addGear={addGear} />
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IGearDescriptionDivProps {
  data: EquipmentListType;
  gear: GearType;
  addGear?: (gear: CustomisedGearType) => void;
  customisedGear?: CustomisedGearType;
}
function FormattedGearDiv({
  data,
  gear,
  addGear,
  customisedGear,
}: IGearDescriptionDivProps) {
  const addItem =
    addGear !== undefined
      ? function () {
          addGear({
            baseGear: gear.name,
            innerGearList: gear.includedGearList,
            // TODO: look at other options if can/need to set here
          });
        }
      : undefined;
  const ratingDiv =
    typeof gear.maxRating === "number" ? (
      <div>Rating: {gear.maxRating}</div>
    ) : (
      <Fragment></Fragment>
    );
  return (
    <li key={gear.name}>
      <CollapsibleEquipmentDiv title={gear.name} addItem={addItem}>
        <div>{gear.description}</div>
        {ratingDiv}
        <div>
          Avail:
          {formatGearAvailability(gear.availability)}
        </div>
        <div>Cost: {formatGearCost(gear.cost)}</div>
        {customisedGear !== undefined && (
          <div>
            {customisedGear.specificOption !== undefined && (
              <div>Selected Text: {customisedGear.specificOption}</div>
            )}
            {customisedGear.rating !== undefined && (
              <div>Rating: {customisedGear.rating}</div>
            )}
            {customisedGear.consumeCapacity !== undefined && (
              <div>Consume Capacity</div>
            )}
            {customisedGear.currentQuantity !== undefined && (
              <div>Quality: {customisedGear.currentQuantity}</div>
            )}
            {customisedGear.innerGearList !== undefined &&
              customisedGear.innerGearList.map((innerGear) => {
                const baseGear = data.gearList.find((fullGear) => {
                  return fullGear.name == innerGear.baseGear;
                });
                if (baseGear === undefined) {
                  throw new Error(
                    `Base Gear not found for ${innerGear.baseGear}`
                  );
                }
                return (
                  <FormattedGearDiv
                    data={data}
                    gear={baseGear}
                    customisedGear={innerGear}
                  />
                );
              })}
          </div>
        )}
      </CollapsibleEquipmentDiv>
    </li>
  );
}

interface IAugmentationsDivProps {
  title: string;
  data: EquipmentListType;
  augmentationType: augmentationTypeEnum;
  addAugmentations: (augmentation: CustomisedAugmentationType) => void;
}

const AugmentationsDiv = function ({
  data,
  augmentationType,
  title,
  addAugmentations,
}: IAugmentationsDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data.augmentationList
          .filter((augmentation) => augmentation.type === augmentationType)
          .map((augmentation) => {
            return (
              <FormattedAugmentationDiv
                data={data}
                augmentation={augmentation}
                addAugmentation={addAugmentations}
              />
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IAugmentationDescriptionDivProps {
  data: EquipmentListType;
  augmentation: AugmentationType;
  addAugmentation?: (augmentation: CustomisedAugmentationType) => void;
  customisedAugmentation?: CustomisedAugmentationType;
}

const FormattedAugmentationDiv = function ({
  data,
  augmentation,
  addAugmentation,
  customisedAugmentation,
}: IAugmentationDescriptionDivProps) {
  const [grade, setGrade] = useState<augmentationGradeEnum>(
    augmentationGradeEnum.Standard
  );
  const addItem =
    addAugmentation !== undefined
      ? function () {
          addAugmentation({
            baseAugmentation: augmentation.name,
            gearList: augmentation.includedGearList,
            ...(augmentation.type === augmentationTypeEnum.Cyberware && {
              subsystemList: augmentation.includedSubsystemList,
            }),
            grade: grade,
          });
        }
      : undefined;
  return (
    <li key={augmentation.name}>
      <CollapsibleEquipmentDiv title={augmentation.name} addItem={addItem}>
        <div>{augmentation.description}</div>
        <div>
          Grade:
          <Dropdown
            options={Object.values(augmentationGradeEnum).map((value) => {
              return value;
            })}
            value={grade}
            onChange={(arg) => {
              setGrade(
                augmentationGradeEnum[
                  arg.value as keyof typeof augmentationGradeEnum
                ]
              );
            }}
          />
        </div>
        <div>Essence: {formatEssenceCost(augmentation.essenceCost)}</div>
        <FormattedAugmentationTypeInformation augmentation={augmentation} />
        <div>
          Avail:
          {formatAugmentationAvailability(augmentation.availability)}
        </div>
        <div>Cost: {formatAugmentationCost(augmentation.cost)}</div>
        {customisedAugmentation !== undefined && (
          <div>
            {customisedAugmentation.gearList !== undefined &&
              customisedAugmentation.gearList.length > 0 && (
                <div>
                  Added Gear:
                  {customisedAugmentation.gearList.map((gear) => {
                    const baseGear = data.gearList.find((fullGear) => {
                      return fullGear.name == gear.baseGear;
                    });
                    if (baseGear === undefined) {
                      throw new Error(
                        `Base Gear not found for ${gear.baseGear}`
                      );
                    }
                    return (
                      <FormattedGearDiv
                        data={data}
                        gear={baseGear}
                        customisedGear={gear}
                        key={gear.baseGear}
                      />
                    );
                  })}
                </div>
              )}
            {customisedAugmentation.subsystemList !== undefined && (
              <div>
                Added Subsystems:
                {customisedAugmentation.subsystemList.biowareList !==
                  undefined &&
                  customisedAugmentation.subsystemList.biowareList.length >
                    0 && (
                    <div>
                      Bioware:
                      {customisedAugmentation.subsystemList.biowareList.map(
                        (subsystem) => {
                          return (
                            <div key={subsystem.name}>
                              {subsystem.name} ({subsystem.rating})
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                {customisedAugmentation.subsystemList.cyberwareList !==
                  undefined &&
                  customisedAugmentation.subsystemList.cyberwareList.length >
                    0 && (
                    <div>
                      Cyberware:
                      {customisedAugmentation.subsystemList.cyberwareList.map(
                        (subsystem) => {
                          return (
                            <div key={subsystem.name}>
                              {subsystem.name} ({subsystem.rating})
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </CollapsibleEquipmentDiv>
    </li>
  );
};

const FormattedAugmentationTypeInformation = function ({
  augmentation: augmentation,
}: {
  augmentation: AugmentationType;
}) {
  switch (augmentation.type) {
    case augmentationTypeEnum.Bioware:
      return <Fragment></Fragment>;
    case augmentationTypeEnum.Cyberware: {
      let capacityFormatted = "";
      // these 2 are theoretically mutually exclusive but hey
      // lets handle the case of both of them just in case
      if (augmentation.capacity !== undefined) {
        capacityFormatted += formatAugmentationCapacity(augmentation.capacity);
      }
      if (augmentation.capacityCost !== undefined)
        capacityFormatted +=
          "[" + formatAugmentationCapacity(augmentation.capacityCost) + "]";
      if (capacityFormatted === "") {
        capacityFormatted = "-";
      }
      return <div>Capacity: {capacityFormatted}</div>;
    }
  }
};

interface IVehiclesDivProps {
  title: string;
  data: EquipmentListType;
  vehicleType: vehicleTypeEnum;
  addVehicles: (vehicle: CustomisedVehicleType) => void;
}

const VehiclesDiv = function ({
  data,
  vehicleType,
  title,
  addVehicles,
}: IVehiclesDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data.vehicleList
          .filter((vehicle) => vehicle.type === vehicleType)
          .map((vehicle) => {
            return (
              <FormattedVehicleDiv
                data={data}
                vehicle={vehicle}
                addVehicle={addVehicles}
                key={vehicle.name}
              />
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

const FormattedVehicleDiv = function ({
  data,
  vehicle,
  addVehicle,
  customisedVehicle,
}: {
  data: EquipmentListType;
  vehicle: VehicleType;
  addVehicle?: (vehicle: CustomisedVehicleType) => void;
  customisedVehicle?: CustomisedVehicleType;
}) {
  const addItem =
    addVehicle !== undefined
      ? function () {
          addVehicle({
            baseVehicle: vehicle.name,
            modList: vehicle.includedModList,
            gearList: vehicle.includedGearList,
            weaponMountList: vehicle.includedWeaponMountList,
          });
        }
      : undefined;
  return (
    <li key={vehicle.name}>
      <CollapsibleEquipmentDiv title={vehicle.name} addItem={addItem}>
        <div>{vehicle.description}</div>
        <div>Handl: {formatOnOffRoad(vehicle.handling)}</div>
        <div>Speed: {formatOnOffRoad(vehicle.speed)}</div>
        <div>Accel: {formatOnOffRoad(vehicle.acceleration)}</div>
        <div>Bod: {vehicle.body}</div>
        <div>Armour: {vehicle.armour}</div>
        <div>Pilot: {vehicle.pilot}</div>
        <div>Sensor: {vehicle.sensor}</div>
        <div>Mod Slots: {formatVehicleModSlotCount(vehicle)}</div>
        {"seats" in vehicle && vehicle.seats !== undefined && (
          <div>Seats: {formatVehicleSeats(vehicle.seats)}</div>
        )}
        <div>Avail: {formatVehicleAvailability(vehicle.availability)}</div>
        <div>Cost: {formatVehicleCost(vehicle.cost)}</div>
        {customisedVehicle !== undefined ? (
          <div>
            {customisedVehicle.modList !== undefined &&
              customisedVehicle.modList.length > 0 && (
                <ul>
                  Added Modifications:
                  {customisedVehicle.modList.map((mod) => {
                    return (
                      <FormattedVehicleModDiv
                        data={data}
                        mod={mod}
                        key={mod.baseMod}
                      />
                    );
                  })}
                </ul>
              )}
            {customisedVehicle.gearList !== undefined &&
              customisedVehicle.gearList.length > 0 && (
                <ul>
                  Added Gear:
                  {customisedVehicle.gearList.map((gear) => {
                    const baseGear = data.gearList.find((fullGear) => {
                      return fullGear.name == gear.baseGear;
                    });
                    if (baseGear === undefined) {
                      throw new Error(
                        `Base Gear not found for ${gear.baseGear}`
                      );
                    }
                    return (
                      <FormattedGearDiv
                        data={data}
                        gear={baseGear}
                        customisedGear={gear}
                        key={gear.baseGear}
                      />
                    );
                  })}
                </ul>
              )}
            {customisedVehicle.weaponMountList !== undefined &&
              customisedVehicle.weaponMountList.length > 0 && (
                <ul>
                  Added Weapon Mounts:
                  {customisedVehicle.weaponMountList.map((mount) => {
                    return <VehicleMountDiv mount={mount} data={data} />;
                  })}
                </ul>
              )}
          </div>
        ) : (
          <div>
            {vehicle.includedModList !== undefined &&
              vehicle.includedModList.length > 0 && (
                <ul>
                  Included Modifications:
                  {vehicle.includedModList.map((mod) => {
                    return (
                      <FormattedVehicleModDiv
                        data={data}
                        mod={mod}
                        key={mod.baseMod}
                      />
                    );
                  })}
                </ul>
              )}
            {vehicle.includedGearList !== undefined &&
              vehicle.includedGearList.length > 0 && (
                <ul>
                  Included Gear:
                  {vehicle.includedGearList.map((gear) => {
                    const baseGear = data.gearList.find((fullGear) => {
                      return fullGear.name == gear.baseGear;
                    });
                    if (baseGear === undefined) {
                      throw new Error(
                        `Base Gear not found for ${gear.baseGear}`
                      );
                    }
                    return (
                      <FormattedGearDiv
                        data={data}
                        gear={baseGear}
                        customisedGear={gear}
                        key={gear.baseGear}
                      />
                    );
                  })}
                </ul>
              )}
            {vehicle.includedWeaponMountList !== undefined &&
              vehicle.includedWeaponMountList.length > 0 && (
                <ul>
                  Included Weapon Mounts:
                  {vehicle.includedWeaponMountList.map((mount) => {
                    return <VehicleMountDiv mount={mount} data={data} />;
                  })}
                </ul>
              )}
          </div>
        )}
      </CollapsibleEquipmentDiv>
    </li>
  );
};

const FormattedVehicleModDiv = function ({
  data,
  mod,
}: {
  data: EquipmentListType;
  mod: CustomisedVehicleModType;
}) {
  const baseMod = findBaseVehicleMod(mod.baseMod, data.vehicleModificationList);
  return (
    <li key={mod.baseMod}>
      <CollapsibleEquipmentDiv title={baseMod.name}>
        <div>
          {/* <div>{baseMod.description}</div> */}
          {/* <div>{baseMod.category}</div> */}
        </div>
      </CollapsibleEquipmentDiv>
    </li>
  );
};

const VehicleMountDiv = function ({
  mount,
  data,
}: {
  mount: CustomisedWeaponMountType;
  data: EquipmentListType;
}) {
  const weaponMounted = mount.weaponMounted;
  let weaponDiv = <></>;
  if (weaponMounted !== undefined) {
    const baseWeapon = data.weaponList.find((fullWeapon) => {
      return fullWeapon.name == weaponMounted.baseWeapon;
    });
    if (baseWeapon === undefined) {
      throw new Error(`Base Weapon not found for ${weaponMounted.baseWeapon}`);
    }
    weaponDiv = (
      <FormattedWeaponDiv
        data={data}
        weapon={baseWeapon}
        customisedWeapon={weaponMounted}
      />
    );
  }

  const weaponMountModList = mount.weaponMountModList;
  let modDiv = <></>;
  if (weaponMountModList !== undefined) {
    modDiv = (
      <>
        {weaponMountModList.map((mod) => {
          const baseMod = data.weaponMountModificationList.find((fullMod) => {
            return fullMod.name == mod;
          });
          if (baseMod === undefined) {
            throw new Error(`Base Weapon Mount Mod not found for ${mod}`);
          }
          return <FormattedWeaponMountModDiv mod={baseMod} />;
        })}
      </>
    );
  }
  return (
    <div>
      {weaponDiv}
      {modDiv}
    </div>
  );
};
const FormattedWeaponMountModDiv = function ({
  mod,
}: {
  mod: WeaponMountModType;
}) {
  return (
    <CollapsibleDiv title={mod.name}>
      <div>
        <div>{mod.description}</div>
        <div>Type: {mod.type}</div>
        <div>Slot Cost: {formatWeaponMountSlotCost(mod.slotCost)}</div>
        {mod.additionalAmmo !== undefined && (
          <div>Additional Ammo: {mod.additionalAmmo}</div>
        )}
        {mod.percentageAmmoIncrease !== undefined && (
          <div>Percentage Ammo Increase: {mod.percentageAmmoIncrease}</div>
        )}
        {mod.replaceAmmo !== undefined && (
          <div>{/* Replace Ammo: {formatReplaceAmmo(mod.replaceAmmo)} */}</div>
        )}
        <div>
          {/* Availability: {formatWeaponMountAvailability(mod.availability)} */}
        </div>
        {/* <div>Cost: {formatWeaponMountCost(mod.cost)}</div> */}
        <div>Source: {mod.source}</div>
        <div>Page: {mod.page}</div>
      </div>
    </CollapsibleDiv>
  );
};
