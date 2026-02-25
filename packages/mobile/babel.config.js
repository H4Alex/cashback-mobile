module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === "test";
  const plugins = [];
  // nativewind/babel and reanimated/plugin break jest transforms
  if (!isTest) {
    plugins.push("nativewind/babel");
    plugins.push("react-native-reanimated/plugin");
  }
  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
