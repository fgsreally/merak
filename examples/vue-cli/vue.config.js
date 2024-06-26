const { defineConfig } = require("@vue/cli-service");
const { Merak, merakPostCss } = require("webpack-plugin-merak");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [merakPostCss()],
        },
      },
    },
  },
  chainWebpack(config) {
    config.plugins.delete("fork-ts-checker");
  },
  configureWebpack: {
    devtool: "source-map",
    devServer: {
      port: 4005,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    },

    plugins: [new Merak("vue_cli", { force: true })],
  },
});
