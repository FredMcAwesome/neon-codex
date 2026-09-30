/**
 * Version stamp for generated `equipment-data.json`.
 *
 * Bump this whenever the generated payload shape changes (schema renames,
 * new/removed fields). The generator stamps it into the JSON, the worker
 * refuses cached payloads with a different version, and the
 * `check-equipment-version` startup gate fails `npm start` when the
 * checked-in JSON is stale.
 */
export const EQUIPMENT_DATA_VERSION = 1;
