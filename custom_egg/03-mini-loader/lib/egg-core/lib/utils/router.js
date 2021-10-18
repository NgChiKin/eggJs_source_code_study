const KoaRouter = require('koa-router');

class Router extends KoaRouter {
  constructor(options, app) {
    super(options);
    this.app = app;
  }
}

module.exports = Router;
