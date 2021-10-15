
const KoaApplication = require('koa');
const Router = require('./lib/utils/router');
const EggLoader = require('./lib/loader/egg_loader');

const ROUTER = Symbol('EggCore#router');
const EGG_LOADER = Symbol.for('egg#loader');
const methods = [ 'head', 'options', 'get', 'put', 'patch', 'post', 'delete', 'all' ];


class EggCore extends KoaApplication {

  constructor(options) {

    options.baseDir = options.baseDir || process.cwd();
    options.type = options.type || 'application';
    super(options);

    const Loader = this[EGG_LOADER];
    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this,
    });
  }

  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }

    const router = this[ROUTER] = new Router({ sensitive: true }, this);
    this.beforeStart(() => {
      this.use(router.middleware());
    });
    return router;
  }

  beforeStart(fn) {
    process.nextTick(fn);
  }

}

methods.concat([ 'resources', 'register', 'redirect' ]).forEach(function(method) {
  EggCore.prototype[method] = function(...args) {
    this.router[method](...args);
    return this;
  };
});

module.exports = {
  EggCore,
  EggLoader,
};