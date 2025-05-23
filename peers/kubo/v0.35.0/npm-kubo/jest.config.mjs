// import { pathsToModuleNameMapper } from 'ts-jest';
// import { readFileSync } from 'fs';

// Read the tsconfig.json file
// const tsconfig = JSON.parse(
//   readFileSync(new URL('./tsconfig.json', import.meta.url))
// );

export default {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "docs/test_coverage",
  coverageProvider: "v8",
  maxWorkers: 5,
  testEnvironment: 'node',
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/unit/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/docs/", '/docker/'],
  roots: [
      "<rootDir>/src",
      "<rootDir>/tests"
  ],
  moduleDirectories: ["node_modules", "<rootDir>/node_modules"],
  moduleFileExtensions: [
      "js",
      "ts",
      "json",
      "node"
  ],
  extensionsToTreatAsEsm: [".ts"],
  detectOpenHandles: true,
  verbose: true,
  testTimeout: 30000
};