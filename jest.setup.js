/* global jest */
// --- Silence console warnings in tests ---
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Animated: `useNativeDriver`")) return;
  originalWarn(...args);
};

// --- Mock expo-notifications ---
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: "ExponentPushToken[mock]" }),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  AndroidImportance: { DEFAULT: 3, HIGH: 4 },
}));

// --- Mock expo-device ---
jest.mock("expo-device", () => ({
  isDevice: false,
  deviceName: "Jest",
}));
