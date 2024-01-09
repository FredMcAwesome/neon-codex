import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import {
  AccuracySchema,
  AmmunitionSchema,
  ArmourPenetrationSchema,
  DamageSchema,
  UnlinkedAccessoryListSchema,
  FirearmOptionsSchema,
  MeleeOptionsSchema,
  AvailabilityWeaponSchema,
  CostWeaponSchema,
  AccessoryMountSchema,
  WeaponUnlinkedSummaryListSchema,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type {
  WeaponUnlinkedSummaryListType,
  WeaponUnlinkedSummaryType,
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
} from "../../models/gear/combatGear/weaponModel.js";
import { z as zod } from "zod";
import {
  augmentationClassificationEnum,
  sourceBookEnum,
  explosiveTypeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import { WeaponRanges } from "../../models/gear/combatGear/helperTables/weaponRangeModel.js";
import { WeaponRangeLinks } from "../../models/chummerdb/customTables/weaponRangeLinkModel.js";
import { RequirementsSchema } from "@shadowrun/common/build/schemas/shared/requiredSchemas.js";
import { AllowedGearSchema } from "@shadowrun/common/build/schemas/commonSchemas.js";

const LimitedWeaponTypeInformationSchema = zod.discriminatedUnion("type", [
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Melee),
      subtype: zod.nativeEnum(meleeWeaponTypeEnum),
      meleeOptions: MeleeOptionsSchema,
    })
    .strict(),
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Projectile),
      subtype: zod.nativeEnum(projectileWeaponTypeEnum),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Firearm),
      subtype: zod.nativeEnum(firearmWeaponTypeEnum),
      firearmOptions: FirearmOptionsSchema,
    })
    .strict(),
  zod
    .object({
      type: zod.literal(weaponTypeEnum.Explosive),
      subtype: zod.nativeEnum(explosiveTypeEnum),
    })
    .strict(),
]);

export const WeaponSummarySchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    typeInformation: LimitedWeaponTypeInformationSchema,
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    availability: AvailabilityWeaponSchema,
    cost: CostWeaponSchema,
    allowedGear: zod.optional(AllowedGearSchema),
    gears: zod.optional(UnlinkedAccessoryListSchema),
    allowAccessories: zod.boolean(),
    isCyberware: zod.boolean(),
    userSelectable: zod.optional(zod.literal(false)),
    augmentationClassification: zod.nativeEnum(augmentationClassificationEnum),
    addWeapons: zod.optional(zod.array(zod.string())),
    hostWeaponRequirements: zod.optional(
      zod
        .object({
          weaponRequirements: zod.optional(RequirementsSchema),
          hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
        })
        .strict()
    ),
    relatedSkill: zod.instanceof(Skills),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponSummaryType = zod.infer<typeof WeaponSummarySchema>;
const WeaponSummaryListSchema = zod.array(WeaponSummarySchema);
export type WeaponSummaryListType = zod.infer<typeof WeaponSummaryListSchema>;

const convertWeapon = function (
  weapon: WeaponUnlinkedSummaryType,
  relatedSkill: Skills
): WeaponSummaryType {
  const initialTypeInformation = weapon.typeInformation;
  let typeInfo;
  if ("rangeList" in initialTypeInformation) {
    const { rangeList, ...typeInformation } = initialTypeInformation;
    typeInfo = typeInformation;
  } else {
    typeInfo = initialTypeInformation;
  }

  // TODO: removed gears...
  return {
    typeInformation: { ...typeInfo },
    relatedSkill: relatedSkill,

    name: weapon.name,
    description: weapon.description,
    concealability: weapon.concealability,
    accuracy: weapon.accuracy,
    damage: weapon.damage,
    armourPenetration: weapon.armourPenetration,
    ammunition: weapon.ammunition,
    allowedGear: weapon.allowedGear,
    allowAccessories: weapon.allowAccessories,
    isCyberware: weapon.isCyberware,
    augmentationClassification: weapon.augmentationClassification,
    wireless: weapon.wireless,
    relatedSkillSpecialisations: weapon.relatedSkillSpecialisations,
    availability: weapon.availability,
    cost: weapon.cost,
    source: weapon.source,
    page: weapon.page,
  };
};

export const getWeapons = function (
  stagedSkills: Array<Skills>,
  stagedWeaponRanges: Array<WeaponRanges>,
  stagedWeaponAccessories: Array<WeaponAccessories>
): {
  weaponsUnlinked: WeaponUnlinkedSummaryListType;
  stagedMeleeWeapons: Array<MeleeWeapons>;
  stagedFirearmWeapons: Array<FirearmWeapons>;
  stagedProjectileWeapons: Array<ProjectileWeapons>;
  stagedExplosiveWeapons: Array<Explosives>;
  stagedAccessories: Array<Array<IncludedWeaponAccessories>>;
  stagedRanges: Array<Array<WeaponRangeLinks>>;
} {
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
  let stagedIncludedAccessories: Array<Array<IncludedWeaponAccessories>> = [];
  let stagedLinkedRanges: Array<Array<WeaponRangeLinks>> = [];

  assert(stagedSkills.length > 0);
  assert(stagedWeaponRanges.length > 0);
  weaponsUnlinked.forEach((weapon) => {
    let accessories: Array<IncludedWeaponAccessories> = [];
    // console.log(`Weapon: ${weapon.name}, skill: ${weapon.relatedSkill}`);
    const relatedSkill = stagedSkills.find(
      (skill) => skill.name == weapon.relatedSkill
    );
    assert(
      relatedSkill !== undefined,
      `undefined name: ${weapon.relatedSkill}`
    );

    let stagedWeapon:
      | MeleeWeapons
      | FirearmWeapons
      | ProjectileWeapons
      | Explosives;

    const linkedWeapon = convertWeapon(weapon, relatedSkill);

    switch (linkedWeapon.typeInformation.type) {
      case weaponTypeEnum.Melee:
        stagedWeapon = new MeleeWeapons(linkedWeapon);
        stagedMeleeWeapons.push(stagedWeapon);
        break;
      case weaponTypeEnum.Firearm:
        stagedWeapon = new FirearmWeapons(linkedWeapon);
        stagedFirearmWeapons.push(stagedWeapon);
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
        assert(false, JSON.stringify(linkedWeapon.typeInformation));
    }
    if (weapon.accessories) {
      accessories = weapon.accessories.map((accessory) => {
        const relatedAccessory = stagedWeaponAccessories.find(
          (weaponAccessory) => accessory.name === weaponAccessory.name
        );
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
      stagedIncludedAccessories.push(accessories);
    }

    if ("rangeList" in weapon.typeInformation) {
      const rangeList = weapon.typeInformation.rangeList;
      assert(rangeList.length > 0);
      const relatedRanges = rangeList.map((currentRange) => {
        // console.log(`Range: ${currentRange}`);
        const foundRange = stagedWeaponRanges.find(
          (range) => range.name == currentRange
        );
        assert(foundRange !== undefined, `undefined name: ${currentRange}`);
        assert("ranges" in stagedWeapon, `Assertion to type narrow`);
        return new WeaponRangeLinks(foundRange, stagedWeapon);
      });
      stagedLinkedRanges.push(relatedRanges);
    }
  });
  // console.log(stagedWeaponAccessories.map((accessory) => accessory.name));

  return {
    weaponsUnlinked: weaponsUnlinked,
    stagedMeleeWeapons: stagedMeleeWeapons,
    stagedFirearmWeapons: stagedFirearmWeapons,
    stagedProjectileWeapons: stagedProjectileWeapons,
    stagedExplosiveWeapons: stagedExplosiveWeapons,
    stagedAccessories: stagedIncludedAccessories,
    stagedRanges: stagedLinkedRanges,
  };
};
