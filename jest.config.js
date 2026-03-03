module.exports = {
  preset: "jest-expo",
  maxWorkers: "50%",
  bail: 1,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|msw|@mswjs|until-async|@faker-js)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
    "^msw$": "<rootDir>/node_modules/msw/lib/core/index.js",
    "^@faker-js/faker/locale/(.*)$": "<rootDir>/node_modules/@faker-js/faker/dist/locale/$1.js",
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
  setupFilesAfterEnv: ["<rootDir>/jest.msw-setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "__tests__/a11y/a11y-helpers.ts", "__tests__/fixtures.ts"],
};
