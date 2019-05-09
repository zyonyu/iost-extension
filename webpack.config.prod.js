const webpack = require('webpack')
const InjectPlugin = require('./webpack.plugin.inject.js')
const { getEntry, getOutput, getHTMLPlugins, getCopyPlugins, getResolve, getZipPlugin } = require('./webpack.utils')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path');
// const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin(),
    ],
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
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
  }
}


const browserDirs = ['chrome', 'opera', 'firefox']

module.exports = browserDirs.map(browserDir => {
  return {
    ...config,
    entry: getEntry(),
    output: getOutput(browserDir,'temp'),
    plugins: [
      // new CleanWebpackPlugin({
      //   verbose: true,
      //   cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'temp')],
      // }),
      new InjectPlugin({ ...config, resolve: getResolve()}, browserDir),
      ...getHTMLPlugins(browserDir,'temp'),
      ...getCopyPlugins(browserDir, 'temp'),
      getZipPlugin(browserDir),
    ],
    resolve: getResolve()
  }
})