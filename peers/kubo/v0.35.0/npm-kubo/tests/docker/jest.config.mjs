export default {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "docs/test_coverage",
  coverageProvider: "v8",
  maxWorkers: 5,
  testEnvironment: 'node',
  testMatch: ["**/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/docs/", '/docker/', '/tests/unit/setup.ts'],
  roots: [
      "<rootDir>/src",
      "<rootDir>/tests"
  ],
  moduleDirectories: ["node_modules"],
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