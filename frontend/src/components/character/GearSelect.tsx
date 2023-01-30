import {
  augmentationTypeEnum,
  GearListSchema,
  magicalGearTypeEnum,
  matrixWareAccessoryTypeEnum,
  matrixWareTypeEnum,
  otherWareTypeEnum,
  vehicleDroneTypeEnum,
  weaponTypeEnum,
} from "@shadowrun/common";
import type { GearListType } from "@shadowrun/common";
import { useQuery } from "@tanstack/react-query";
import { getGearList } from "../../utils/api.js";
import { useFetchWrapper } from "../../utils/authFetch.js";

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
      <h2>Weapons</h2>
      <div id="Weapons_Div">
        <h3>Melee Weapons</h3>
        <ul>
          {data.weapons
            .filter(
              (gear) => gear.typeInformation.type === weaponTypeEnum.Melee
            )
            .map((weapon) => {
              return (
                <li key={"weaponTypeEnum.Melee" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Projectile Weapons</h3>
        <ul>
          {data.weapons
            .filter(
              (gear) => gear.typeInformation.type === weaponTypeEnum.Projectile
            )
            .map((weapon) => {
              return (
                <li key={"weaponTypeEnum.Projectile" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Firearms</h3>
        <ul>
          {data.weapons
            .filter(
              (gear) => gear.typeInformation.type === weaponTypeEnum.Firearm
            )
            .map((weapon) => {
              return (
                <li key={"weaponTypeEnum.Firearm" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Explosives</h3>
        <ul>
          {data.weapons
            .filter(
              (gear) => gear.typeInformation.type === weaponTypeEnum.Explosive
            )
            .map((weapon) => {
              return (
                <li key={"weaponTypeEnum.Explosive" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
      </div>
      <h2>Electronics</h2>
      <div id="Matrix_Div">
        <h3>Commlinks</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareTypeEnum.Commlink
            )
            .map((electronic) => {
              return (
                <li key={"matrixWareTypeEnum.Commlink" + electronic.name}>
                  {electronic.name}
                </li>
              );
            })}
        </ul>
        <h3>Cyberdecks</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareTypeEnum.Cyberdeck
            )
            .map((electronic) => {
              return (
                <li key={"matrixWareTypeEnum.Cyberdeck" + electronic.name}>
                  {electronic.name}
                </li>
              );
            })}
        </ul>
        <h3>RFID Tags</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) => gear.typeInformation.type === matrixWareTypeEnum.RFIDTag
            )
            .map((electronic) => {
              return (
                <li key={"matrixWareTypeEnum.RFIDTag" + electronic.name}>
                  {electronic.name}
                </li>
              );
            })}
        </ul>
        <h3>Communication and Countermeasures</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareTypeEnum.CommunicationCountermeasure
            )
            .map((electronic) => {
              return (
                <li
                  key={
                    "matrixWareTypeEnum.CommunicationCountermeasure" +
                    electronic.name
                  }
                >
                  {electronic.name}
                </li>
              );
            })}
        </ul>
        <h3>Software</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareTypeEnum.Software
            )
            .map((electronic) => {
              return (
                <li key={"matrixWareTypeEnum.Software" + electronic.name}>
                  {electronic.name}
                </li>
              );
            })}
        </ul>
        <h3>Skillsofts</h3>
        <ul>
          {data.electronics
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareTypeEnum.Skillsoft
            )
            .map((electronic) => {
              return (
                <li key={"matrixWareTypeEnum.Skillsoft" + electronic.name}>
                  {electronic.name}
                </li>
              );
            })}
        </ul>
      </div>
      <div id="Matrix_Accessories_Div">
        <h3>Cred Sticks</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.CredStick
            )
            .map((weapon) => {
              return (
                <li key={"matrixWareAccessoryTypeEnum.CredStick" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Identification</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.Identification
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.Identification" + weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Tools</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareAccessoryTypeEnum.Tool
            )
            .map((weapon) => {
              return (
                <li key={"matrixWareAccessoryTypeEnum.Tool" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Optical and Imaging Devices</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.OpticalDevice
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.OpticalDevice" + weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Vision Enhancements</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.VisionEnhancement
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.VisionEnhancement" +
                    weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Audio Devices</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.AudioDevice
            )
            .map((weapon) => {
              return (
                <li
                  key={"matrixWareAccessoryTypeEnum.AudioDevice" + weapon.name}
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Audio Enhancements</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.AudioEnhancement
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.AudioEnhancement" + weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Sensors</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type === matrixWareAccessoryTypeEnum.Sensor
            )
            .map((weapon) => {
              return (
                <li key={"matrixWareAccessoryTypeEnum.Sensor" + weapon.name}>
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Security Devices</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.SecurityDevice
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.SecurityDevice" + weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
        <h3>Breaking and Entering</h3>
        <ul>
          {data.electronicAccessories
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice
            )
            .map((weapon) => {
              return (
                <li
                  key={
                    "matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice" +
                    weapon.name
                  }
                >
                  {weapon.name}
                </li>
              );
            })}
        </ul>
      </div>
      <h2>Industrial Chemicals</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) =>
              gear.typeInformation.type ===
              otherWareTypeEnum.IndustrialChemicals
          )
          .map((augmentation) => {
            return (
              <li
                key={
                  "otherWareTypeEnum.IndustrialChemicals" + augmentation.name
                }
              >
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>Survival Gear</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) =>
              gear.typeInformation.type === otherWareTypeEnum.SurvivalGear
          )
          .map((augmentation) => {
            return (
              <li key={"otherWareTypeEnum.SurvivalGear" + augmentation.name}>
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>Grapple Gun</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) => gear.typeInformation.type === otherWareTypeEnum.GrappleGun
          )
          .map((augmentation) => {
            return (
              <li key={"otherWareTypeEnum.GrappleGun" + augmentation.name}>
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>Biotech</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) => gear.typeInformation.type === otherWareTypeEnum.Biotech
          )
          .map((augmentation) => {
            return (
              <li key={"otherWareTypeEnum.Biotech" + augmentation.name}>
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>DocWagon Contract</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) =>
              gear.typeInformation.type === otherWareTypeEnum.DocWagonContract
          )
          .map((augmentation) => {
            return (
              <li
                key={"otherWareTypeEnum.DocWagonContract" + augmentation.name}
              >
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>Slap Patches</h2>
      <ul>
        {data.otherGear
          .filter(
            (gear) =>
              gear.typeInformation.type === otherWareTypeEnum.SlapPatches
          )
          .map((augmentation) => {
            return (
              <li key={"otherWareTypeEnum.SlapPatches" + augmentation.name}>
                {augmentation.name}
              </li>
            );
          })}
      </ul>
      <h2>Augmentations</h2>
      <div id="Augmentations_Div">
        <h3>Headware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Headware
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Headware" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Eyeware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Eyeware
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Eyeware" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Earware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Earware
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Earware" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Bodyware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Bodyware
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Bodyware" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Cyberlimbs</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Cyberlimbs
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Cyberlimbs" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Bioware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type === augmentationTypeEnum.Bioware
            )
            .map((augmentation) => {
              return (
                <li key={"augmentationTypeEnum.Bioware" + augmentation.name}>
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
        <h3>Cultured Bioware</h3>
        <ul>
          {data.augmentations
            .filter(
              (gear) =>
                gear.typeInformation.type ===
                augmentationTypeEnum.CulturedBioware
            )
            .map((augmentation) => {
              return (
                <li
                  key={
                    "augmentationTypeEnum.CulturedBioware" + augmentation.name
                  }
                >
                  {augmentation.name}
                </li>
              );
            })}
        </ul>
      </div>
      <h2>Magical Equipment</h2>
      <div>
        <h3>Foci</h3>
        <ul>
          {data.magicalEquipment
            .filter(
              (gear) => gear.typeInformation.type === magicalGearTypeEnum.Focus
            )
            .map((magicalItem) => {
              return (
                <li key={"magicalGearTypeEnum.Focus" + magicalItem.name}>
                  {magicalItem.name}
                </li>
              );
            })}
        </ul>
        <h3>Formulae</h3>
        <ul>
          {data.magicalEquipment
            .filter(
              (gear) =>
                gear.typeInformation.type === magicalGearTypeEnum.Formula
            )
            .map((magicalItem) => {
              return (
                <li key={"magicalGearTypeEnum.Formula" + magicalItem.name}>
                  {magicalItem.name}
                </li>
              );
            })}
        </ul>
        <h3>Magical Supply</h3>
        <ul>
          {data.magicalEquipment
            .filter(
              (gear) => gear.typeInformation.type === magicalGearTypeEnum.Supply
            )
            .map((magicalItem) => {
              return (
                <li key={"magicalGearTypeEnum.Supply" + magicalItem.name}>
                  {magicalItem.name}
                </li>
              );
            })}
        </ul>
      </div>
      <h2>Vehicles and Drones</h2>
      <div>
        <h3>Groundcraft</h3>
        <ul>
          {data.vehiclesAndDrones
            .filter((gear) => gear.type === vehicleDroneTypeEnum.Groundcrafts)
            .map((vehicle) => {
              return (
                <li key={"vehicleDroneTypeEnum.Groundcrafts" + vehicle.name}>
                  {vehicle.name}
                </li>
              );
            })}
        </ul>
        <h3>Watercraft</h3>
        <ul>
          {data.vehiclesAndDrones
            .filter((gear) => gear.type === vehicleDroneTypeEnum.Watercrafts)
            .map((vehicle) => {
              return (
                <li key={"vehicleDroneTypeEnum.Watercrafts" + vehicle.name}>
                  {vehicle.name}
                </li>
              );
            })}
        </ul>
        <h3>Aircraft</h3>
        <ul>
          {data.vehiclesAndDrones
            .filter((gear) => gear.type === vehicleDroneTypeEnum.Aircrafts)
            .map((vehicle) => {
              return (
                <li key={"vehicleDroneTypeEnum.Aircrafts" + vehicle.name}>
                  {vehicle.name}
                </li>
              );
            })}
        </ul>
        <h3>Drones</h3>
        <ul>
          {data.vehiclesAndDrones
            .filter((gear) => gear.type === vehicleDroneTypeEnum.Drones)
            .map((drone) => {
              return (
                <li key={"vehicleDroneTypeEnum.Drones" + drone.name}>
                  {drone.name}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
