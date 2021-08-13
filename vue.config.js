const { IgnorePlugin } = require("webpack");

module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    plugins: [
      new IgnorePlugin({
        resourceRegExp: /serialport/
      })
    ],
    electronBuilder: {
      nodeIntegration: true,
      buildDependenciesFromSource: true,
      npmRebuild: false,
      externals: ["serialport"]
    }
  }
};
