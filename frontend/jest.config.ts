/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm",
  resolver: "ts-jest-resolver",
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
        tsconfig: "<rootDir>/tsconfig.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  moduleNameMapper: {
    "@shadowrun/common":
      "<rootDir>/../node_modules/@shadowrun/common/src/index.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests/mocks/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/src/tests/mocks/styleMock.ts",
  },
};
export default config;
