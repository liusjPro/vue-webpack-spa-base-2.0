const express = require('express')
const urlib = require('url')
const router = express.Router()
const tradesHistory = require('../data/trades/res.history')

// http://127.0.0.1:18080/v2/user/trades/history?PAGE_DATA_CNT=20

router.get('/history', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  console.log(pathname)
  var query = reqParam.query
  responseObj = tradesHistory
  var PAGE_DATA_CNT =  query.PAGE_DATA_CNT
  console.log('request history PAGE_DATA_CNT ' + PAGE_DATA_CNT)
  console.log('response history start')
  console.log(responseObj)
  console.log('response history end')
  res.send(responseObj)
})

// http://127.0.0.1:18080/v2/user/order/input/72?TRADE_TYPE=1
router.get('/input/72', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  console.log(pathname)
  var query = reqParam.query
  var TRADE_TYPE =  query.TRADE_TYPE
  console.log('request /input/72 ' + PAGE_DATA_CNT)
  responseObj = brand72
  console.log('response /input/72 start')
  console.log(responseObj)
  console.log('response /input/72 end')
  res.send(responseObj)
})

module.exports = router
