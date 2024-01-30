import { CollapsibleDiv } from "../../utils/CollapsibleDiv.js";
import { CollapsibleGearDiv } from "./GearHelper.js";
import { costCalculation } from "../../utils/calculations.js";
import type {
  CostWeaponType,
  WeaponSummaryListType,
  WeaponSummaryType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { formatDamage } from "@shadowrun/common/build/formatters/weaponFormatter.js";
import { trpc } from "../../utils/trpc.js";
import uniqid from "uniqid";
import { weaponTypeEnum } from "@shadowrun/common/build/enums.js";
import type { EquipmentListType } from "@shadowrun/common/build/schemas/equipmentSchemas.js";

interface IProps {
  equipmentSelected: EquipmentListType;
  setEquipmentSelected: (loadingEquipmentSelected: EquipmentListType) => void;
  nuyen: number;
  setNuyen: (nuyen: number) => void;
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

  // const addGear = function (other: GearType) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.otherGear.push(other);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(other.cost));
  // };
  // const removeGear = function (other: GearType, index: number) {
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
  // const addVehicles = function (
  //   vehicle: VehiclesType
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   gear.vehicles.push(vehicle);
  //   props.setGearSelected(gear);
  //   props.setNuyen(props.nuyen - costCalculation(vehicle.cost));
  // };
  // const removeVehicles = function (
  //   vehicle: VehiclesType,
  //   index: number
  // ) {
  //   const gear = Object.assign({}, gearSelected);
  //   if (gear.vehicles[index] === vehicle) {
  //     gear.vehicles.splice(index, 1);
  //     props.setGearSelected(gear);
  //     props.setNuyen(props.nuyen + costCalculation(vehicle.cost));
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
      {/* <CollapsibleDiv title="Gear">
        <div id="Gear_Div">
          <GearDiv
            title={"Industrial Chemicals"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.IndustrialChemical}
            addGear={addGear}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Augmentations">
        <div id="Augmentations_Div">
          <AugmentationsDiv
            title={"Cyberware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Cyberware}
            addAugmentations={addAugmentations}
          />
          <AugmentationsDiv
            title={"Bioware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Bioware}
            addAugmentations={addAugmentations}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicles and Drones">
        <div id="Vehicles">
          <VehiclesDiv
            title={"Groundcraft"}
            data={data.vehicles}
            vehicleType={vehicleTypeEnum.Groundcrafts}
            addVehicles={addVehicles}
          />
          <VehiclesDiv
            title={"Watercraft"}
            data={data.vehicles}
            vehicleType={vehicleTypeEnum.Watercrafts}
            addVehicles={addVehicles}
          />
          <VehiclesDiv
            title={"Aircraft"}
            data={data.vehicles}
            vehicleType={vehicleTypeEnum.Aircrafts}
            addVehicles={addVehicles}
          />
          <VehiclesDiv
            title={"Drones"}
            data={data.vehicles}
            vehicleType={vehicleTypeEnum.Drones}
            addVehicles={addVehicles}
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
          {equipmentSelected.weapons.map((weapon, index) => {
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
                key={uniqid()}
              >
                <div>{weapon.description}</div>
                {weapon.accessories && (
                  <div>
                    <span>Accessories:</span>
                    <ul>
                      {weapon.accessories.map((accessory) => {
                        return <li key={uniqid()}>{accessory.name}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </CollapsibleGearDiv>
            );
          })}
        </div>
        {/* 
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
        <h3>Vehicles</h3>
        <div>
          {gearSelected.vehicles.map((vehicles, index) => {
            const addItem = function () {
              addVehicles(vehicles);
            };
            const removeItem = function () {
              removeVehicles(vehicles, index);
            };
            return (
              <CollapsibleGearDiv
                title={vehicles.name}
                addItem={addItem}
                removeItem={removeItem}
              >
                <div>{vehicles.description}</div>
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
            const addItem = function () {
              addWeapon(weapon);
            };
            return (
              <li key={uniqid()}>
                <CollapsibleGearDiv title={weapon.name} addItem={addItem}>
                  <div>
                    <div>{weapon.description}</div>
                    <div>Damage: {formatDamage(weapon.damage)}</div>
                  </div>
                </CollapsibleGearDiv>
                <div>{weapon.subtype}</div>
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
