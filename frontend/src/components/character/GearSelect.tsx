import {
  // AugmentationType,
  // augmentationTypeEnum,
  // magicalGearTypeEnum,
  // matrixWareAccessoryTypeEnum,
  // matrixWareTypeEnum,
  // otherWareTypeEnum,
  // vehicleDroneTypeEnum,
  weaponTypeEnum,
} from "@shadowrun/common";
import type {
  GearListType,
  // MatrixType
} from "@shadowrun/common";
import { CollapsibleDiv } from "../../utils/CollapsibleDiv.js";
// import {
//   AudioDeviceTypeInformationSchema,
//   AudioEnhancementTypeInformationSchema,
//   IdentificationTypeInformationSchema,
//   MatrixAccessoryType,
//   electronicTypeInformationType,
//   OpticalDeviceTypeInformationSchema,
//   RFIDTypeInformationSchema,
//   SecurityDeviceTypeInformationSchema,
//   ToolTypeInformationSchema,
//   VisionEnhancementTypeInformationSchema,
//   electronicAccessoryTypeInformationType,
// } from "@shadowrun/common/src/schemas/electronicSchemas.js";
// import { OtherGearType } from "@shadowrun/common/src/schemas/otherGearSchema.js";
// import { MagicGearType } from "@shadowrun/common/src/schemas/magicalSchemas.js";
// import { VehiclesAndDronesType } from "@shadowrun/common/src/schemas/riggerSchema.js";
import { CollapsibleGearDiv } from "./GearHelper.js";
import {
  costCalculation,
  genericListCalculation,
} from "../../utils/calculations.js";
import {
  WeaponUnlinkedSummaryListType,
  WeaponUnlinkedSummaryType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import { trpc } from "../../utils/trpc.js";

interface IProps {
  gearSelected: GearListType;
  setGearSelected: (loadingGearSelected: GearListType) => void;
  nuyen: number;
  setNuyen: (nuyen: number) => void;
}

export const GearSelect = function (props: IProps) {
  const { data, error, isError, isLoading } = trpc.character.all.useQuery();
  if (isLoading) {
    return <div>Loading gear...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  const gearSelected = props.gearSelected;

  const addWeapon = function (weapon: WeaponUnlinkedSummaryType) {
    const gear = { ...gearSelected };
    gear.weapons.push(weapon);
    props.setGearSelected(gear);
    props.setNuyen(
      props.nuyen -
        costCalculation(weapon.cost, {
          rating: genericListCalculation(weapon.availability.rating, {}),
        })
    );
  };
  const removeWeapon = function (
    weapon: WeaponUnlinkedSummaryType,
    index: number
  ) {
    const gear = { ...gearSelected };
    if (gear.weapons[index] === weapon) {
      gear.weapons.splice(index, 1);
      props.setGearSelected(gear);
      props.setNuyen(
        props.nuyen +
          costCalculation(weapon.cost, {
            rating: genericListCalculation(weapon.availability.rating, {}),
          })
      );
    } else {
      console.error("No weapon at index: " + index);
    }
  };
  // const addElectronics = function (electronic: MatrixType) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.electronics.push(electronic);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(electronic.cost));
  // };
  // const removeElectronics = function (electronic: MatrixType, index: number) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.electronics[index] === electronic) {
  //     gear.electronics.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(electronic.cost));
  //   } else {
  //     console.error("No electronic at index: " + index);
  //   }
  // };
  // const addElectronicAccessories = function (
  //   electronicAccessory: MatrixAccessoryType
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.electronicAccessories.push(electronicAccessory);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(electronicAccessory.cost));
  // };
  // const removeElectronicAccessories = function (
  //   electronicAccessory: MatrixAccessoryType,
  //   index: number
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.electronicAccessories[index] === electronicAccessory) {
  //     gear.electronicAccessories.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(electronicAccessory.cost));
  //   } else {
  //     console.error("No electronic accessory at index: " + index);
  //   }
  // };
  // const addOtherGear = function (other: OtherGearType) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.otherGear.push(other);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(other.cost));
  // };
  // const removeOtherGear = function (other: OtherGearType, index: number) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.otherGear[index] === other) {
  //     gear.otherGear.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(other.cost));
  //   } else {
  //     console.error("No other gear at index: " + index);
  //   }
  // };
  // const addAugmentations = function (augmentation: AugmentationType) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.augmentations.push(augmentation);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(augmentation.cost));
  // };
  // const removeAugmentations = function (
  //   augmentation: AugmentationType,
  //   index: number
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.augmentations[index] === augmentation) {
  //     gear.augmentations.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(augmentation.cost));
  //   } else {
  //     console.error("No augmentation at index: " + index);
  //   }
  // };
  // const addMagicalEquipment = function (magicalItem: MagicGearType) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.magicalEquipment.push(magicalItem);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(magicalItem.cost));
  // };
  // const removeMagicalEquipment = function (
  //   magicalItem: MagicGearType,
  //   index: number
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.magicalEquipment[index] === magicalItem) {
  //     gear.magicalEquipment.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(magicalItem.cost));
  //   } else {
  //     console.error("No magical equipment at index: " + index);
  //   }
  // };
  // const addVehiclesAndDrones = function (
  //   vehicleOrDrone: VehiclesAndDronesType
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.vehiclesAndDrones.push(vehicleOrDrone);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(vehicleOrDrone.cost));
  // };
  // const removeVehiclesAndDrones = function (
  //   vehicleOrDrone: VehiclesAndDronesType,
  //   index: number
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.vehiclesAndDrones[index] === vehicleOrDrone) {
  //     gear.vehiclesAndDrones.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(vehicleOrDrone.cost));
  //   } else {
  //     console.error("No vehicle/drone at index: " + index);
  //   }
  // };

  return (
    <div>
      <h1>Gear Selection</h1>
      <CollapsibleDiv title="Weapons">
        <div id="Weapons_Div">
          <WeaponDiv
            title={"Melee Weapons"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Melee}
            addWeapon={addWeapon}
          />
          <WeaponDiv
            title={"Projectile Weapons"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Projectile}
            addWeapon={addWeapon}
          />
          <WeaponDiv
            title={"Firearms"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Firearm}
            addWeapon={addWeapon}
          />
          <WeaponDiv
            title={"Explosives"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Explosive}
            addWeapon={addWeapon}
          />
        </div>
      </CollapsibleDiv>
      {/* <CollapsibleDiv title="Electronics">
        <div id="Matrix_Div">
          <MatrixDiv
            title={"Commlinks"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Commlink}
            addElectronics={addElectronics}
          />
          <MatrixDiv
            title={"Cyberdecks"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Cyberdeck}
            addElectronics={addElectronics}
          />
          <MatrixDiv
            title={"RFID Tags"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.RFIDTag}
            addElectronics={addElectronics}
          />
          <MatrixDiv
            title={"Communication and Countermeasures"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.CommunicationCountermeasure}
            addElectronics={addElectronics}
          />
          <MatrixDiv
            title={"Software"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Software}
            addElectronics={addElectronics}
          />
          <MatrixDiv
            title={"Skillsofts"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Skillsoft}
            addElectronics={addElectronics}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Electronic Accessories">
        <div id="Matrix_Accessories_Div">
          <MatrixAccessoriesDiv
            title={"Cred Sticks"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.CredStick}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Identification"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Identification}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Tools"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Tool}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Optical and Imaging Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.OpticalDevice}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Vision Enhancements"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.VisionEnhancement
            }
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Audio Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.AudioDevice}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Audio Enhancements"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.AudioEnhancement
            }
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Sensors"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Sensor}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Security Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.SecurityDevice}
            addElectronicAccessories={addElectronicAccessories}
          />
          <MatrixAccessoriesDiv
            title={"Breaking and Entering"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice
            }
            addElectronicAccessories={addElectronicAccessories}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Other Gear">
        <div id="OtherGear_Div">
          <OtherGearDiv
            title={"Industrial Chemicals"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.IndustrialChemical}
            addOtherGear={addOtherGear}
          />
          <OtherGearDiv
            title={"Survival Gear"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.SurvivalGear}
            addOtherGear={addOtherGear}
          />
          <OtherGearDiv
            title={"Grapple Gun"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.GrappleGun}
            addOtherGear={addOtherGear}
          />
          <OtherGearDiv
            title={"Biotech"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.Biotech}
            addOtherGear={addOtherGear}
          />
          <OtherGearDiv
            title={"DocWagon Contract"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.DocWagonContract}
            addOtherGear={addOtherGear}
          />
          <OtherGearDiv
            title={"Slap Patches"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.SlapPatch}
            addOtherGear={addOtherGear}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Augmentations">
        <div id="Augmentations_Div">
          <AugmentationsDiv
            title={"Headware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Headware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Eyeware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Eyeware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Earware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Earware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Bodyware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Bodyware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Cyberlimbs"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Cyberlimbs}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Bioware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Bioware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Cultured Bioware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.CulturedBioware}
            addAugmentations={addAugmentations}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Magical Equipment">
        <div id="Magical_Equipment_Div">
          <MagicalEquipmentDiv
            title={"Foci"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Focus}
            addMagicalEquipment={addMagicalEquipment}
          />
          <MagicalEquipmentDiv
            title={"Formulae"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Formula}
            addMagicalEquipment={addMagicalEquipment}
          />
          <MagicalEquipmentDiv
            title={"Magical Supply"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Supply}
            addMagicalEquipment={addMagicalEquipment}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicles and Drones">
        <div id="Vehicles_and_Drones">
          <VehiclesAndDronesDiv
            title={"Groundcraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Groundcrafts}
            addVehiclesAndDrones={addVehiclesAndDrones}
          />
          <VehiclesAndDronesDiv
            title={"Watercraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Watercrafts}
            addVehiclesAndDrones={addVehiclesAndDrones}
          />
          <VehiclesAndDronesDiv
            title={"Aircraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Aircrafts}
            addVehiclesAndDrones={addVehiclesAndDrones}
          />
          <VehiclesAndDronesDiv
            title={"Drones"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Drones}
            addVehiclesAndDrones={addVehiclesAndDrones}
          />
        </div>
      </CollapsibleDiv> */}
      <h2>Gear Selected</h2>
      <h3>
        Nuyen Remaining: <span>{props.nuyen}</span>
      </h3>
      <div>
        <h3>Weapons</h3>
        <div>
          {gearSelected.weapons.map((weapon, index) => {
            const addItem = function () {
              addWeapon(weapon);
            };
            const removeItem = function () {
              removeWeapon(weapon, index);
            };
            return (
              <CollapsibleGearDiv
                title={weapon.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{weapon.description}</div>
                {weapon.accessories && (
                  <div>
                    <span>Accessories:</span>
                    <ul>
                      {weapon.accessories.map((accessory) => {
                        return <li key={accessory.name}>{accessory.name}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </CollapsibleGearDiv>
            );
          })}
        </div>
        {/* <h3>Electronics</h3>
        <div>
          {gearSelected.electronics.map((electronic, index) => {
            const addItem = function () {
              addElectronics(electronic);
            };
            const removeItem = function () {
              removeElectronics(electronic, index);
            };
            const description = checkForElectronicDescription(
              electronic.typeInformation
            );
            return (
              <CollapsibleGearDiv
                title={electronic.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                {description && <div>{description}</div>}
              </CollapsibleGearDiv>
            );
          })}
        </div>
        <h3>Electronic Accessories</h3>
        <div>
          {gearSelected.electronicAccessories.map(
            (electronicAccessory, index) => {
              const addItem = function () {
                addElectronicAccessories(electronicAccessory);
              };
              const removeItem = function () {
                removeElectronicAccessories(electronicAccessory, index);
              };
              const description = checkForElectronicAccessoryDescription(
                electronicAccessory.typeInformation
              );
              return (
                <CollapsibleGearDiv
                  title={electronicAccessory.name}
                  addItem={addItem}
                  removeItem={removeItem}
                >
                  {description && <div>{description}</div>}
                </CollapsibleGearDiv>
              );
            }
          )}
        </div>
        <h3>Other Gear</h3>
        <div>
          {gearSelected.otherGear.map((otherGear, index) => {
            const addItem = function () {
              addOtherGear(otherGear);
            };
            const removeItem = function () {
              removeOtherGear(otherGear, index);
            };
            return (
              <CollapsibleGearDiv
                title={otherGear.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{otherGear.description}</div>
              </CollapsibleGearDiv>
            );
          })}
        </div>
        <h3>Augmentation</h3>
        <div>
          {gearSelected.augmentations.map((augmentations, index) => {
            const addItem = function () {
              addAugmentations(augmentations);
            };
            const removeItem = function () {
              removeAugmentations(augmentations, index);
            };
            return (
              <CollapsibleGearDiv
                title={augmentations.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{augmentations.description}</div>
              </CollapsibleGearDiv>
            );
          })}
        </div>
        <h3>Magical Equipment</h3>
        <div>
          {gearSelected.magicalEquipment.map((magicalEquipment, index) => {
            const addItem = function () {
              addMagicalEquipment(magicalEquipment);
            };
            const removeItem = function () {
              removeMagicalEquipment(magicalEquipment, index);
            };
            return (
              <CollapsibleGearDiv
                title={magicalEquipment.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{magicalEquipment.description}</div>
              </CollapsibleGearDiv>
            );
          })}
        </div>
        <h3>Vehicles And Drones</h3>
        <div>
          {gearSelected.vehiclesAndDrones.map((vehiclesAndDrones, index) => {
            const addItem = function () {
              addVehiclesAndDrones(vehiclesAndDrones);
            };
            const removeItem = function () {
              removeVehiclesAndDrones(vehiclesAndDrones, index);
            };
            return (
              <CollapsibleGearDiv
                title={vehiclesAndDrones.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{vehiclesAndDrones.description}</div>
              </CollapsibleGearDiv>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

interface IWeaponDivProps {
  title: string;
  data: WeaponUnlinkedSummaryListType;
  weaponType: weaponTypeEnum;
  addWeapon: (weapon: WeaponUnlinkedSummaryType) => void;
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
          .filter((gear) => gear.typeInformation.type === weaponType)
          .map((weapon) => {
            const addItem = function () {
              addWeapon(weapon);
            };
            return (
              <li key={weaponType + weapon.name}>
                <CollapsibleGearDiv title={weapon.name} addItem={addItem}>
                  <div>{weapon.description}</div>
                </CollapsibleGearDiv>
                <div>{weapon.typeInformation.subtype}</div>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

// interface IMatrixDivProps {
//   title: string;
//   data: MatrixListType;
//   matrixWareType: matrixWareTypeEnum;
//   addElectronics: (electronic: MatrixType) => void;
// }

// const MatrixDiv = function ({
//   data,
//   matrixWareType,
//   title,
//   addElectronics,
// }: IMatrixDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter((gear) => gear.typeInformation.type === matrixWareType)
//           .map((electronic: MatrixType) => {
//             const addItem = function () {
//               addElectronics(electronic);
//             };
//             const description = checkForElectronicDescription(
//               electronic.typeInformation
//             );
//             return (
//               <li key={matrixWareType + electronic.name}>
//                 <div>{electronic.name}</div>
//                 <CollapsibleGearDiv title={electronic.name} addItem={addItem}>
//                   {description && <div>{description}</div>}
//                 </CollapsibleGearDiv>
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };

// interface IMatrixAccessoriesDivProps {
//   title: string;
//   data: MatrixAccessoriesListType;
//   matrixWareAccessoryType: matrixWareAccessoryTypeEnum;
//   addElectronicAccessories: (electronicAccessory: MatrixAccessoryType) => void;
// }

// const MatrixAccessoriesDiv = function ({
//   data,
//   matrixWareAccessoryType,
//   title,
//   addElectronicAccessories,
// }: IMatrixAccessoriesDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter(
//             (gear) => gear.typeInformation.type === matrixWareAccessoryType
//           )
//           .map((electronicAccessory) => {
//             const addItem = function () {
//               addElectronicAccessories(electronicAccessory);
//             };
//             const description = checkForElectronicAccessoryDescription(
//               electronicAccessory.typeInformation
//             );
//             return (
//               <li key={matrixWareAccessoryType + electronicAccessory.name}>
//                 <CollapsibleGearDiv
//                   title={electronicAccessory.name}
//                   addItem={addItem}
//                 >
//                   {description && <div>{description}</div>}
//                 </CollapsibleGearDiv>
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };

// interface IOtherGearDivProps {
//   title: string;
//   data: OtherGearListType;
//   otherWareType: otherWareTypeEnum;
//   addOtherGear: (other: OtherGearType) => void;
// }

// const OtherGearDiv = function ({
//   data,
//   otherWareType,
//   title,
//   addOtherGear,
// }: IOtherGearDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter((gear) => gear.typeInformation.type === otherWareType)
//           .map((otherWare) => {
//             const addItem = function () {
//               addOtherGear(otherWare);
//             };
//             return (
//               <li key={otherWareType + otherWare.name}>
//                 <CollapsibleGearDiv title={otherWare.name} addItem={addItem}>
//                   <div>{otherWare.description}</div>
//                 </CollapsibleGearDiv>
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };

// interface IAugmentationsDivProps {
//   title: string;
//   data: AugmentationListType;
//   augmentationType: augmentationTypeEnum;
//   addAugmentations: (augmentation: AugmentationType) => void;
// }

// const AugmentationsDiv = function ({
//   data,
//   augmentationType,
//   title,
//   addAugmentations,
// }: IAugmentationsDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter((gear) => gear.typeInformation.type === augmentationType)
//           .map((augmentation) => {
//             const addItem = function () {
//               addAugmentations(augmentation);
//             };
//             return (
//               <li key={augmentationType + augmentation.name}>
//                 <CollapsibleGearDiv title={augmentation.name} addItem={addItem}>
//                   <div>{augmentation.description}</div>
//                 </CollapsibleGearDiv>
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };

// interface IMagicalEquipmentDivProps {
//   title: string;
//   data: MagicGearListType;
//   magicalGearType: magicalGearTypeEnum;
//   addMagicalEquipment: (magicalItem: MagicGearType) => void;
// }

// const MagicalEquipmentDiv = function ({
//   data,
//   magicalGearType,
//   title,
//   addMagicalEquipment,
// }: IMagicalEquipmentDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter((gear) => gear.type === magicalGearType)
//           .map((magicalItem) => {
//             const addItem = function () {
//               addMagicalEquipment(magicalItem);
//             };
//             return (
//               <li key={magicalGearTypeEnum[magicalGearType] + magicalItem.name}>
//                 <CollapsibleGearDiv title={magicalItem.name} addItem={addItem}>
//                   <div>{magicalItem.description}</div>
//                 </CollapsibleGearDiv>
//                 {magicalItem.subtype && <div>{magicalItem.subtype}</div>}
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };

// interface IVehiclesAndDronesDivProps {
//   title: string;
//   data: VehiclesAndDronesListType;
//   vehicleAndDroneType: vehicleDroneTypeEnum;
//   addVehiclesAndDrones: (vehicleOrDrone: VehiclesAndDronesType) => void;
// }

// const VehiclesAndDronesDiv = function ({
//   data,
//   vehicleAndDroneType,
//   title,
//   addVehiclesAndDrones,
// }: IVehiclesAndDronesDivProps) {
//   return (
//     <CollapsibleDiv title={title}>
//       <ul>
//         {data
//           .filter((gear) => gear.type === vehicleAndDroneType)
//           .map((vehiclesOrDrone) => {
//             const addItem = function () {
//               addVehiclesAndDrones(vehiclesOrDrone);
//             };
//             return (
//               <li
//                 key={
//                   vehicleDroneTypeEnum[vehicleAndDroneType] +
//                   vehiclesOrDrone.name
//                 }
//               >
//                 <CollapsibleGearDiv
//                   title={vehiclesOrDrone.name}
//                   addItem={addItem}
//                 >
//                   <div>{vehiclesOrDrone.description}</div>
//                 </CollapsibleGearDiv>
//                 <div>{vehiclesOrDrone.subtype}</div>
//               </li>
//             );
//           })}
//       </ul>
//     </CollapsibleDiv>
//   );
// };
// function checkForElectronicAccessoryDescription(
//   typeInformation: electronicAccessoryTypeInformationType
// ) {
//   let description = undefined;
//   if (typeInformation.type === matrixWareAccessoryTypeEnum.Identification) {
//     const DescriptionInformationParsed =
//       IdentificationTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (typeInformation.type === matrixWareAccessoryTypeEnum.Tool) {
//     const DescriptionInformationParsed =
//       ToolTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (
//     typeInformation.type === matrixWareAccessoryTypeEnum.SecurityDevice
//   ) {
//     const DescriptionInformationParsed =
//       SecurityDeviceTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (
//     typeInformation.type === matrixWareAccessoryTypeEnum.OpticalDevice
//   ) {
//     const DescriptionInformationParsed =
//       OpticalDeviceTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (
//     typeInformation.type === matrixWareAccessoryTypeEnum.VisionEnhancement
//   ) {
//     const DescriptionInformationParsed =
//       VisionEnhancementTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (typeInformation.type === matrixWareAccessoryTypeEnum.AudioDevice) {
//     const DescriptionInformationParsed =
//       AudioDeviceTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   } else if (
//     typeInformation.type === matrixWareAccessoryTypeEnum.AudioEnhancement
//   ) {
//     const DescriptionInformationParsed =
//       AudioEnhancementTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   }
//   return description;
// }

// function checkForElectronicDescription(
//   typeInformation: electronicTypeInformationType
// ) {
//   let description = undefined;
//   if (typeInformation.type === matrixWareTypeEnum.CommunicationCountermeasure) {
//     const DescriptionInformationParsed =
//       RFIDTypeInformationSchema.safeParse(typeInformation);
//     if (DescriptionInformationParsed.success)
//       description = DescriptionInformationParsed.data.description;
//   }
//   return description;
// }
