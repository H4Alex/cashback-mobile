module.exports = {
  preset: "jest-expo",
  maxWorkers: "50%",
  bail: 1,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov", "html"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/types/**", "!src/testing/**"],
  coverageThreshold: {
    global: {
      branches: 63.3,
      functions: 64.2,
      lines: 70.9,
      statements: 70.1,
    },
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  testResultsProcessor: "./jest-log-processor.js",
  testPathIgnorePatterns: ["/node_modules/", "__tests__/a11y/a11y-helpers.ts", "__tests__/fixtures.ts"],
};
