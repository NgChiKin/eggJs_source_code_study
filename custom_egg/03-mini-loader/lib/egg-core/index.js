const path = require('path');
const fs = require('fs');
const Router = require('./lib/utils/router');
const EggLoader = require('./lib/loader/egg-loader');
const KoaApplication = require('koa');
const ROUTER = Symbol('EggCore#router');
const EGG_LOADER = Symbol.for('Egg#loader');

const methods = [ 'head', 'options', 'get', 'put', 'patch', 'post', 'delete', 'all' ];

class EggCore extends KoaApplication {
  constructor(options) {
    options.baseDir = options.baseDir || process.cwd();
    options.type = options.type || 'application';
    super(options);
    
    options.app = this;
    const Loader = this[EGG_LOADER];

    this.loader = new Loader(options);
  }

  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }

    const router = (this[ROUTER] = new Router({}, this.app));

    this.beforeStart(() => {
      this.use(router.middleware());
    });

    return router;
  }

  beforeStart(fn) {
    process.nextTick(fn);
  }

  get controller() {}
}

methods.concat([ 'resources', 'register', 'redirect' ]).forEach(function(method) {
  EggCore.prototype[method] = function(...args) {
    this.router[method](...args);
    return this;
  };
});

module.exports = { EggCore, EggLoader };
