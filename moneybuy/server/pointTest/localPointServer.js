const express = require('express')
const bodyParser = require('body-parser')
const pointConfig = require('./pointConfig')

const userServerApi = require('./api/userServerApi')
const assetsServerApi = require('./api/assetsServerApi')
const noticeServerApi = require('./api/noticeServerApi')
const autosweepServerApi = require('./api/autoSweepServerApi')
const brandServerApi = require('./api/brandServerApi')
const brandsServerApi = require('./api/brandsServerApi')
const orderServerApi = require('./api/orderServerApi')
const tradeServerApi = require('./api/tradeServerApi')

const hostname = pointConfig.devInfo.baseURL // IP地址
const port = pointConfig.devInfo.port // 端口号

var app = express()
app.use(express.static('dist'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
/////////////////// V1 全本地环境  /////////////////
app.use(pointConfig.devApiV1.trades, tradeServerApi)
app.use(pointConfig.devApiV1.order, orderServerApi)
app.use(pointConfig.devApiV1.assets, assetsServerApi)
app.use(pointConfig.devApiV1.notice, noticeServerApi)
app.use(pointConfig.devApiV1.autosweep, autosweepServerApi)
app.use(pointConfig.devApiV1.brand, brandServerApi)
app.use(pointConfig.devApiV1.brands, brandsServerApi)
app.use(pointConfig.devApiV1.user, userServerApi)

/////////////////// V2 GO语言远程环境+本地环境 /////////////////
app.use(pointConfig.devApiV2.notice, noticeServerApi)
app.use(pointConfig.devApiV2.autosweep, autosweepServerApi)

// 监听端口
app.use((req, res, next) => {
  var err = new Error('This page not found')
  err.status = 404
  next(err)
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
  console.log('Point server start Success')
})
