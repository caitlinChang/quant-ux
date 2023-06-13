var path = require("path");
var fs = require("fs");

module.exports = {
  devServer: {
    proxy: {
      "^/rest": {
        //target:  'http://localhost:8082',
        target: "https://v1.quant-ux.com",
        ws: true,
        changeOrigin: true,
      },
      "^/ai": {
        target: "https://v1.quant-ux.com",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        // lessOptions: {
        // If you are using less-loader@5 please spread the lessOptions to options directly
        modifyVars: {
          "ant-prefix": "antv",
        },
        javascriptEnabled: true,
        // },
      },
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "./node_modules/ant-design-vue/dist/antd.less"),
        path.resolve(__dirname, "./src/theme.less"),
      ],
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("src", path.resolve("src"));
    config.resolve.alias.set("assets", path.resolve("src/assets"));
    config.resolve.alias.set("components", path.resolve("src/components"));
    config.resolve.alias.set("dojo", path.resolve("src/dojo"));
    config.resolve.alias.set("common", path.resolve("src/common"));
    config.resolve.alias.set("vommond", path.resolve("src/vommond"));
    config.resolve.alias.set("views", path.resolve("src/views"));
    config.resolve.alias.set("canvas", path.resolve("src/canvas"));
    config.resolve.alias.set("page", path.resolve("src/page"));
    config.resolve.alias.set("user", path.resolve("src/user"));
    config.resolve.alias.set("core", path.resolve("src/core"));
    config.resolve.alias.set("dash", path.resolve("src/dash"));
    config.resolve.alias.set("public", path.resolve("src/public"));
    config.resolve.alias.set("services", path.resolve("src/services"));
    config.resolve.alias.set("nls", path.resolve("src/nls"));
    config.resolve.alias.set("themes", path.resolve("src/themes"));
    config.resolve.alias.set("export", path.resolve("src/export"));
    config.resolve.alias.set("examples", path.resolve("src/examples"));
    config.resolve.alias.set("help", path.resolve("src/help"));
    config.resolve.alias.set("player", path.resolve("src/player"));
    config.resolve.alias.set("style", path.resolve("src/style"));
    config.resolve.extensions.add(".tsx").add(".ts");
    config.module
      .rule("tsx")
      .test(/\.tsx?$|\.ts?$/)
      .exclude.add(/node_modules/)
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .end();
  },
};
