# loadconfig



## 快速开始

```
$ npm install https://github.com/upyun-dev/loadconfig.git --save
$ mkdir config
$ vi conf/config.defaults.json
```

```
// Customer module configs
{
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  }
}
```

#### 使用方法:

```
const loadConfig = require('loadconfig');
let config = loadConfig();

db.connect(config.redis, ...);
```

# loadConfig(options, [callback])
项目中仅导入一次，再次使用只返回第一次的配置导入结果。

导入项目，必须存在 defaults 文件，目前只支持 JSON 文件

优先级: 环境变量 > url 配置 > 自定义配置 > defaults 配置

## options object properties

| Property  | Default   | Description |
|-----------|-----------|-------------|
| pattern   | conf/config.%{env}.json | 配置文件名及路径的模板 |
| name      | null   | 作为环境变量，如果为 null , 取 package.json 的项目名, 比如: PROJECT_REDIS_HOST, 仅支持 defaults 中存在的 key |
| stages    | ['test', 'production', 'development'] | 当环境变量 NODE_ENV 存在且在 stages 中 |
| url       | null   | 可以通过传入 url 的方式，导入远程文件 |

### pattern

基本格式： `conf/config.%{env}.json`, `%{env}` 作为环境配置文件使用， 以及替换成 defaults 作为默认文件使用，务必存在。

如果 `pattern = config/conf.%{env}.json` , 务必在项目添加默认配置 `config/conf.defaults.json`.

配置在 `config/conf.json` 文件中修改及补充.

### name

不给参数 name 传值, 并且在项目 project 内使用

```
{
  "test": {
    "key": "value"
  }
}
```

如果想通过环境变量修改 value, 则需要传环境变量 `export PROJECT_TEST_KEY=balabala`