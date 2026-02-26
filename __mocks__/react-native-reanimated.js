/* global jest */
const { View } = require("react-native");

module.exports = {
  __esModule: true,
  default: {
    View,
    createAnimatedComponent: (comp) => comp,
  },
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn((fn) => fn()),
  useAnimatedProps: jest.fn((fn) => fn()),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  withDelay: jest.fn((_delay, val) => val),
  Easing: {
    out: jest.fn((fn) => fn),
    cubic: jest.fn(),
  },
};
