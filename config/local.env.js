'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"local"',
  BASE_API: '"127.0.0.1:9000"',
  BASE_KEY: '"v1"'
})
