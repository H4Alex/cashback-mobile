/* global jest */
// --- Silence console warnings in tests ---
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Animated: `useNativeDriver`")) return;
  originalWarn(...args);
};

// --- Mock react-native-mmkv ---
jest.mock("react-native-mmkv", () => {
  const store = new Map();
  const MMKVMock = jest.fn().mockImplementation(() => ({
    getString: jest.fn((key) => store.get(key)),
    set: jest.fn((key, value) => store.set(key, value)),
    getBoolean: jest.fn((key) => store.get(key)),
    getNumber: jest.fn((key) => store.get(key)),
    delete: jest.fn((key) => store.delete(key)),
    contains: jest.fn((key) => store.has(key)),
    clearAll: jest.fn(() => store.clear()),
    getAllKeys: jest.fn(() => [...store.keys()]),
  }));
  return { MMKV: MMKVMock };
});

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
