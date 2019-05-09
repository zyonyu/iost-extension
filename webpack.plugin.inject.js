// pre inject plugin
const webpack = require('webpack')
const path = require('path');

function InjectPlugin(pluginOptions, browserDir) {
  this.options = pluginOptions;
  this.browserDir = browserDir;
  this.outputDir = this.options.mode == 'production'?'temp':'dev'
  
};

InjectPlugin.prototype.apply = function(compiler) {
  compiler.hooks.beforeRun.tapAsync('InjectPlugin', (compilation, callback) => {
    webpack({
      ...this.options,
      entry:  {
        inject: path.resolve(__dirname, 'src/inject/inject.js'),
      },
      output: {
        path: path.resolve(__dirname, `${this.outputDir}/${this.browserDir}`),
        filename: '[name]/[name].js',
      }
    }, (err, stats) => {
      if (err || stats.hasErrors()) {
        // 在这里处理错误
      }
      callback();
    });    
  });
};


module.exports = InjectPlugin