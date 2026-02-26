/* global jest */
module.exports = {
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success", Error: "error", Warning: "warning" },
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
};
