import { describe, it, expect } from "vitest";

describe("Backend Smoke Test", () => {
  it("should pass basic arithmetic", () => {
    expect(1 + 1).toBe(2);
  });

  it("should run in node environment", () => {
    expect(typeof window).toBe("undefined");
  });
});
