/* eslint-disable react/display-name */
const React = require("react");

const mockComponent = (name) =>
  React.forwardRef((props, ref) => React.createElement(name, { ...props, ref }, props.children));

module.exports = {
  __esModule: true,
  default: mockComponent("Svg"),
  Svg: mockComponent("Svg"),
  Path: mockComponent("Path"),
  Circle: mockComponent("Circle"),
  Line: mockComponent("Line"),
  Text: mockComponent("SvgText"),
  G: mockComponent("G"),
  Rect: mockComponent("Rect"),
};
