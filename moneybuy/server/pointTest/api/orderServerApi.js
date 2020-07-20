const express = require('express')
const urlib = require('url')
const router = express.Router()
const orderInput71 = require('../data/order/res.input.71')
const orderInput72 = require('../data/order/res.input.72')

const receiveConfirm71 = require('../data/order/res.receive.confirm.71')
const receiveConfirm72 = require('../data/order/res.receive.confirm.72')
const finishConfirm71 = require('../data/order/res.finish.confirm.71')
const finishConfirm72 = require('../data/order/res.finish.confirm.72')

const receiveComplete71 = require('../data/order/res.receive.complete.71')
const receiveComplete72 = require('../data/order/res.receive.complete.72')
const finishComplete71 = require('../data/order/res.finish.complete.71')
const finishComplete72 = require('../data/order/res.finish.complete.72')

const dateFormat = require('../dataFormat.js')
dateFormat.MyDate()

const pointConfig = require('../pointConfig')

// http://127.0.0.1:18080/v2/user/order/input/71?TRADE_TYPE=1
router.get('/input/71', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var query = reqParam.query
  console.log('request order input : ' + pathname)
  var responseObj = orderInput71
  var TRADE_TYPE = query.TRADE_TYPE
  console.log('response order input Success Start')
  console.log(responseObj)
  console.log('response order input Success end')
  res.send(responseObj)
})

// http://127.0.0.1:18080/v2/user/order/input/72?TRADE_TYPE=1
router.get('/input/72', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  var query = reqParam.query
  console.log(pathname + ' TRADE_TYPE:' +  query.TRADE_TYPE)
  responseObj = orderInput72
  responseObj = dateFormat.setOprationSetting(responseObj)
  console.log('/input/72 response start')
  console.log(responseObj)
  console.log('/input/72 response end')
  res.send(responseObj)
})

router.post('/confirm', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  var query = reqParam
  console.log(pathname)
  var receiveOrFinish = pointConfig.devType.receiveOrFinish
  if (query.BRAND_ID == 71) {
    responseObj = receiveOrFinish ? receiveConfirm71 : finishConfirm71
  } else {
    responseObj = receiveOrFinish ? receiveConfirm72 : finishConfirm72
  }
  console.log('confirm response confirm start')
  console.log(responseObj)
  console.log('confirm response confirm end')
  res.send(responseObj)
})

router.post('/complete', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname
  var query = reqParam.query
  console.log(pathname)
  var receiveOrFinish = pointConfig.devType.receiveOrFinish
  var responseObj = null
  if (query.BRAND_ID == 71) {
    responseObj = receiveOrFinish ? receiveComplete71 : finishComplete72
  } else {
    responseObj = receiveOrFinish ? receiveComplete72 : finishComplete72
  }
  console.log('rcomplete esponse confirm start')
  console.log(responseObj)
  console.log('complete response confirm end')
  res.send(responseObj)
})

module.exports = router
