module.exports = {
  preset: "jest-expo",
  maxWorkers: "50%",
  bail: 1,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts", "!src/types/**"],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "__tests__/a11y/a11y-helpers.ts", "__tests__/fixtures.ts"],
};
