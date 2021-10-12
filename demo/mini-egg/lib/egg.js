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

const LoaderMixinRouter = {
  loadRouter() {
    this.loadFile(path.join(this.options.baseDir, 'app/router.js'));
  }
};

const loaders = [LoaderMixinRouter];

// 把加载单元的方法, 加载在EggLoader原型上
for (const loader of loaders) {
  Object.assign(EggLoader.prototype, loader);
}

class EggCore extends KoaApplication {
  constructor(options) {
    options.baseDir = options.baseDir || process.cwd();
    options.type = options.type || 'application';
    super(options);

    const Loader = this[EGG_LOADER];

    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this
    });
  }

  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }

    const router = (this[ROUTER] = new Router({ sensitive: true }, this));

    return router;
  }

  beforeStart(fn) {
    process.nextTick(fn);
  }
}

// 挂载router方法到 EggCore原型上
methods
  .concat(['resources', 'register', 'redirect'])
  .forEach(function (method) {
    EggCore.prototype[method] = function (...args) {
      this.router[method](...args);
      return this;
    };
  });

class AppWorkerLoader extends EggLoader {
  load() {
    this.loadRouter();
  }
}
