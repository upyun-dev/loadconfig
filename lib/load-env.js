const assert = require('assert');
const isArray = require('isarray');
const isObject = require('isobject');

const env = process.env;

module.exports = (cfg, opts) => {
  assert.ok(isObject(cfg), 'parameter `cfg` is not an Object');
  cfg = _transform(cfg, opts.name);
  return cfg;
};

const _transform = (obj, prefix) => {
  if (!isObject(obj)) {
    let envVariable = env[prefix.toUpperCase()];
    // 判断 undefined 类型, 而不是环境变量的值
    // 如果没有传环境变量, 直接返回 obj
    if (typeof envVariable === 'undefined') return obj;
    // 如果 obj 是 array, 环境变量 'a,b,c' 转换为 [a, b, c]
    if (isArray(obj)) {
      try {
        return env[prefix.toUpperCase()] && env[prefix.toUpperCase()].split(',') || obj;
      } catch (e) {
        winston.log('warn', `环境变量 ${prefix.toUpperCase()} 格式有误`);
        return obj;
      }
    }
    return env[prefix.toUpperCase()];
  }
  let keys = Object.keys(obj);
  let newObj = {};
  keys.forEach((key) => {
    let value = obj[key];
    newObj[key] = _transform(value, prefix + '_' + key);
  });
  return newObj;
};