const fs = require('fs');
const path = require('path');
const KoaApplication = require('koa');
const KoaRouter = require('koa-router');
const is = require('is-type-of');

const ROUTER = Symbol('EggCore#router');
const EGG_LOADER = Symbol.for('egg#loader');
const methods = [
  'head',
  'options',
  'get',
  'put',
  'patch',
  'post',
  'delete',
  'all'
];

class Router extends KoaRouter {
  constructor(opts, app) {
    super(opts);
    this.app = app;
  }
}

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

    if (!['.js', '.node', '.json', ''].includes(extname)) {
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

class EggCore extends KoaApplication {
  constructor(options) {
    options.baseDir = options.baseDir || process.cwd();
    options.type = options.type || 'application';
    super(options);

    const loader = new EggLoader({
      baseDir: options.baseDir,
      app: this
    });
  }
}
