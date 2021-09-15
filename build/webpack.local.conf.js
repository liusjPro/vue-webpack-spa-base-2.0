'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const localWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.local.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for local
  devtool: config.local.devtool,
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.local.assetsPublicPath, 'login.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.local.host,
    port: PORT || config.local.port,
    open: config.local.autoOpenBrowser,
    overlay: config.local.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.local.assetsPublicPath,
    proxy: config.local.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.local.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/local.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.local.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      localWebpackConfig.devServer.port = port
      // Add FriendlyErrorsPlugin
      localWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${localWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))
      resolve(localWebpackConfig)
    }
  })
})
/////////////////////////// MPA START /////////////////////////////////////////////
var pages = utils.getMultiEntry('./src/' + config.moduleName + '/**/*.html');
/////////////////////////// MPA END /////////////////////////////////////////////

for (var pathname in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    chunks: [pathname, 'vendors', 'manifest'], // 每个html引用的js模块
    inject: true  // js插入位置
  };
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  localWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}
/////////////////////////////////////////////////////////////////////////////////
