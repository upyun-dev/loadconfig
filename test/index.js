const assert = require('assert');
const loadConfig = require('../index');
const config = require('../conf/config.defaults.json');

describe('index.js', function() {
  describe('#loadConfig()', function() {
    it('should return config', function() {
      let cfg = loadConfig();
      assert.deepEqual(cfg, config);
    });
  });
});
