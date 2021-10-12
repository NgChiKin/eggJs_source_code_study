const EggApplication = require('./lib/egg');
const http = require('http');

const app = new EggApplication({
  baseDir: __dirname,
  type: 'application'
});

const server = http.createServer(app.callback());

server.once('error', (error) => {
  console.log(
    '[app_worker] server got error: %s, code: %s',
    err.message,
    err.code
  );
  process.exit(1);
});

server.listen(3333, () => {
  console.log('server started at 3333');
});
