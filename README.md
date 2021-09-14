# vue-project-spa

> spa template

## Build Setup

``` bash
# install dependencies
npm install

############################
# 配置前端本地服务器
# server/localConfig.js
# baseURL: '127.0.0.1',
# port: '9000'

# 启动本地测试服务器
npm run server 
############################
# 配置前端本地服务器
local.env.js
# NODE_ENV: '"local"',
# BASE_API: '"127.0.0.1:9000"',

# 启动本地测试画面
npm run local 
############################

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
