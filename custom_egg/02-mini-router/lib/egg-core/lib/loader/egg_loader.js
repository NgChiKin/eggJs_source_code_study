const fs = require('fs');
const path = require('path');
const is = require('is-type-of');

const BuiltinModule = require('module');

const Module =
  module.constructor.length > 1
    ? module.constructor
    : /* istanbul ignore next */
      BuiltinModule;

class EggLoader {
  constructor(options) {
    this.options = options;
    this.app = this.options.app;
  }

  loadFile(filepath, ...inject) {
    if (!fs.existsSync(filepath)) {
      return undefined;
    }

    const extname = path.extname(filepath);

    // 如果不是 js 模块, 直接返回 content Buffer
    if (extname && !Module._extensions[extname]) {
      return fs.readFileSync(filepath);
    }

    if (inject.length === 0) inject = [this.app];

    let ret = require(filepath);

    if (is.function(ret) && !is.class(ret)) {
      ret = ret(...inject);
    }

    return ret;
  }
}
const Loaders = [
  require('./mixin/router'),
];

for (const loader of Loaders) {
  Object.assign(EggLoader.prototype, loader);
}

module.exports = EggLoader;
