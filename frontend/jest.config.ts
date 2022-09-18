import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "<regex_match_files": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
export default config;
