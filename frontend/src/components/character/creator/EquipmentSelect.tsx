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

  const addEquipmentPack = function (_equipmentPack: EquipmentPackType) {
    // for (const vehicle of equipmentPack.vehicleList) {
    //   const loadedVehicle = data.vehicleList.find((fullVehicle) => {
    //     return fullVehicle.name == vehicle.name;
    //   });
    //   if (loadedVehicle === undefined) {
    //     throw new Error(`Base Vehicle not found for ${vehicle.name}`);
    //   }
    //   addVehicle({baseVehicle: loadedVehicle, );
    // }
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
      <h1>Equipment Selection</h1>
      <CollapsibleDiv title="Equipment Pack">
        <div id="Equipment_Pack_Div">
          <EquipmentPackDiv
            data={props.data}
            addEquipmentPack={addEquipmentPack}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Weapons">
        <div id="Weapons_Div">
          {Object.values(weaponTypeEnum).map((value, index) => {
            return (
              <WeaponDiv
                title={value}
                data={props.data.weaponList}
                weaponType={value}
                addWeapon={addWeapon}
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
                data={props.data.armourList}
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
                data={props.data.gearList}
                gearCategory={value}
                addGear={addGear}
                key={index}
              />
            );
          })}
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Augmentations">
        <div id="Augmentations_Div">
          {Object.values(augmentationTypeEnum).map((value, index) => {
            return (
              <AugmentationsDiv
                title={value}
                data={props.data.augmentationList}
                augmentationType={value}
                addAugmentations={addAugmentation}
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
                data={props.data.vehicleList}
                vehicleType={value}
                addVehicles={addVehicle}
                key={index}
              />
            );
          })}
        </div>
      </CollapsibleDiv>
      <h2>Gear Selected</h2>
      <h3>
        Nuyen Remaining: <span>{props.nuyen}</span>
      </h3>
      <div>
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
        <h3>Armour</h3>
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
        <h3>Augmentation</h3>
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
        const addItem = function () {
          addEquipmentPack(equipment);
        };
        return (
          <CollapsibleEquipmentDiv
            key={equipment.name}
            title={equipment.name}
            addItem={addItem}
          >
            <div>
              {equipment.armourList.map((armour) => {
                const baseArmour = data.armourList.find((fullArmour) => {
                  return fullArmour.name == armour.baseArmour;
                });
                if (baseArmour === undefined) {
                  throw new Error(
                    `Base Armour not found for ${armour.baseArmour}`
                  );
                }

                const armorModList =
                  armour.modList !== undefined
                    ? armour.modList.map((armourMod) => {
                        const baseArmourMod = data.armourModificationList.find(
                          (fullArmourMod) => {
                            return fullArmourMod.name == armourMod.baseMod;
                          }
                        );
                        if (baseArmourMod === undefined) {
                          throw new Error(
                            `Base Armour Mod not found for ${armour.baseArmour} : ${armourMod.baseMod}`
                          );
                        }

                        return {
                          baseMod: armourMod.baseMod,
                          // TODO: set the gearlist
                          gearList: [],
                          rating: armourMod.rating,
                        };
                      })
                    : undefined;

                return (
                  <li key={armour.baseArmour}>
                    <FormattedArmourDiv
                      armour={baseArmour}
                      modList={armorModList}
                      gearList={armour.gearList}
                    />
                    ;
                  </li>
                );
              })}
            </div>
          </CollapsibleEquipmentDiv>
        );
      })}
    </div>
  );
};

interface IWeaponDivProps {
  title: string;
  data: WeaponListType;
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
        {data
          .filter((gear) => gear.type === weaponType)
          .map((weapon) => {
            return (
              <li key={weapon.name}>
                <FormattedWeaponDiv weapon={weapon} addWeapon={addWeapon} />
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IWeaponDescriptionDivProps {
  weapon: WeaponType;
  addWeapon: (weapon: CustomisedWeaponType) => void;
}

const FormattedWeaponDiv = function ({
  weapon,
  addWeapon,
}: IWeaponDescriptionDivProps) {
  const addItem = function () {
    addWeapon({
      baseWeapon: weapon.name,
      accessoryList: weapon.includedAccessoryList,
    });
  };
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

interface IArmourDivProps {
  title: string;
  data: ArmourListType;
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
        {data
          .filter((armour) => armour.category === armourType)
          .map((armour) => {
            return (
              <li key={armour.name}>
                <FormattedArmourDiv addArmour={addArmour} armour={armour} />;
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IArmourDescriptionDivProps {
  armour: ArmourType;
  addArmour?: (armour: CustomisedArmourType) => void;
  modList?: CustomisedArmourModListType | undefined;
  gearList?: CustomisedGearListType | undefined;
}

function FormattedArmourDiv({
  addArmour,
  armour,
  modList,
  gearList,
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
          <div>
            {modList !== undefined &&
              modList.map((mod) => {
                return <FormattedArmourMod mod={mod} />;
              })}
          </div>
          <div>
            {gearList !== undefined &&
              gearList.map((gear) => {
                return <FormattedGear gear={gear} />;
              })}
          </div>
        </div>
      </CollapsibleEquipmentDiv>
    </li>
  );
}

function FormattedArmourMod({ mod }: { mod: CustomisedArmourModType }) {
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

function FormattedGear({ gear }: { gear: CustomisedGearType }) {
  return <>{gear.baseGear}</>;
}

interface IGearDivProps {
  title: string;
  data: GearListType;
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
        {data
          .filter((gear) => gear.category === gearCategory)
          .map((gear) => {
            const addItem = function () {
              addGear({
                baseGear: gear.name,
                innerGearList: gear.includedGearList,
                // TODO: look at other options if can/need to set here
              });
            };
            const ratingDiv =
              typeof gear.maxRating === "number" ? (
                <div>Rating: {gear.maxRating}</div>
              ) : (
                <Fragment></Fragment>
              );
            return (
              <li key={gearCategory + gear.name}>
                <CollapsibleEquipmentDiv title={gear.name} addItem={addItem}>
                  <div>{gear.description}</div>
                  {ratingDiv}
                  <div>
                    Avail:
                    {formatGearAvailability(gear.availability)}
                  </div>
                  <div>Cost: {formatGearCost(gear.cost)}</div>
                </CollapsibleEquipmentDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IAugmentationsDivProps {
  title: string;
  data: AugmentationListType;
  augmentationType: augmentationTypeEnum;
  addAugmentations: (augmentation: CustomisedAugmentationType) => void;
}

const AugmentationsDiv = function ({
  data,
  augmentationType,
  title,
  addAugmentations,
}: IAugmentationsDivProps) {
  const [grade, setGrade] = useState<augmentationGradeEnum>(
    augmentationGradeEnum.Standard
  );
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((augmentation) => augmentation.type === augmentationType)
          .map((augmentation) => {
            const addItem = function () {
              addAugmentations({
                baseAugmentation: augmentation.name,
                gearList: augmentation.includedGearList,
                ...(augmentation.type === augmentationTypeEnum.Cyberware && {
                  subsystemList: augmentation.includedSubsystemList,
                }),
                grade: grade,
              });
            };
            return (
              <li key={augmentationType + augmentation.name}>
                <CollapsibleEquipmentDiv
                  title={augmentation.name}
                  addItem={addItem}
                >
                  <div>{augmentation.description}</div>
                  <div>
                    Grade:
                    <Dropdown
                      options={Object.values(augmentationGradeEnum).map(
                        (value) => {
                          return value;
                        }
                      )}
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
                  <div>
                    Essence: {formatEssenceCost(augmentation.essenceCost)}
                  </div>
                  <FormattedAugmentationTypeInformation
                    augmentation={augmentation}
                  />
                  <div>
                    Avail:
                    {formatAugmentationAvailability(augmentation.availability)}
                  </div>
                  <div>Cost: {formatAugmentationCost(augmentation.cost)}</div>
                </CollapsibleEquipmentDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
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
  data: VehicleListType;
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
        {data
          .filter((gear) => gear.type === vehicleType)
          .map((vehicle) => {
            const addItem = function () {
              addVehicles({
                baseVehicle: vehicle.name,
                modList: vehicle.includedModList,
                gearList: vehicle.includedGearList,
                weaponMountList: vehicle.includedWeaponMountList,
              });
            };
            let seats = "-";
            if ("seats" in vehicle && vehicle.seats !== undefined) {
              if (typeof vehicle.seats === "object") {
                seats = vehicle.seats.max.toString();
              } else {
                seats = vehicle.seats.toString();
              }
            }
            return (
              <li key={vehicleTypeEnum[vehicleType] + vehicle.name}>
                <CollapsibleEquipmentDiv title={vehicle.name} addItem={addItem}>
                  <div>{vehicle.description}</div>
                  <div>Handl: {formatOnOffRoad(vehicle.handling)}</div>
                  <div>Speed: {formatOnOffRoad(vehicle.speed)}</div>
                  <div>Accel: {formatOnOffRoad(vehicle.acceleration)}</div>
                  <div>Bod: {vehicle.body}</div>
                  <div>Armour: {vehicle.armour}</div>
                  <div>Pilot: {vehicle.pilot}</div>
                  <div>Sensor: {vehicle.sensor}</div>
                  <div>Seats: {seats}</div>
                  <div>
                    Avail: {formatVehicleAvailability(vehicle.availability)}
                  </div>
                  <div>Cost: {formatVehicleCost(vehicle.cost)}</div>
                </CollapsibleEquipmentDiv>
                <div>{vehicle.subtype}</div>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};
