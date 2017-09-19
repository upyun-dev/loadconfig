const assert = require('assert');
const winston = require('winston');
const path = require('path');
const loadConfig = require('../index');

winston.remove(winston.transports.Console);

describe('index.js', () => {
  describe('#loadConfig()', () => {
    let defaultsConfig = require('./conf/config.defaults.json');
    it('should return error if pattern is invalid', () => {
      assert.throws(function() {
        loadConfig({
          pattern: 'test/test.${env}.json'
        });
      }, Error);
    });
    context('when no another configure', () => {
      it('should return config', () => {
        let cfg = loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        });
        assert.deepEqual(cfg, defaultsConfig);
      });
    });
    context('when exists environmental variables', () => {
      before(() => {
        process.env.LOADCONFIG_TEST_STRING = '123';
      });
      after(() => {
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
    context('when environmental variables is array', () => {
      before(() => {
        process.env.LOADCONFIG_TEST2_ARRAY = '1,2,3';
      });
      after(() => {
        delete process.env.LOADCONFIG_TEST2_ARRAY;
      });
      it('should return config', () => {
        let cfg = loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        });
        assert.deepEqual(cfg.test2.array, ['1', '2', '3']);
        defaultsConfig.test2.array = ['1', '2', '3'];
        assert.deepEqual(cfg, defaultsConfig);
      });
    });
    context('when environmental variables is array and invalid', () => {
      before(() => {
        process.env.LOADCONFIG_TEST2_ARRAY = '';
      });
      after(() => {
        delete process.env.LOADCONFIG_TEST2_ARRAY;
      });
      it('should return config', () => {
        let cfg = loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        });
        assert.deepEqual(cfg, defaultsConfig);
      });
    });

    context('when arguments with callback', () => {
      it('should return error if pattern is invalid', (done) => {
        loadConfig({
          pattern: 'test/test.${env}.json'
        }, (err) => {
          assert.ok(err);
          done();
        });
      });

      it('should return config', (done) => {
        loadConfig({
          pattern: 'test/conf/config.%{env}.json'
        }, (err, config) => {
          assert.ifError(err);
          assert.ok(config, defaultsConfig);
          done();
        });
      });
    });

    context('when pattern is absolute', () => {
      it('should return config', (done) => {

        loadConfig({
          pattern: path.resolve(__dirname, './conf/config.%{env}.json')
        }, (err, config) => {
          assert.ifError(err);
          assert.ok(config, defaultsConfig);
          done();
        });
      });
    });
  });
});
