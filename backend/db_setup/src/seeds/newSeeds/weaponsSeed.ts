import { Skills } from "../../../../src/models/chummerdb/skillModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import {
  WeaponPreDBSummaryListSchema,
  WeaponPreDBSummaryListType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import {
  AccessoryListType,
  Explosives,
  FirearmWeapons,
  MeleeWeapons,
  ProjectileWeapons,
  WeaponSummaryType,
} from "../../../../src/models/gear/combatGear/weaponModel.js";
import { weaponTypeEnum } from "@shadowrun/common";
import { WeaponAccessories } from "../../../../src/models/gear/combatGear/weaponAccessoryModel.js";

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponAccessories: Array<WeaponAccessories>
): Array<MeleeWeapons | FirearmWeapons | ProjectileWeapons | Explosives> {
  console.log("getWeapons()");
  const currentPath = import.meta.url;

  let weapons: WeaponPreDBSummaryListType | undefined = undefined;
  const jsonString = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../gear/combatGear/weapons.json"
    ),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const weaponListParsed = WeaponPreDBSummaryListSchema.safeParse(rawJson);
  if (weaponListParsed.success) {
    console.log("weapons all g");
    weapons = weaponListParsed.data;
  } else {
    console.log(weaponListParsed.error.errors[0]);
  }
  if (weapons === undefined) {
    assert(false);
  }
  const stagedWeapons: Array<
    MeleeWeapons | FirearmWeapons | ProjectileWeapons | Explosives
  > = [];
  weapons.forEach((weapon) => {
    console.log(`Weapon: ${weapon.name}, skill: ${weapon.relatedSkill}`);
    assert(stagedSkills.length > 0);
    const relatedSkill = stagedSkills.filter(
      (skill) => skill.name == weapon.relatedSkill
    );
    assert(
      relatedSkill.length == 1,
      `Length: ${relatedSkill.length}, name: ${weapon.relatedSkill}`
    );

    let accessories: AccessoryListType | undefined = [];
    if (weapon.accessories) {
      accessories = weapon.accessories.map((accessory) => {
        const relatedAccessory = stagedWeaponAccessories.filter(
          (weaponAccessory) => accessory.name === weaponAccessory.name
        );
        console.log(stagedWeaponAccessories.map((accessory) => accessory.name));
        assert(
          relatedAccessory.length == 1,
          `Length: ${relatedAccessory.length}, name: ${accessory.name}`
        );
        return { ...accessory, name: relatedAccessory[0] };
      });
    }

    const linkedWeapon: WeaponSummaryType = {
      ...weapon,
      relatedSkill: relatedSkill[0],
      accessories: accessories,
    };
    switch (linkedWeapon.typeInformation.type) {
      case weaponTypeEnum.Melee:
        stagedWeapons.push(new MeleeWeapons(linkedWeapon));
        break;
      case weaponTypeEnum.Firearm:
        stagedWeapons.push(new FirearmWeapons(linkedWeapon));
        break;
      case weaponTypeEnum.Projectile:
        stagedWeapons.push(new ProjectileWeapons(linkedWeapon));
        break;
      case weaponTypeEnum.Explosive:
        stagedWeapons.push(new Explosives(linkedWeapon));
        break;
    }
  });
  return stagedWeapons;
};
