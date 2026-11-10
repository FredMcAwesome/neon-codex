import {
  getTraditions,
  getMentors,
  getCritters,
  getSpells,
  getComplexForms,
  getAdeptPowers,
  getPrograms,
  getQualities,
  getPriorityTable,
  getHeritages,
  getMartialArts,
  getMartialArtTechniques,
  getLifestyles,
  getLifestyleQualities,
} from "../routes/character.js";
import { CREATOR_DATA_VERSION } from "@neon-codex/common";
import type { CreatorStaticDataType } from "@neon-codex/common";
// Imported from schema file to avoid evaluating composite schemas in the shared index
import { CreatorStaticDataSchema } from "../../../common/build/schemas/creatorDataSchemas.js";
import { type } from "arktype";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { RequestContext } from "@mikro-orm/postgresql";
import { init } from "../utils/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function warnOnDuplicateNames(data: CreatorStaticDataType): void {
  const lists: Array<[string, Array<{ name: string }>]> = [
    ["heritages", data.heritages],
    ["qualities", data.qualities],
    ["traditions", data.traditions],
    ["mentors", data.mentors],
    ["critters", data.critters],
    ["spells", data.spells],
    ["complexForms", data.complexForms],
    ["adeptPowers", data.adeptPowers],
    ["programs", data.programs],
    ["martialArts", data.martialArts],
    ["martialArtTechniques", data.martialArtTechniques],
    ["lifestyles", data.lifestyles],
    ["lifestyleQualities", data.lifestyleQualities],
  ];
  for (const [listName, list] of lists) {
    const seen = new Set<string>();
    for (const item of list) {
      if (seen.has(item.name)) {
        console.warn(
          `Duplicate catalog entry ${listName}::${item.name} — kept as-is; check seed data`
        );
      } else {
        seen.add(item.name);
      }
    }
  }
}

async function generate() {
  console.log("Fetching creator static data...");
  const db = await init();
  const [
    priorities,
    heritages,
    qualities,
    traditions,
    mentors,
    critters,
    spells,
    complexForms,
    adeptPowers,
    programs,
    martialArts,
    martialArtTechniques,
    lifestyles,
    lifestyleQualities,
  ] = await Promise.all([
    RequestContext.create(db.em, getPriorityTable),
    RequestContext.create(db.em, getHeritages),
    RequestContext.create(db.em, getQualities),
    RequestContext.create(db.em, getTraditions),
    RequestContext.create(db.em, getMentors),
    RequestContext.create(db.em, getCritters),
    RequestContext.create(db.em, getSpells),
    RequestContext.create(db.em, getComplexForms),
    RequestContext.create(db.em, getAdeptPowers),
    RequestContext.create(db.em, getPrograms),
    RequestContext.create(db.em, getMartialArts),
    RequestContext.create(db.em, getMartialArtTechniques),
    RequestContext.create(db.em, getLifestyles),
    RequestContext.create(db.em, getLifestyleQualities),
  ]);

  // Construct static dataset matching TRPC procedure payloads
  const creatorData: CreatorStaticDataType = {
    version: CREATOR_DATA_VERSION,
    priorities,
    heritages,
    qualities,
    traditions,
    mentors,
    critters,
    spells,
    complexForms,
    adeptPowers,
    programs,
    martialArts,
    martialArtTechniques,
    lifestyles,
    lifestyleQualities,
  };

  warnOnDuplicateNames(creatorData);

  // Validate the serialized wire representation
  const wireData: unknown = JSON.parse(JSON.stringify(creatorData));
  const parsedCreatorData = CreatorStaticDataSchema(wireData);
  if (parsedCreatorData instanceof type.errors) {
    throw new Error(
      `Generated creator data failed schema validation:\n${parsedCreatorData.summary}`
    );
  }

  const outputPath = path.resolve(
    __dirname,
    "../../../frontend/public/creator-data.json"
  );

  console.log(`Writing to ${outputPath}...`);
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(parsedCreatorData, null, 2)}\n`
  );
  console.log("Done!");
  await db.close();
  process.exit(0);
}

generate().catch(async (err) => {
  console.error(err);
  try {
    const db = await init();
    await db.close();
  } catch {
    console.log("DB close failed. Cannot close DB");
  }
  process.exit(1);
});
