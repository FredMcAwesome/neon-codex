import {
  augmentationTypeEnum,
  GearListSchema,
  magicalGearTypeEnum,
  MatrixType,
  matrixWareAccessoryTypeEnum,
  matrixWareTypeEnum,
  otherWareTypeEnum,
  vehicleDroneTypeEnum,
  WeaponListType,
  weaponTypeEnum,
} from "@shadowrun/common";
import type { GearListType } from "@shadowrun/common";
import { useQuery } from "@tanstack/react-query";
import { getGearList } from "../../utils/api.js";
import { useFetchWrapper } from "../../utils/authFetch.js";
import { MatrixListType } from "@shadowrun/common/src/serverResponse.js";
import {
  AugmentationListType,
  MagicGearListType,
  MatrixAccessoriesListType,
  OtherGearListType,
  VehiclesAndDronesListType,
} from "@shadowrun/common/src/schemas/gearSchemas.js";
import { CollapsibleDiv } from "../../utils/CollapsibleDiv.js";
import {
  AudioDeviceTypeInformationSchema,
  AudioEnhancementTypeInformationSchema,
  IdentificationTypeInformationSchema,
  OpticalDeviceTypeInformationSchema,
  RFIDTypeInformationSchema,
  SecurityDeviceTypeInformationSchema,
  ToolTypeInformationSchema,
  VisionEnhancementTypeInformationSchema,
} from "@shadowrun/common/src/schemas/electronicSchemas.js";

const fetchWrapper = useFetchWrapper();

async function fetchGear() {
  console.log("fetchGear");
  const response: Response = await fetchWrapper.get(getGearList);
  // https://tanstack.com/query/v4/docs/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const resJson: unknown | GearListType = await response.json();
  const parsedRes = GearListSchema.safeParse(resJson);
  if (parsedRes.success) {
    return parsedRes.data;
  } else {
    throw new Error(parsedRes.error.issues.toString());
  }
}

export const GearSelect = function () {
  const { data, error, isError, isLoading } = useQuery(["gear"], fetchGear);
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

  return (
    <div>
      <h1>Gear Selection</h1>
      <CollapsibleDiv title="Weapons">
        <div id="Weapons_Div">
          <WeaponDiv
            title={"Melee Weapons"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Melee}
          />
          <WeaponDiv
            title={"Projectile Weapons"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Projectile}
          />
          <WeaponDiv
            title={"Firearms"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Firearm}
          />
          <WeaponDiv
            title={"Explosives"}
            data={data.weapons}
            weaponType={weaponTypeEnum.Explosive}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Electronics">
        <div id="Matrix_Div">
          <MatrixDiv
            title={"Commlinks"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Commlink}
          />
          <MatrixDiv
            title={"Cyberdecks"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Cyberdeck}
          />
          <MatrixDiv
            title={"RFID Tags"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.RFIDTag}
          />
          <MatrixDiv
            title={"Communication and Countermeasures"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.CommunicationCountermeasure}
          />
          <MatrixDiv
            title={"Software"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Software}
          />
          <MatrixDiv
            title={"Skillsofts"}
            data={data.electronics}
            matrixWareType={matrixWareTypeEnum.Skillsoft}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Electronic Accessories">
        <div id="Matrix_Accessories_Div">
          <MatrixAccessoriesDiv
            title={"Cred Sticks"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.CredStick}
          />
          <MatrixAccessoriesDiv
            title={"Identification"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Identification}
          />
          <MatrixAccessoriesDiv
            title={"Tools"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Tool}
          />
          <MatrixAccessoriesDiv
            title={"Optical and Imaging Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.OpticalDevice}
          />
          <MatrixAccessoriesDiv
            title={"Vision Enhancements"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.VisionEnhancement
            }
          />
          <MatrixAccessoriesDiv
            title={"Audio Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.AudioDevice}
          />
          <MatrixAccessoriesDiv
            title={"Audio Enhancements"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.AudioEnhancement
            }
          />
          <MatrixAccessoriesDiv
            title={"Sensors"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.Sensor}
          />
          <MatrixAccessoriesDiv
            title={"Security Devices"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={matrixWareAccessoryTypeEnum.SecurityDevice}
          />
          <MatrixAccessoriesDiv
            title={"Breaking and Entering"}
            data={data.electronicAccessories}
            matrixWareAccessoryType={
              matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice
            }
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Other Gear">
        <div id="OtherGear_Div">
          <OtherGearDiv
            title={"Industrial Chemicals"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.IndustrialChemical}
          />
          <OtherGearDiv
            title={"Survival Gear"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.SurvivalGear}
          />
          <OtherGearDiv
            title={"Grapple Gun"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.GrappleGun}
          />
          <OtherGearDiv
            title={"Biotech"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.Biotech}
          />
          <OtherGearDiv
            title={"DocWagon Contract"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.DocWagonContract}
          />
          <OtherGearDiv
            title={"Slap Patches"}
            data={data.otherGear}
            otherWareType={otherWareTypeEnum.SlapPatch}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Augmentations">
        <div id="Augmentations_Div">
          <AugmentationsDiv
            title={"Headware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Headware}
          />
          <AugmentationsDiv
            title={"Eyeware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Eyeware}
          />
          <AugmentationsDiv
            title={"Earware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Earware}
          />
          <AugmentationsDiv
            title={"Bodyware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Bodyware}
          />
          <AugmentationsDiv
            title={"Cyberlimbs"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Cyberlimbs}
          />
          <AugmentationsDiv
            title={"Bioware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.Bioware}
          />
          <AugmentationsDiv
            title={"Cultured Bioware"}
            data={data.augmentations}
            augmentationType={augmentationTypeEnum.CulturedBioware}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Magical Equipment">
        <div id="Magical_Equipment_Div">
          <MagicalEquipmentDiv
            title={"Foci"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Focus}
          />
          <MagicalEquipmentDiv
            title={"Formulae"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Formula}
          />
          <MagicalEquipmentDiv
            title={"Magical Supply"}
            data={data.magicalEquipment}
            magicalGearType={magicalGearTypeEnum.Supply}
          />
        </div>
      </CollapsibleDiv>
      <CollapsibleDiv title="Vehicles and Drones">
        <div id="Vehicles_and_Drones">
          <VehiclesAndDronesDiv
            title={"Groundcraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Groundcrafts}
          />
          <VehiclesAndDronesDiv
            title={"Watercraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Watercrafts}
          />
          <VehiclesAndDronesDiv
            title={"Aircraft"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Aircrafts}
          />
          <VehiclesAndDronesDiv
            title={"Drones"}
            data={data.vehiclesAndDrones}
            vehicleAndDroneType={vehicleDroneTypeEnum.Drones}
          />
        </div>
      </CollapsibleDiv>
    </div>
  );
};

interface IWeaponDivProps {
  title: string;
  data: WeaponListType;
  weaponType: weaponTypeEnum;
}

const WeaponDiv = function ({ data, weaponType, title }: IWeaponDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.typeInformation.type === weaponType)
          .map((weapon) => {
            return (
              <li key={weaponType + weapon.name}>
                <CollapsibleDiv title={weapon.name}>
                  <div>{weapon.description}</div>
                </CollapsibleDiv>
                <div>{weapon.subtype}</div>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IMatrixDivProps {
  title: string;
  data: MatrixListType;
  matrixWareType: matrixWareTypeEnum;
}

const MatrixDiv = function ({ data, matrixWareType, title }: IMatrixDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.typeInformation.type === matrixWareType)
          .map((electronic: MatrixType) => {
            let description = undefined;
            if (
              electronic.typeInformation.type ===
              matrixWareTypeEnum.CommunicationCountermeasure
            ) {
              const DescriptionInformationParsed =
                RFIDTypeInformationSchema.safeParse(electronic.typeInformation);
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            }
            return (
              <li key={matrixWareType + electronic.name}>
                <div>{electronic.name}</div>
                <CollapsibleDiv title={electronic.name}>
                  {description && <div>{description}</div>}
                </CollapsibleDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IMatrixAccessoriesDivProps {
  title: string;
  data: MatrixAccessoriesListType;
  matrixWareAccessoryType: matrixWareAccessoryTypeEnum;
}

const MatrixAccessoriesDiv = function ({
  data,
  matrixWareAccessoryType,
  title,
}: IMatrixAccessoriesDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter(
            (gear) => gear.typeInformation.type === matrixWareAccessoryType
          )
          .map((electronicAccessory) => {
            let description = undefined;

            if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.Identification
            ) {
              const DescriptionInformationParsed =
                IdentificationTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.Tool
            ) {
              const DescriptionInformationParsed =
                ToolTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.SecurityDevice
            ) {
              const DescriptionInformationParsed =
                SecurityDeviceTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.OpticalDevice
            ) {
              const DescriptionInformationParsed =
                OpticalDeviceTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.VisionEnhancement
            ) {
              const DescriptionInformationParsed =
                VisionEnhancementTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.AudioDevice
            ) {
              const DescriptionInformationParsed =
                AudioDeviceTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            } else if (
              electronicAccessory.typeInformation.type ===
              matrixWareAccessoryTypeEnum.AudioEnhancement
            ) {
              const DescriptionInformationParsed =
                AudioEnhancementTypeInformationSchema.safeParse(
                  electronicAccessory.typeInformation
                );
              if (DescriptionInformationParsed.success)
                description = DescriptionInformationParsed.data.description;
            }
            return (
              <li key={matrixWareAccessoryType + electronicAccessory.name}>
                <CollapsibleDiv title={electronicAccessory.name}>
                  {description && <div>{description}</div>}
                </CollapsibleDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IOtherGearDivProps {
  title: string;
  data: OtherGearListType;
  otherWareType: otherWareTypeEnum;
}

const OtherGearDiv = function ({
  data,
  otherWareType,
  title,
}: IOtherGearDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.typeInformation.type === otherWareType)
          .map((otherWare) => {
            return (
              <li key={otherWareType + otherWare.name}>
                <CollapsibleDiv title={otherWare.name}>
                  <div>{otherWare.description}</div>
                </CollapsibleDiv>
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
}

const AugmentationsDiv = function ({
  data,
  augmentationType,
  title,
}: IAugmentationsDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.typeInformation.type === augmentationType)
          .map((augmentation) => {
            return (
              <li key={augmentationType + augmentation.name}>
                <CollapsibleDiv title={augmentation.name}>
                  <div>{augmentation.description}</div>
                </CollapsibleDiv>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IMagicalEquipmentDivProps {
  title: string;
  data: MagicGearListType;
  magicalGearType: magicalGearTypeEnum;
}

const MagicalEquipmentDiv = function ({
  data,
  magicalGearType,
  title,
}: IMagicalEquipmentDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.type === magicalGearType)
          .map((magicalItem) => {
            return (
              <li key={magicalGearTypeEnum[magicalGearType] + magicalItem.name}>
                <CollapsibleDiv title={magicalItem.name}>
                  <div>{magicalItem.description}</div>
                </CollapsibleDiv>
                {magicalItem.subtype && <div>{magicalItem.subtype}</div>}
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};

interface IVehiclesAndDronesDivProps {
  title: string;
  data: VehiclesAndDronesListType;
  vehicleAndDroneType: vehicleDroneTypeEnum;
}

const VehiclesAndDronesDiv = function ({
  data,
  vehicleAndDroneType,
  title,
}: IVehiclesAndDronesDivProps) {
  return (
    <CollapsibleDiv title={title}>
      <ul>
        {data
          .filter((gear) => gear.type === vehicleAndDroneType)
          .map((vehiclesOrDrone) => {
            return (
              <li
                key={
                  vehicleDroneTypeEnum[vehicleAndDroneType] +
                  vehiclesOrDrone.name
                }
              >
                <CollapsibleDiv title={vehiclesOrDrone.name}>
                  <div>{vehiclesOrDrone.description}</div>
                </CollapsibleDiv>
                <div>{vehiclesOrDrone.subtype}</div>
              </li>
            );
          })}
      </ul>
    </CollapsibleDiv>
  );
};
