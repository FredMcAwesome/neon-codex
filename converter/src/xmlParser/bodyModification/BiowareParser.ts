/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import type { BiowareXmlType } from "./BiowareParserSchemas.js";
import { BiowareListXmlSchema } from "./BiowareParserSchemas.js";
import { convertBiowareCategory } from "./BiowareParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  convertAllowGear,
  convertAugmentationGradeList,
  convertAugmentationLimit,
  convertSource,
} from "../common/ParserHelper.js";
import { AugmentationSchema } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
import {
  availabilityAugmentationSemantics,
  costAugmentationSemantics,
  essenceCostSemantics,
  mountsAugmentationSemantics,
} from "./augmentationParserHelper.js";
import { augmentationTypeEnum } from "@neon-codex/common/build/enums.js";
const EssenceCost = Augmentation.EssenceCost;
const Cost = Augmentation.Cost;
const Availability = Augmentation.Availability;
const MountList = Augmentation.MountList;

export function ParseBioware() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/bioware.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.biowares.bioware[186].bonus
  // );

  const biowareListParsed = BiowareListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.biowares.bioware
  );

  if (biowareListParsed.success) console.log("bioware.xml initial zod parsed");
  else {
    console.log(biowareListParsed.error.errors[0]);
    assert(false);
  }

  const biowareList = biowareListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const biowareListConverted = biowareList.map((bioware) => {
    const convertedBioware = convertBioware(bioware);
    const check = AugmentationSchema.safeParse(convertedBioware);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(convertedBioware);
      throw new Error(check.error.message);
    }
    return check.data;
  });
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/biowares.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(biowareListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertBioware(bioware: BiowareXmlType) {
  const augmentationLimit = convertAugmentationLimit(bioware.limit);
  const subtype = convertBiowareCategory(bioware.category);
  const unavailableGrades =
    bioware.bannedgrades !== undefined
      ? convertAugmentationGradeList(bioware.bannedgrades.grade)
      : undefined;
  let match = EssenceCost.match(bioware.ess.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const essenceCost = essenceCostSemantics(match).eval();
  let biowareModification;
  if (bioware.addtoparentess !== undefined) {
    assert(
      bioware.requireparent !== undefined,
      `Missing requireparent for ${bioware.name}`
    );
    biowareModification = true as const;
  }
  const maxRating = bioware.rating !== undefined ? bioware.rating : 1;
  match = Availability.match(bioware.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability = availabilityAugmentationSemantics(match).eval();
  match = Cost.match(bioware.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const cost = costAugmentationSemantics(match).eval();

  const addWeapon =
    bioware.addweapon === undefined
      ? undefined
      : // TODO: shouldn't need this need to update xml (same for cyberware)
      bioware.addweapon === ""
      ? undefined
      : bioware.addweapon;

  let blockedMountList: Array<string> = [];
  if (bioware.blocksmounts !== undefined) {
    match = MountList.match(bioware.blocksmounts.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    blockedMountList = mountsAugmentationSemantics(match).eval();
  }
  const selectSide = bioware.selectside === undefined ? undefined : true;

  const bonus =
    bioware.bonus !== undefined ? convertXmlBonus(bioware.bonus) : undefined;
  const pairBonus =
    bioware.pairbonus !== undefined
      ? convertXmlBonus(bioware.pairbonus)
      : undefined;
  const pairIncludeList =
    bioware.pairinclude !== undefined
      ? Array.isArray(bioware.pairinclude.name)
        ? bioware.pairinclude.name
        : [bioware.pairinclude.name]
      : undefined;

  let requirements;
  if (bioware.required) {
    requirements = convertRequirements(bioware.required);
  }
  let forbidden;
  if (bioware.forbidden) {
    forbidden = convertRequirements(bioware.forbidden);
  }
  const { allowedGearList, allowedGearCategories } = convertAllowGear(
    bioware.allowgear
  );
  const allowCategory = bioware.allowsubsystems
    ? convertBiowareCategory(bioware.allowsubsystems.category)
    : undefined;
  const allowCategoryList =
    allowCategory === undefined ? undefined : [allowCategory];

  // forcegrade is currently only used for isgeneware
  assert(
    (bioware.forcegrade !== undefined) === (bioware.isgeneware !== undefined)
  );
  const isGeneware = bioware.isgeneware === undefined ? undefined : true;
  const source = convertSource(bioware.source);

  const typeInformation = {
    type: augmentationTypeEnum.Bioware,
    subtype: subtype,
    isGeneware: isGeneware,
  };

  return {
    name: bioware.name,
    description: "",
    augmentationLimit: augmentationLimit,
    ...typeInformation,
    unavailableGrades: unavailableGrades,
    essenceCost: essenceCost,
    modification: biowareModification,
    rating: { maximum: [maxRating] },
    availability: availability,
    cost: cost,
    addWeapon: addWeapon,
    ...(blockedMountList.length > 0 && { blockedMountList: blockedMountList }),
    selectSide: selectSide,
    bonus: bonus,
    pairBonus: pairBonus,
    pairIncludeList: pairIncludeList,
    requirements: requirements,
    forbidden: forbidden,
    ...(allowedGearList !== undefined && { allowedGearList: allowedGearList }),
    ...(allowedGearCategories !== undefined && {
      allowedGearCategories: allowedGearCategories,
    }),
    ...(bioware.hide !== undefined && { userSelectable: false as const }),
    allowCategoryList: allowCategoryList,
    source: source,
    page: bioware.page,
  };
}
