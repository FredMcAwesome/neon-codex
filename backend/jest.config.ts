import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  testEnvironment: "jest-environment-node",
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
  transformIgnorePatterns: [
    "node_modules/(?!@shadowrun/common).+(js|jsx|mjs|ts)$",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  extensionsToTreatAsEsm: [".ts"],
};
export default config;
