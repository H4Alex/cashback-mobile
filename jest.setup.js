/* eslint-disable no-undef */

// --- Silence console warnings in tests ---
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Animated: `useNativeDriver`")) return;
  originalWarn(...args);
};
