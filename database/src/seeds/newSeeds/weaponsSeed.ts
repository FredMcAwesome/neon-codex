import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import {
  AccuracySchema,
  AmmunitionSchema,
  ArmourPenetrationSchema,
  DamageSchema,
  typeInformationSchema,
  UnlinkedAccessoryListSchema,
  WeaponUnlinkedSummaryListSchema,
  WeaponUnlinkedSummaryListType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import { AvailabilitySchema, weaponTypeEnum } from "@shadowrun/common";
import { IncludedWeaponAccessories } from "../../models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { Skills } from "../../models/chummerdb/skillModel.js";
import { WeaponAccessories } from "../../models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  FirearmWeapons,
  ProjectileWeapons,
  Explosives,
  Weapons,
} from "../../models/gear/combatGear/weaponModel.js";
import { z as zod } from "zod";
import {
  gearCategoryEnum,
  augmentationClassificationEnum,
  sourceBookEnum,
} from "@shadowrun/common/src/enums.js";
import { CostSchema } from "@shadowrun/common/src/schemas/commonSchema.js";

export const WeaponSummarySchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    typeInformation: typeInformationSchema,
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    availability: AvailabilitySchema,
    cost: CostSchema,
    allowedGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
    accessories: zod.optional(UnlinkedAccessoryListSchema),
    gears: zod.optional(UnlinkedAccessoryListSchema),
    allowAccessories: zod.boolean(),
    isCyberware: zod.boolean(),
    augmentationType: zod.nativeEnum(augmentationClassificationEnum),
    wireless: zod.optional(zod.string()),
    relatedSkill: zod.instanceof(Skills),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponSummaryType = zod.infer<typeof WeaponSummarySchema>;
const WeaponSummaryListSchema = zod.array(WeaponSummarySchema);
export type WeaponSummaryListType = zod.infer<typeof WeaponSummaryListSchema>;

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponAccessories: Array<WeaponAccessories>
): {
  stagedMeleeWeapons: Array<MeleeWeapons>;
  stagedFirearmWeapons: Array<FirearmWeapons>;
  stagedProjectileWeapons: Array<ProjectileWeapons>;
  stagedExplosiveWeapons: Array<Explosives>;
  stagedAccessories: Array<Array<IncludedWeaponAccessories>>;
} {
  console.log("getWeapons()");
  const currentPath = import.meta.url;

  let weaponsUnlinked: WeaponUnlinkedSummaryListType | undefined = undefined;
  const relativeConverterPath = "converter/jsonFiles/weapons.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const weaponListParsed = WeaponUnlinkedSummaryListSchema.safeParse(rawJson);
  if (weaponListParsed.success) {
    console.log("weapons all g");
    weaponsUnlinked = weaponListParsed.data;
  } else {
    console.log(weaponListParsed.error.errors[0]);
  }
  if (weaponsUnlinked === undefined) {
    assert(false);
  }
  const stagedMeleeWeapons: Array<MeleeWeapons> = [];
  const stagedFirearmWeapons: Array<FirearmWeapons> = [];
  const stagedProjectileWeapons: Array<ProjectileWeapons> = [];
  const stagedExplosiveWeapons: Array<Explosives> = [];
  let stagedAccessories: Array<Array<IncludedWeaponAccessories>> = [];

  weaponsUnlinked.forEach((weapon) => {
    let accessories: Array<IncludedWeaponAccessories> = [];
    console.log(`Weapon: ${weapon.name}, skill: ${weapon.relatedSkill}`);
    assert(stagedSkills.length > 0);
    const relatedSkill = stagedSkills.find(
      (skill) => skill.name == weapon.relatedSkill
    );
    assert(relatedSkill, `undefined name: ${weapon.relatedSkill}`);

    const linkedWeapon: WeaponSummaryType = {
      ...weapon,
      relatedSkill: relatedSkill,
    };

    let stagedWeapon:
      | MeleeWeapons
      | FirearmWeapons
      | ProjectileWeapons
      | Explosives;

    switch (linkedWeapon.typeInformation.type) {
      case weaponTypeEnum.Melee:
        stagedWeapon = new MeleeWeapons(linkedWeapon);
        stagedMeleeWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Firearm:
        stagedWeapon = new FirearmWeapons(linkedWeapon);
        stagedFirearmWeapons.push(new FirearmWeapons(linkedWeapon));
        break;
      case weaponTypeEnum.Projectile:
        stagedWeapon = new ProjectileWeapons(linkedWeapon);
        stagedProjectileWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Explosive:
        stagedWeapon = new Explosives(linkedWeapon);
        stagedExplosiveWeapons.push(stagedWeapon);
        break;
      default:
        assert(false);
    }
    if (weapon.accessories) {
      accessories = weapon.accessories.map((accessory) => {
        const relatedAccessory = stagedWeaponAccessories.find(
          (weaponAccessory) => accessory.name === weaponAccessory.name
        );
        console.log(stagedWeaponAccessories.map((accessory) => accessory.name));
        assert(
          relatedAccessory !== undefined,
          `undefined name: ${accessory.name}`
        );
        return new IncludedWeaponAccessories(
          // this 'as' is not ideal but need it until polymorphic relationships are added to mikro-orm
          stagedWeapon as Weapons,
          relatedAccessory,
          accessory.rating
        );
      });
      stagedAccessories.push(accessories);
    }
  });

  return {
    stagedMeleeWeapons: stagedMeleeWeapons,
    stagedFirearmWeapons: stagedFirearmWeapons,
    stagedProjectileWeapons: stagedProjectileWeapons,
    stagedExplosiveWeapons: stagedExplosiveWeapons,
    stagedAccessories: stagedAccessories,
  };
};
