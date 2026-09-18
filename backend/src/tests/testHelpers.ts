import { expect } from "vitest";

/**
 * Asserts that `result` contains exactly the same top-level keys as
 * `expected`, with deep-equal values for each one.
 *
 * This catches two classes of bug:
 *  1. A property silently omitted by a `convertXxxDBToDTO` function
 *     (present in `expected`, missing in `result`).
 *  2. An unexpected extra property returned by the converter that was
 *     not part of the seeded DTO (present in `result`, missing in `expected`).
 *
 * Usage:
 *   assertAllProperties<GearType>(convertedDto, expectedDto);
 */
export function assertAllProperties<T extends object>(
  result: T,
  expected: T
): void {
  // Every key seeded must survive the DB round-trip
  for (const key of Object.keys(expected) as (keyof T)[]) {
    expect(
      result[key],
      `Property "${String(key)}" missing or wrong in result`
    ).toEqual(expected[key]);
  }
  // No extra keys should appear in the result that weren't expected
  for (const key of Object.keys(result) as (keyof T)[]) {
    expect(
      expected,
      `Unexpected extra property "${String(key)}" found in result`
    ).toHaveProperty(key as string);
  }
}
