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
import type {
  WeaponSummaryListType,
  WeaponSummaryType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { IncludedWeaponAccessories } from "../../models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { Skills } from "../../models/chummerdb/skillModel.js";
import { WeaponAccessories } from "../../models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  FirearmWeapons,
  ProjectileWeapons,
  Explosives,
  Weapons,
  RangedWeapons,
} from "../../models/gear/combatGear/weaponModel.js";
import { z as zod } from "zod";
import { weaponTypeEnum } from "@shadowrun/common/build/enums.js";
import { WeaponRanges } from "../../models/gear/combatGear/helperTables/weaponRangeModel.js";
import { WeaponRangeLinks } from "../../models/chummerdb/customTables/weaponRangeLinkModel.js";

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

const convertWeapon = function (
  weapon: WeaponSummaryType,
  relatedSkill: Skills
) {
  return {
    ...weapon,
    relatedSkill: relatedSkill,
  };
};

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponRanges: Array<WeaponRanges>,
  stagedWeaponAccessories: Array<WeaponAccessories>
): {
  weaponsUnlinked: WeaponSummaryListType;
  stagedWeapons: Array<Weapons>;
  stagedAccessories: Array<Array<IncludedWeaponAccessories>>;
  stagedRanges: Array<Array<WeaponRangeLinks>>;
} {
  const currentPath = import.meta.url;

  let weaponsUnlinked: WeaponSummaryListType | undefined = undefined;
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
    weaponsUnlinked = weaponListParsed.data;
  } else {
    console.log(weaponListParsed.error.errors[0]);
  }
  if (weaponsUnlinked === undefined) {
    assert(false, "weaponsUnlinked is undefined");
  }
  const stagedWeapons: Array<Weapons> = [];
  let stagedIncludedAccessories: Array<Array<IncludedWeaponAccessories>> = [];
  let stagedLinkedRanges: Array<Array<WeaponRangeLinks>> = [];

  assert(stagedSkills.length > 0, "stagedSkills.length = 0");
  assert(stagedWeaponRanges.length > 0, "stagedWeaponRanges.length = 0");
  weaponsUnlinked.forEach((weapon) => {
    let accessories: Array<IncludedWeaponAccessories> = [];
    // console.log(`Weapon: ${weapon.name}, skill: ${weapon.relatedSkill}`);
    const relatedSkill = stagedSkills.find(
      (skill) => skill.name == weapon.relatedSkill
    );
    assert(
      relatedSkill !== undefined,
      `undefined relatedSkill: ${weapon.relatedSkill}`
    );

    let stagedWeapon: Weapons;

    const linkedWeapon = convertWeapon(weapon, relatedSkill);

    switch (linkedWeapon.type) {
      case weaponTypeEnum.Melee:
        stagedWeapon = new MeleeWeapons(linkedWeapon);
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Firearm:
        stagedWeapon = new FirearmWeapons(linkedWeapon);
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Projectile:
        stagedWeapon = new ProjectileWeapons(linkedWeapon);
        stagedWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Explosive:
        stagedWeapon = new Explosives(linkedWeapon);
        stagedWeapons.push(stagedWeapon);
        break;
    }
    if (weapon.accessories) {
      accessories = weapon.accessories.map((accessory) => {
        const relatedAccessory = stagedWeaponAccessories.find(
          (weaponAccessory) => accessory.name === weaponAccessory.name
        );
        assert(
          relatedAccessory !== undefined,
          `undefined accessory name: ${accessory.name}`
        );
        return new IncludedWeaponAccessories(
          // used to have an 'as Weapons' which we wanted until polymorphic relationships are added to mikro-orm
          // however decided to change base type instead
          stagedWeapon,
          relatedAccessory,
          accessory.rating
        );
      });
      stagedIncludedAccessories.push(accessories);
    }

    if ("rangeList" in weapon) {
      const rangeList = weapon.rangeList;
      assert(rangeList.length > 0, "rangeList.length = 0");
      const relatedRanges = rangeList.map((currentRange) => {
        // console.log(`Range: ${currentRange}`);
        const foundRange = stagedWeaponRanges.find(
          (range) => range.name == currentRange
        );
        assert(foundRange !== undefined, `undefined range: ${currentRange}`);
        assert(
          stagedWeapon instanceof RangedWeapons,
          `Assertion to type narrow`
        );
        return new WeaponRangeLinks(foundRange, stagedWeapon);
      });
      stagedLinkedRanges.push(relatedRanges);
    }
  });
  // console.log(stagedWeaponAccessories.map((accessory) => accessory.name));

  return {
    weaponsUnlinked: weaponsUnlinked,
    stagedWeapons: stagedWeapons,
    stagedAccessories: stagedIncludedAccessories,
    stagedRanges: stagedLinkedRanges,
  };
};
