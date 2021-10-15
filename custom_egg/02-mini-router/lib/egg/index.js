const { EggCore, EggLoader } = require('./../egg-core');

class AppWorkerLoader extends EggLoader {
  load() {
    this.loadRouter();
  }
}
class EggApplication extends EggCore {
  constructor(options) {
    super(options);
    this.on('error', (err) => {
      console.error(err);
    });

    this.loader.load();
  }

  get [Symbol.for('egg#eggPath')]() {
    return __dirname;
  }
  get [Symbol.for('egg#loader')]() {
    return AppWorkerLoader;
  }
}

module.exports = EggApplication;
