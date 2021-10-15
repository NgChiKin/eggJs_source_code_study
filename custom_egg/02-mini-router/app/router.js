module.exports = (app) => {
  app.router.get('/index', async (ctx) => {
    ctx.body = 'hello encapsulation index';
  });

  app.router.get('/', async (ctx) => {
    ctx.body = 'hello encapsulation word'
  })
};