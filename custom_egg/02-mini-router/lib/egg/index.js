const { EggCore, EggLoader } = require('./../egg-core');

const EGG_LOADER = Symbol.for('egg#loader');
const EGG_PATH = Symbol.for('egg#eggPath');

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

  get [EGG_PATH]() {
    return __dirname;
  }
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }
}

module.exports = EggApplication;
