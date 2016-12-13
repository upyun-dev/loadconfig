const path = require('path');
const loadConfig = require('../index').loadConfig;

describe('index.js', function() {
  describe('#loadConfig()', function() {
    it('', function() {
      console.log(path.resolve('.'));
      loadConfig();
    });
  });
});