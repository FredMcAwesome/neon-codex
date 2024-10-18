import { CollapsibleDiv } from "../../../utils/CollapsibleDiv.js";
import { CollapsibleEquipmentDiv } from "./EquipmentHelper.js";
import { costCalculation } from "../../../utils/calculations.js";
import type {
  CostWeaponType,
  WeaponSummaryListType,
  WeaponSummaryType,
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
  augmentationTypeEnum,
  gearCategoryEnum,
  vehicleTypeEnum,
  weaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import type {
  GearListType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  AugmentationType,
  AugmentationListType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  VehicleListType,
  VehicleType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import type {
  ArmourListType,
  ArmourType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import { Fragment } from "react";
import type { CharacterCreatorBonusListType } from "../commonSchemas.js";

interface IProps {
  equipmentSelected: EquipmentListType;
  setEquipmentSelected: (loadingEquipmentSelected: EquipmentListType) => void;
  nuyen: number;
  setNuyen: (nuyen: number) => void;
  essencePoints: number;
  setEssencePoints: (essencePoints: number) => void;
  bonusInfo: CharacterCreatorBonusListType;
  setBonusInfo: (loadingBonusInfo: CharacterCreatorBonusListType) => void;
}

export const EquipmentSelect = function (props: IProps) {
  const { data, error, isError, isLoading } = trpc.character.all.useQuery();
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

  const equipmentSelected = props.equipmentSelected;

  const addWeapon = function (weapon: WeaponSummaryType) {
    const equipment = { ...equipmentSelected };
    equipment.weapons.push(weapon);
    props.setEquipmentSelected(equipment);
    props.setNuyen(
      props.nuyen - costCalculation<CostWeaponType>(weapon.cost, {})
    );
  };
  const removeWeapon = function (weapon: WeaponSummaryType, index: number) {
    const equipment = { ...equipmentSelected };
    if (equipment.weapons[index] === weapon) {
      equipment.weapons.splice(index, 1);
      props.setEquipmentSelected(equipment);
      props.setNuyen(
        props.nuyen + costCalculation<CostWeaponType>(weapon.cost, {})
      );
    } else {
      console.error("No weapon at index: " + index);
    }
  };
  const addArmour = function (armour: ArmourType) {
    const equipment = { ...equipmentSelected };
    equipment.armours.push(armour);
    props.setEquipmentSelected(equipment);
    props.setNuyen(props.nuyen - costCalculation(armour.cost, {}));
  };
  const removeArmour = function (armour: ArmourType, index: number) {
    const equipment = { ...equipmentSelected };
    if (equipment.armours[index] === armour) {
      equipment.armours.splice(index, 1);
      props.setEquipmentSelected(equipment);
      props.setNuyen(props.nuyen + costCalculation(armour.cost, {}));
    } else {
      console.error("No armour at index: " + index);
    }
  };
  const addGear = function (gear: GearType) {
    const equipment = Object.assign({}, equipmentSelected);
    equipment.gears.push(gear);
    props.setEquipmentSelected(equipment);
    props.setNuyen(props.nuyen - costCalculation(gear.cost, {}));
  };
  const removeGear = function (other: GearType, index: number) {
    const equipment = Object.assign({}, equipmentSelected);
    if (equipment.gears[index] === other) {
      equipment.gears.splice(index, 1);
      props.setEquipmentSelected(equipment);
      props.setNuyen(props.nuyen + costCalculation(other.cost, {}));
    } else {
      console.error("No gear at index: " + index);
    }
  };
  const addAugmentations = function (augmentation: AugmentationType) {
    const equipment = Object.assign({}, equipmentSelected);
    equipment.augmentations.push(augmentation);
    props.setEquipmentSelected(equipment);
    props.setNuyen(props.nuyen - costCalculation(augmentation.cost, {}));
  };
  const removeAugmentations = function (
    augmentation: AugmentationType,
    index: number
  ) {
    const equipment = Object.assign({}, equipmentSelected);
    if (equipment.augmentations[index] === augmentation) {
      equipment.augmentations.splice(index, 1);
      props.setEquipmentSelected(equipment);
      props.setNuyen(props.nuyen + costCalculation(augmentation.cost, {}));
    } else {
      console.error("No augmentation at index: " + index);
    }
  };
  const addVehicles = function (vehicle: VehicleType) {
    const equipment = Object.assign({}, equipmentSelected);
    equipment.vehicles.push(vehicle);
    props.setEquipmentSelected(equipment);
    props.setNuyen(props.nuyen - costCalculation(vehicle.cost, {}));
  };
  const removeVehicles = function (vehicle: VehicleType, index: number) {
    const equipment = Object.assign({}, equipmentSelected);
    if (equipment.vehicles[index] === vehicle) {
      equipment.vehicles.splice(index, 1);
      props.setEquipmentSelected(equipment);
      props.setNuyen(props.nuyen + costCalculation(vehicle.cost, {}));
    } else {
      console.error("No vehicle/drone at index: " + index);
    }
  };

  return (
    <div>
      <h1>Equipment Selection</h1>
      <CollapsibleDiv title="Weapons">
        <div id="Weapons_Div">
          {Object.values(weaponTypeEnum).map((value, index) => {
            return (
              <WeaponDiv
                title={value}
                data={data.weapons}
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
                data={data.armours}
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
                data={data.gears}
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
                data={data.augmentations}
                augmentationType={value}
                addAugmentations={addAugmentations}
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
                data={data.vehicles}
                vehicleType={value}
                addVehicles={addVehicles}
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
          {equipmentSelected.weapons.map((weapon, index) => {
            const addItem = function () {
              addWeapon(weapon);
            };
            const removeItem = function () {
              removeWeapon(weapon, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={weapon.name}
                addItem={addItem}
                removeItem={removeItem}
                key={weapon.name + index}
              >
                <div>{weapon.description}</div>
                {weapon.includedAccessoryList !== undefined &&
                  weapon.includedAccessoryList.length > 0 && (
                    <div>
                      <span>Accessories:</span>
                      <ul>
                        {weapon.includedAccessoryList.map((accessory) => {
                          return (
                            <li key={weapon.name + accessory.name}>
                              {accessory.name}
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
          {equipmentSelected.armours.map((armour, index) => {
            const addItem = function () {
              addArmour(armour);
            };
            const removeItem = function () {
              removeArmour(armour, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={armour.name}
                addItem={addItem}
                removeItem={removeItem}
                key={armour.name + index}
              >
                <div>{armour.description}</div>
                {armour.includedMods !== undefined &&
                  armour.includedMods.length > 0 && (
                    <div>
                      <span>Modifications:</span>
                      <ul>
                        {armour.includedMods.map((mod) => {
                          return (
                            <li key={armour.name + mod.name}>{mod.name}</li>
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
          {equipmentSelected.gears.map((gear, index) => {
            const addItem = function () {
              addGear(gear);
            };
            const removeItem = function () {
              removeGear(gear, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={gear.name}
                addItem={addItem}
                removeItem={removeItem}
                key={gear.name + index}
              >
                <div>{gear.description}</div>
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Augmentation</h3>
        <div>
          {equipmentSelected.augmentations.map((augmentations, index) => {
            const addItem = function () {
              addAugmentations(augmentations);
            };
            const removeItem = function () {
              removeAugmentations(augmentations, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={augmentations.name}
                addItem={addItem}
                removeItem={removeItem}
                key={augmentations.name + index}
              >
                <div>{augmentations.description}</div>
              </CollapsibleEquipmentDiv>
            );
          })}
        </div>
        <h3>Vehicles</h3>
        <div>
          {equipmentSelected.vehicles.map((vehicle, index) => {
            const addItem = function () {
              addVehicles(vehicle);
            };
            const removeItem = function () {
              removeVehicles(vehicle, index);
            };
            return (
              <CollapsibleEquipmentDiv
                title={vehicle.name}
                addItem={addItem}
                removeItem={removeItem}
                key={vehicle.name + index}
              >
                <div>{vehicle.description}</div>
                {vehicle.includedMods !== undefined &&
                  vehicle.includedMods.length > 0 && (
                    <div>
                      <span>Modifications:</span>
                      <ul>
                        {vehicle.includedMods.map((mod) => {
                          return (
                            <li key={vehicle.name + mod.name}>{mod.name}</li>
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

interface IWeaponDivProps {
  title: string;
  data: WeaponSummaryListType;
  weaponType: weaponTypeEnum;
  addWeapon: (weapon: WeaponSummaryType) => void;
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
  weapon: WeaponSummaryType;
  addWeapon: (weapon: WeaponSummaryType) => void;
}

const FormattedWeaponDiv = function ({
  weapon,
  addWeapon,
}: IWeaponDescriptionDivProps) {
  const addItem = function () {
    addWeapon(weapon);
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
  weapon: WeaponSummaryType;
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
  addArmour: (armour: ArmourType) => void;
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
            const addItem = function () {
              addArmour(armour);
            };
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
                  </div>
                </CollapsibleEquipmentDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IGearDivProps {
  title: string;
  data: GearListType;
  gearCategory: gearCategoryEnum;
  addGear: (gear: GearType) => void;
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
              addGear(gear);
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
  addAugmentations: (augmentation: AugmentationType) => void;
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
        {data
          .filter((augmentation) => augmentation.type === augmentationType)
          .map((augmentation) => {
            const addItem = function () {
              addAugmentations(augmentation);
            };
            return (
              <li key={augmentationType + augmentation.name}>
                <CollapsibleEquipmentDiv
                  title={augmentation.name}
                  addItem={addItem}
                >
                  <div>{augmentation.description}</div>
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
  addVehicles: (vehicle: VehicleType) => void;
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
          .map((vehicles) => {
            const addItem = function () {
              addVehicles(vehicles);
            };
            let seats = "-";
            if ("seats" in vehicles && vehicles.seats !== undefined) {
              if (typeof vehicles.seats === "object") {
                seats = vehicles.seats.max.toString();
              } else {
                seats = vehicles.seats.toString();
              }
            }
            return (
              <li key={vehicleTypeEnum[vehicleType] + vehicles.name}>
                <CollapsibleEquipmentDiv
                  title={vehicles.name}
                  addItem={addItem}
                >
                  <div>{vehicles.description}</div>
                  <div>Handl: {formatOnOffRoad(vehicles.handling)}</div>
                  <div>Speed: {formatOnOffRoad(vehicles.speed)}</div>
                  <div>Accel: {formatOnOffRoad(vehicles.acceleration)}</div>
                  <div>Bod: {vehicles.body}</div>
                  <div>Armour: {vehicles.armour}</div>
                  <div>Pilot: {vehicles.pilot}</div>
                  <div>Sensor: {vehicles.sensor}</div>
                  <div>Seats: {seats}</div>
                  <div>
                    Avail: {formatVehicleAvailability(vehicles.availability)}
                  </div>
                  <div>Cost: {formatVehicleCost(vehicles.cost)}</div>
                </CollapsibleEquipmentDiv>
                <div>{vehicles.subtype}</div>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};
