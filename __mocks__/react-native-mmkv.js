/* global jest */
const store = new Map();

const mmkvInstance = {
  getString: jest.fn((key) => store.get(key)),
  set: jest.fn((key, value) => store.set(key, value)),
  getBoolean: jest.fn((key) => store.get(key)),
  getNumber: jest.fn((key) => store.get(key)),
  remove: jest.fn((key) => store.delete(key)),
  contains: jest.fn((key) => store.has(key)),
  getAllKeys: jest.fn(() => Array.from(store.keys())),
  clearAll: jest.fn(() => store.clear()),
};

module.exports = {
  MMKV: mmkvInstance,
  createMMKV: jest.fn(() => mmkvInstance),
};
