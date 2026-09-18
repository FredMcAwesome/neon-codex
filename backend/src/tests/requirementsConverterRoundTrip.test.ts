/**
 * requirementsConverterRoundTrip.test.ts
 *
 * TDD cases for the converter sibling-drop bug:
 * boolean dispatchers in converter/src/xmlParser/common/RequiredParserHelper.ts
 * (`convertWeaponDetails`, `convertGearDetails`) drop sibling keys when an
 * OR/AND node mixes a nested AND/OR with leaf conditions.
 *
 * Case 1 - weapons (weapondetails): "Underbarrel Grenade Launcher"
 * (converter/xmls/weapons.xml)
 *   <required><weapondetails><OR>
 *     <AND><OR>9 categories</OR><useskill NOT="" operation="exists"/></AND>
 *     <category>Assault Rifles</category>
 *     <category>Sniper Rifles</category>
 *     <category>Sporting Rifles</category>
 *     <useskill>Longarms</useskill>
 *     <useskill>Heavy Weapons</useskill>
 *   </OR></weapondetails></required>
 * Previously the converter emitted only the 9-category subtree and silently
 * dropped the 3 standalone categories, the 2 skill leaves and the
 * exists-condition.
 *
 * Case 2 - gear (geardetails): "Add Attack Modification"
 * (converter/xmls/gear.xml)
 *   <required><geardetails><AND>
 *     <attributearray operation="exists" NOT=""/>
 *     <OR><attack operation="exists" NOT=""/><attack>0</attack></OR>
 *   </AND></geardetails></required>
 * Previously the converter emitted only the attack oneOf and silently
 * dropped the attributearray condition.
 *
 * These tests pin the converter leg of the round-trip (XML required block
 * -> RequirementsType DTO, validated against RequirementsSchema). DB legs
 * (linkRequirementEntity/convertDBRequirement) are covered by the
 * gear/augmentation round-trips; this file is DB-free.
 */

import { describe, it, expect } from "vitest";
import { convertRequirements } from "@neon-codex/converter/build/xmlParser/common/RequiredParserHelper.js";
import {
  RequirementsSchema,
  gearRequirementTypeEnum,
  weaponRequirementTypeEnum,
  type RequirementsType,
} from "@neon-codex/common";
import { type } from "arktype";

// fast-xml-parser output shape for the Underbarrel Grenade Launcher
// <required> block (attributePrefix "_" , textNodeName "xmltext").
const underbarrelGrenadeLauncherRequired = {
  weapondetails: {
    OR: {
      AND: {
        OR: {
          category: [
            "Shotguns",
            "Sporting Rifles",
            "Sniper Rifles",
            "Light Machine Guns",
            "Medium Machine Guns",
            "Heavy Machine Guns",
            "Assault Cannons",
            "Grenade Launchers",
            "Missile Launchers",
          ],
        },
        useskill: { _NOT: "", _operation: "exists" },
      },
      category: ["Assault Rifles", "Sniper Rifles", "Sporting Rifles"],
      useskill: ["Longarms", "Heavy Weapons"],
    },
  },
} as Parameters<typeof convertRequirements>[0];

function collectWeaponLeaves(dto: RequirementsType): {
  subtypes: Array<string>;
  skills: Array<string | undefined>;
} {
  const subtypes: Array<string> = [];
  const skills: Array<string | undefined> = [];
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node !== "object" || node === null) {
      return;
    }
    const record = node as Record<string, unknown>;
    const weapon = record["weapon"] as
      { type?: unknown; value?: unknown } | undefined;
    if (
      weapon !== undefined &&
      typeof weapon === "object" &&
      weapon !== null &&
      weapon["type"] === weaponRequirementTypeEnum.Subtype
    ) {
      subtypes.push((weapon["value"] as { subtype: string }).subtype);
    }
    if (
      weapon !== undefined &&
      typeof weapon === "object" &&
      weapon !== null &&
      weapon["type"] === weaponRequirementTypeEnum.Skill
    ) {
      skills.push((weapon["value"] as { skill?: string }).skill);
    }
    for (const value of Object.values(record)) {
      visit(value);
    }
  };
  visit(dto);
  return { subtypes, skills };
}

function collectGearLeaves(dto: RequirementsType): {
  attributeArrays: Array<unknown>;
  attacks: Array<unknown>;
} {
  const attributeArrays: Array<unknown> = [];
  const attacks: Array<unknown> = [];
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node !== "object" || node === null) {
      return;
    }
    const record = node as Record<string, unknown>;
    const gear = record["gear"] as
      { type?: unknown; value?: unknown; exists?: unknown } | undefined;
    if (
      gear !== undefined &&
      typeof gear === "object" &&
      gear !== null &&
      gear["type"] === gearRequirementTypeEnum.AttributeArray
    ) {
      attributeArrays.push(gear["exists"]);
    }
    if (
      gear !== undefined &&
      typeof gear === "object" &&
      gear !== null &&
      gear["type"] === gearRequirementTypeEnum.Attack
    ) {
      attacks.push(gear["value"]);
    }
    for (const value of Object.values(record)) {
      visit(value);
    }
  };
  visit(dto);
  return { attributeArrays, attacks };
}

// fast-xml-parser output shape for the Add Attack Modification
// <required> block (attributePrefix "_" , textNodeName "xmltext").
const addAttackModificationRequired = {
  geardetails: {
    AND: {
      attributearray: { _operation: "exists", _NOT: "" },
      OR: {
        attack: [{ _operation: "exists", _NOT: "" }, 0],
      },
    },
  },
} as Parameters<typeof convertRequirements>[0];

describe("Weapon requirements round-trip (XML required -> DTO)", () => {
  it("preserves every sibling of a mixed OR node (Underbarrel Grenade Launcher)", () => {
    const dto = convertRequirements(underbarrelGrenadeLauncherRequired);

    // DTO leg of the round-trip must stay schema-valid.
    const schemaCheck = RequirementsSchema(dto);
    expect(
      schemaCheck instanceof type.errors ? schemaCheck.summary : null
    ).toBeNull();

    const { subtypes, skills } = collectWeaponLeaves(dto);

    // 9 grouped subtypes + 3 standalone subtypes. The standalone trio is
    // dropped today (only 9 survive).
    expect(subtypes).toHaveLength(12);
    expect(subtypes).toContain("Assault Rifles");
    expect(subtypes).toContain("Shotguns");

    // Both standalone skill leaves are dropped today (none survive).
    expect(skills).toContain("Longarms");
    expect(skills).toContain("Heavy Weapons");
  });
});

describe("Gear requirements round-trip (XML required -> DTO)", () => {
  it("preserves every sibling of a mixed AND node (Add Attack Modification)", () => {
    const dto = convertRequirements(addAttackModificationRequired);

    const schemaCheck = RequirementsSchema(dto);
    expect(
      schemaCheck instanceof type.errors ? schemaCheck.summary : null
    ).toBeNull();

    const { attributeArrays, attacks } = collectGearLeaves(dto);

    // The attributearray condition is dropped today (none survive).
    expect(attributeArrays).toHaveLength(1);
    expect(attributeArrays).toContain(false);

    // Both attack leaves already survive; pin them against regressions.
    expect(attacks).toHaveLength(2);
  });
});
