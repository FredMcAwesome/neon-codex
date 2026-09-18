import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    // Every suite targets the same shared Postgres database and rebuilds the
    // schema in beforeAll (refreshDatabase). Files must run serially or they
    // drop/recreate tables underneath each other.
    fileParallelism: false,
  },
});
