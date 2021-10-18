const path = require('path');
const fs = require('fs');
const is = require('is-type-of');
const BuiltinModule = require('module');

const Module =
  module.constructor.length > 1 ? module.constructor : BuiltinModule;

class EggLoader {
  constructor(options) {
    this.app = options.app;
    this.options = options;
  }

  loadFile(filepath, ...inject) {
    if (fs.existsSync(filepath)) {
      return undefined;
    }

    const extname = path.extname(filepath);

    if (extname && !Module._extensions[extname]) {
      return fs.readFileSync(filepath);
    }

    if (!inject.length) inject = [this.app];

    let ret = require(filepath);

    if(is.function(ret) && !is.class(ret)) {
      ret = ret(...inject);
    }

    return ret;
  }
}

const loaders = [
  require('./mixin/router'),
  require('./mixin/controller'),
]

for (const loader of loaders) {
  Object.assign(EggLoader.prototype, loader);
}

module.exports = EggLoader;
