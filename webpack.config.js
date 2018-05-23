const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const webpack = require('webpack')
const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = webpack

const nodeExternals = require('webpack-node-externals')
const curVersion = JSON.stringify(require("./package.json").version)
const curYear = new Date().getFullYear()
const author = require("./package.json").author || ''
const contributors = require("./package.json").contributors || []
const description = require("./package.json").description || ''
const name = require("./package.json").name || ''

function getBanner() {
  return `
  ${name} ${curVersion} http://targomo.com
  ${description}
  (c) ${curYear} ${author}
  `
}

function getEntry(sourceMain) {
  const main = require("./package.json").main || 'dist/index.js'

  let mainName = main.match(/(.*\/)?(.*)\.js/)[2] || 'index'
  let result = {}

  result[mainName] = sourceMain
  result[mainName + '.min'] = sourceMain

  return result
}

module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules"
    ],
  },

  devtool: 'source-map',

  "entry": getEntry('./src/index.ts'),

  "output": {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'tgm',
    umdNamedDefine: true
  },

  externals: [nodeExternals()],

  "module": {
    "rules": [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  "plugins": [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    }),
    new webpack.BannerPlugin({
      banner: getBanner()
    }),
    new NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        "to": ".",
        "from": "./package.json",
      }
    ]),
    new ProgressPlugin(),
  ],
  "devServer": {
    "historyApiFallback": true
  }
}
