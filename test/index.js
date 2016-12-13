const assert = require('assert');
// const nock = require('nock');
const loadConfig = require('../index');

describe('index.js', () => {
  describe('#loadConfig()', () => {
    context('when no another configure', () => {
      let defaultsConfig;
      before(() => {
        defaultsConfig = require('./conf/config.defaults.json');
      });
      after(() => {
        delete require.cache['./conf/config.defaults.json'];
      });
      it('should return config', () => {
        let cfg = loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        });
        assert.deepEqual(cfg, defaultsConfig);
      });
    });
    context('when exists environmental variables', () => {
      let defaultsConfig;
      before(() => {
        process.env.LOADCONFIG_TEST_STRING = '123';
        defaultsConfig = require('./conf/config.defaults.json');
      });
      after(() => {
        delete require.cache['./conf/config.defaults.json'];
        delete process.env.LOADCONFIG_TEST_STRING;
      });
      it('should return config', () => {
        let cfg = loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        });
        assert.notEqual(cfg.test.string, defaultsConfig.test.string);
        defaultsConfig.test.string = '123';
        assert.deepEqual(cfg, defaultsConfig);
      });
    });
    // sync-request 使用的是 child_process.spawnSync，好像没法 nock
    // context('when exists url', () => {
    //   let defaultsConfig;
    //   let url = 'http://test.com';
    //   before(() => {
    //     defaultsConfig = require('./conf/config.defaults.json');
    //     nock(url)
    //       .get('/')
    //       .times(1)
    //       .reply(200, JSON.stringify({ test2: { obj: { num: 1234 } } }));
    //   });
    //   after(() => {
    //     delete require.cache['./conf/config.defaults.json'];
    //   });
    //   it('should return config', () => {
    //     let cfg = loadConfig({
    //       pattern: 'test/conf/config.%{env}.json',
    //       url: url
    //     });
    //     assert.notEqual(cfg.test2.obj.num, 1234);
    //     defaultsConfig.test2.obj.num = 1234;
    //     assert.deepEqual(cfg, defaultsConfig);

    //   });
    // });
  });
});
