const deepExtend = require('deep-extend');
const syncRequest = require('sync-request');
const winston = require('winston');
const loadEnv = require('./lib/load-env');
const path = require('path');
const env = process.env;

// 避免污染源数据
const cloneJSON = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const loadConfig = (opts, callback) => {
  opts = deepExtend({
    pattern: 'conf/config.%{env}.json',
    url: '',
    stages: [
      'test',
      'production',
      'development'
    ],
    name: ''
  }, opts || {});

  opts.pattern = path.join(process.cwd(), opts.pattern);
  if (!opts.name) opts.name = require(path.join(process.cwd(), 'package.json')).name;

  let cfg = cloneJSON(require(opts.pattern.replace(/%{env}/, 'defaults')));
  // 环境变量最好跟着 defaults 文件导入, 避免环境变量名被污染
  let envCfg = loadEnv(cfg, { name: opts.name });

  try {
    cfg = deepExtend(cfg, cloneJSON(require(opts.pattern.replace(/\.%{env}/, ''))));
  } catch (e) { }

  // stage override
  if (~opts.stages.indexOf(env.NODE_ENV)) {
    let dir;
    try {
      dir = opts.pattern.replace(/%{env}/, env.NODE_ENV);
      cfg = deepExtend(cfg, cloneJSON(require(dir)));
    } catch (e) {
      winston.log('info', dir, 'not a regular file');
    }
  }

  if (opts.url) {
    try {
      let res = syncRequest('GET', opts.url);
      let conf = JSON.parse(res.getBody('utf8'));
      deepExtend(cfg, conf);
    } catch (e) {
      winston.log('info', `Request data from ${opts.url} is invalid`);
      winston.log('error', e.message, { error: e.stack });
    }
  }
  // Env override
  deepExtend(cfg, envCfg);
  return cfg;
};

module.exports = loadConfig;

