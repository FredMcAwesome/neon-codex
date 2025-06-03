import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import {
  ExplosiveWeaponSchema,
  FirearmWeaponSchema,
  MeleeWeaponSchema,
  ProjectileWeaponSchema,
  WeaponListSchema,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import type { WeaponListType } from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import { weaponTypeEnum } from "@neon-codex/common/build/enums.js";
import { ref } from "@mikro-orm/postgresql";
import { Skills } from "../../models/rpg/abilities/skillModel.js";
import { WeaponRanges } from "../../models/rpg/equipment/combat/helperTables/weaponRangeModel.js";
import {
  Weapons,
  MeleeWeapons,
  FirearmWeapons,
  ProjectileWeapons,
  Explosives,
} from "../../models/rpg/equipment/combat/weaponModel.js";
import { type } from "arktype";
export const WeaponDBSchema = type
  .or(
    FirearmWeaponSchema.omit("relatedSkill"),
    MeleeWeaponSchema.omit("relatedSkill"),
    ProjectileWeaponSchema.omit("relatedSkill"),
    ExplosiveWeaponSchema.omit("relatedSkill")
  )
  .and({
    relatedSkill: type.instanceOf(Skills),
  });
export type WeaponDBType = typeof WeaponDBSchema.infer;

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponRanges: Array<WeaponRanges>
): {
  unlinkedWeapons: WeaponListType;
  stagedWeapons: Array<Weapons>;
} {
  const currentPath = import.meta.url;

  let unlinkedWeapons: WeaponListType;
  const relativeConverterPath = "converter/jsonFiles/weapons.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const weaponListParsed = WeaponListSchema(rawJson);
  if (weaponListParsed instanceof type.errors) {
    console.log(weaponListParsed.summary);
    assert(false, "weaponsUnlinked is undefined");
  } else {
    console.log("weapons all g");
    unlinkedWeapons = weaponListParsed;
  }
  const stagedWeapons: Array<Weapons> = [];

  assert(stagedSkills.length > 0, "stagedSkills.length = 0");
  assert(stagedWeaponRanges.length > 0, "stagedWeaponRanges.length = 0");
  unlinkedWeapons.forEach((weapon) => {
    // console.log(`Weapon: ${weapon.name}, skill: ${weapon.relatedSkill}`);
    const relatedSkill = stagedSkills.find(
      (skill) => skill.name == weapon.relatedSkill
    );
    assert(
      relatedSkill !== undefined,
      `undefined relatedSkill: ${weapon.relatedSkill}`
    );

    const referencedSkill = ref(Skills, relatedSkill);

    let stagedWeapon: Weapons;

    switch (weapon.type) {
      case weaponTypeEnum.Melee:
        stagedWeapon = new MeleeWeapons(weapon, referencedSkill);
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Firearm:
        stagedWeapon = new FirearmWeapons(weapon, referencedSkill);
        assert(weapon.rangeList.length > 0);
        for (const range of weapon.rangeList) {
          const stagedRange = stagedWeaponRanges.find(
            (weaponRange) => weaponRange.name === range
          );
          assert(stagedRange !== undefined, `Range undefined: ${range}`);
        }
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Projectile:
        stagedWeapon = new ProjectileWeapons(weapon, referencedSkill);
        assert(weapon.rangeList.length > 0);
        for (const range of weapon.rangeList) {
          const stagedRange = stagedWeaponRanges.find(
            (weaponRange) => weaponRange.name === range
          );
          assert(stagedRange !== undefined, `Range undefined: ${range}`);
        }
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Explosive:
        stagedWeapon = new Explosives(weapon, referencedSkill);
        stagedWeapons.push(stagedWeapon);
        break;
    }
  });

  return {
    unlinkedWeapons,
    stagedWeapons,
  };
};
