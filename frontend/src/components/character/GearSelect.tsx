import { WeaponListSchema, weaponTypeEnum } from "@shadowrun/common";
import type { WeaponListType } from "@shadowrun/common";
import { useQuery } from "@tanstack/react-query";
import { getWeaponList } from "../../utils/api.js";
import { useFetchWrapper } from "../../utils/authFetch.js";

const fetchWrapper = useFetchWrapper();

async function fetchGear() {
  console.log("fetchGear");
  const response: Response = await fetchWrapper.get(getWeaponList);
  // https://tanstack.com/query/v4/docs/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const resJson: unknown | WeaponListType = await response.json();
  const parsedRes = WeaponListSchema.safeParse(resJson);
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
      <h3>Melee Weapons</h3>
      <ul>
        {data
          .filter((gear) => gear.type === weaponTypeEnum.Melee)
          .map((weapon) => {
            return <li key={weapon.name}>{weapon.name}</li>;
          })}
      </ul>
      <h3>Projectile Weapons</h3>
      <ul>
        {data
          .filter((gear) => gear.type === weaponTypeEnum.Projectile)
          .map((weapon) => {
            return <li key={weapon.name}>{weapon.name}</li>;
          })}
      </ul>
      <h3>Firearms</h3>
      <ul>
        {data
          .filter((gear) => gear.type === weaponTypeEnum.Firearm)
          .map((weapon) => {
            return <li key={weapon.name}>{weapon.name}</li>;
          })}
      </ul>
    </div>
  );
};
