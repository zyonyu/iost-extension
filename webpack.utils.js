
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const path = require('path');

const getEntry = (sourceDir = 'src') => {
  return {
    inject: path.resolve(__dirname, `${sourceDir}/inject/inject.js`),
    popup: path.resolve(__dirname, `${sourceDir}/popup/popup.js`),
    options: path.resolve(__dirname, `${sourceDir}/options/options.js`),
    prompts: path.resolve(__dirname, `${sourceDir}/prompts/prompts.js`),
    content: path.resolve(__dirname, `${sourceDir}/content/content.js`),
    background: path.resolve(__dirname, `${sourceDir}/background/background.js`),
    hotreload: path.resolve(__dirname, `${sourceDir}/utils/hot-reload.js`),
  };
};

const getOutput = (browserDir, outputDir = 'dev') => {
  return {
    path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
    filename: '[name]/[name].js',
  };
};

const getHTMLPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
  new HtmlWebpackPlugin({
    title: 'Popup',
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/popup/index.html`),
    template: `${sourceDir}/popup/index.html`,
    chunks: ['popup'],
  }),
  new HtmlWebpackPlugin({
    title: 'Options',
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/options/index.html`),
    template: `${sourceDir}/options/index.html`,
    chunks: ['options'],
  }),
  new HtmlWebpackPlugin({
    title: 'Prompts',
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/prompts/index.html`),
    template: `${sourceDir}/prompts/index.html`,
    chunks: ['prompts'],
  }),
];

const getCopyPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
  new CopyWebpackPlugin([
    { from: `${sourceDir}/assets`, to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`) },
    { from: `${sourceDir}/_locales`, to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`) },
    { from: `${sourceDir}/manifest.json`, to: path.resolve(__dirname, `${outputDir}/${browserDir}/manifest.json`) },
  ]),
];

const getResolve = () => {
  return {
    alias: {
      '@themes': `${__dirname}/src/themes`,
      utils: `${__dirname}/src/utils`,
      components: `${__dirname}/src/components`,
      '@popup': `${__dirname}/src/popup`,
    }
  }
}

const getZipPlugin = (browserDir, outputDir = 'dist') =>
  new ZipPlugin({
    path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
    filename: browserDir,
    extension: 'zip',
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false,
    },
    zipOptions: {
      forceZip64Format: false,
    },
  });

module.exports = {
  getEntry,
  getOutput,
  getHTMLPlugins,
  getCopyPlugins,
  getZipPlugin,
  getResolve
};
