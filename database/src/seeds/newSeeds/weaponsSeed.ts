import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import {
  ExplosiveWeaponSchema,
  FirearmWeaponSchema,
  MeleeWeaponSchema,
  ProjectileWeaponSchema,
  WeaponSummaryListSchema,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type { WeaponSummaryListType } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { Skills } from "../../models/chummerdb/skillModel.js";
import {
  MeleeWeapons,
  FirearmWeapons,
  ProjectileWeapons,
  Explosives,
  Weapons,
} from "../../models/gear/combatGear/weaponModel.js";
import { z as zod } from "zod";
import { weaponTypeEnum } from "@shadowrun/common/build/enums.js";
import { WeaponRanges } from "../../models/gear/combatGear/helperTables/weaponRangeModel.js";
import { ref } from "@mikro-orm/postgresql";
export const WeaponDBSchema = zod
  .discriminatedUnion("type", [
    FirearmWeaponSchema.omit({ relatedSkill: true }),
    MeleeWeaponSchema.omit({ relatedSkill: true }),
    ProjectileWeaponSchema.omit({ relatedSkill: true }),
    ExplosiveWeaponSchema.omit({ relatedSkill: true }),
  ])
  .and(
    zod
      .object({
        relatedSkill: zod.instanceof(Skills),
      })
      .strict()
  );
export type WeaponDBType = zod.infer<typeof WeaponDBSchema>;

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponRanges: Array<WeaponRanges>
): {
  unlinkedWeapons: WeaponSummaryListType;
  stagedWeapons: Array<Weapons>;
} {
  const currentPath = import.meta.url;

  let unlinkedWeapons: WeaponSummaryListType;
  const relativeConverterPath = "converter/jsonFiles/weapons.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const weaponListParsed = WeaponSummaryListSchema.safeParse(rawJson);
  if (weaponListParsed.success) {
    console.log("weapons all g");
    unlinkedWeapons = weaponListParsed.data;
  } else {
    console.log(weaponListParsed.error.errors[0]);
    assert(false, "weaponsUnlinked is undefined");
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

    let referencedSkill = ref(Skills, relatedSkill);

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
