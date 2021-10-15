const path = require('path');

module.exports = {
  loadRouter() {
    this.loadFile(path.join(this.options.baseDir, 'app/router.js'));
  }
};
