module.export = {
  async index(ctx) {
    ctx.body = 'hello index';
  },

  async hello(ctx) {
    ctx.body = 'hello world';
  }
};
