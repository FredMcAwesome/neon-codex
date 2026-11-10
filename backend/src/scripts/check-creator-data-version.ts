// Fail-fast freshness gate for generated creator static data.

// Compares the `version` stamped in `frontend/public/creator-data.json` against `CREATOR_DATA_VERSION` and exits
// non-zero when they differ, so `npm start` refuses to run with stale generated data instead of serving it silently.
// Wired into the root `prestart` next to the equipment gate.

// The const is imported from common SOURCE (not the `@neon-codex/common` build alias) so the check is meaningful even before `tsc -b` runs.
// Run with tsx, e.g. `tsx backend/src/scripts/check-creator-data-version.ts`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CREATOR_DATA_VERSION } from "../../../common/src/creatorDataVersion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(
  __dirname,
  "../../../frontend/public/creator-data.json"
);

let data: unknown;
try {
  data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (error) {
  console.error(
    `[creator-data] cannot read ${dataPath}: ${error instanceof Error ? error.message : error}`
  );
  process.exit(1);
}

const version =
  typeof data === "object" && data !== null
    ? (data as { version?: unknown }).version
    : undefined;

if (version !== CREATOR_DATA_VERSION) {
  console.error(
    `[creator-data] outdated: ${dataPath} has version ${JSON.stringify(version)}, ` +
      `expected ${CREATOR_DATA_VERSION}. ` +
      `Run setup: npm run setup`
  );
  process.exit(1);
}

console.log(`[creator-data] version ${CREATOR_DATA_VERSION} OK`);
