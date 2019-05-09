const webpack = require('webpack')
const InjectPlugin = require('./webpack.plugin.inject.js')
const { getEntry, getOutput, getHTMLPlugins, getResolve, getCopyPlugins } = require('./webpack.utils');

const config = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ]
  },
}
const browserDirs = ['chrome', 'opera', 'firefox']

module.exports = browserDirs.map(browserDir => {
  return {
    ...config,
    entry: getEntry(),
    output: getOutput(browserDir),
    plugins: [
      // new InjectPlugin(config, browserDir),
      ...getHTMLPlugins(browserDir),
      ...getCopyPlugins(browserDir),
    ],
    resolve: getResolve()
  }
})