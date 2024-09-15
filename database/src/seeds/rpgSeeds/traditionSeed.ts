import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  TraditionListSchema,
  type TraditionListType,
} from "@neon-codex/common/build/schemas/abilities/talent/traditionSchemas.js";
import {
  AllSpiritsTraditions,
  LinkedSpiritsTraditions,
  Traditions,
  UnlinkedSpiritsTraditions,
} from "../../models/rpg/traits/traditionModel.js";
import type { Critters } from "../../models/rpg/creatures/critterModel.js";
import { ref } from "@mikro-orm/postgresql";

export const getTraditions = function (stagedCritters: Array<Critters>) {
  const currentPath = import.meta.url;
  let unlinkedTraditions: TraditionListType;
  const relativeConverterPath = "converter/jsonFiles/traditions.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const traditionListParsed = TraditionListSchema.safeParse(rawJson);
  if (traditionListParsed.success) {
    console.log("traditions all g");
    unlinkedTraditions = traditionListParsed.data;
  } else {
    console.log(traditionListParsed.error.errors[0]);
    assert(false, "traditions is undefined");
  }
  const stagedTraditions: Array<Traditions> = [];
  unlinkedTraditions.forEach((tradition) => {
    if (typeof tradition.spiritTypes === "object") {
      let spirit = tradition.spiritTypes.spiritCombat;
      const combat = stagedCritters.find((critter) => critter.name == spirit);
      assert(
        combat !== undefined,
        `undefined Tradition Combat Spirit: ${tradition.spiritTypes.spiritCombat}`
      );
      const referencedCombat = ref(combat);

      spirit = tradition.spiritTypes.spiritDetection;
      const detection = stagedCritters.find(
        (critter) => critter.name == spirit
      );
      assert(
        detection !== undefined,
        `undefined Tradition Detection Spirit: ${tradition.spiritTypes.spiritDetection}`
      );
      const referencedDetection = ref(detection);

      spirit = tradition.spiritTypes.spiritHealth;
      const health = stagedCritters.find((critter) => critter.name == spirit);
      assert(
        health !== undefined,
        `undefined Tradition Health Spirit: ${tradition.spiritTypes.spiritHealth}`
      );
      const referencedHealth = ref(health);

      spirit = tradition.spiritTypes.spiritIllusion;
      const illusion = stagedCritters.find((critter) => critter.name == spirit);
      assert(
        illusion !== undefined,
        `undefined Tradition Combat Spirit: ${tradition.spiritTypes.spiritIllusion}`
      );
      const referencedIllusion = ref(illusion);

      spirit = tradition.spiritTypes.spiritManipulation;
      const manipulation = stagedCritters.find(
        (critter) => critter.name == spirit
      );
      assert(
        manipulation !== undefined,
        `undefined Tradition Combat Spirit: ${tradition.spiritTypes.spiritManipulation}`
      );
      const referencedManipulation = ref(manipulation);

      stagedTraditions.push(
        new LinkedSpiritsTraditions(
          tradition,
          referencedCombat,
          referencedDetection,
          referencedHealth,
          referencedIllusion,
          referencedManipulation
        )
      );
    } else if (tradition.spiritTypes === "Select Spirits") {
      stagedTraditions.push(new UnlinkedSpiritsTraditions(tradition));
    } else {
      stagedTraditions.push(new AllSpiritsTraditions(tradition));
    }
    // console.log(tradition.name);
  });
  return stagedTraditions;
};
