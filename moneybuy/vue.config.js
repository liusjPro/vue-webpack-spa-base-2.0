const glob = require("glob");

function getPages () {
  let pages = {}
  glob.sync("./src/pages/*/*.js").forEach((filepath) => {
    let fileList = filepath.split("/");
    let fileName = fileList[fileList.length - 2];
    pages[fileName] = {
      entry: `src/pages/${fileName}/${fileName}.js`,
      template: `src/pages/${fileName}/${fileName}.html`,
      filename: `pages/${fileName}/${fileName}.html`,
      chunks: ["chunk-vendors", "chunk-common", fileName],
    };
  });
  
  return pages;
};

module.exports = {
  pages: getPages(),
  assetsDir: "assets",
  publicPath: "../../",
  configureWebpack: {
    devtool: process.env.NODE_ENV === "production" ? "(none)" : "source-map",
  },
  configureWebpack: config => {},
  chainWebpack: config => {},
  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,
    // 是否开启 CSS source map？
    sourceMap: false,
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
      }
    },
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },
  lintOnSave: false,
  devServer : {
    open: process.platform === 'darwin',
    host: '127.0.0.1',
    port: 18080,
    https: false,
    hotOnly: false,
    proxy: {
        // 方式1 local host - js
        '/v1': {
            target: "http://127.0.0.1:18081",
            changeOrigin: true, // 是否跨域
        },
        // 方式2 local host - js
        // '/v1': {
        //     target: "https://point-dev-sakura.ios.tokyo",
        //     changeOrigin: true,
        // },
        // '/v2': {
        //     target: "http://127.0.0.1:18081",
        //     changeOrigin: true,
        // },
    },
  },
};
