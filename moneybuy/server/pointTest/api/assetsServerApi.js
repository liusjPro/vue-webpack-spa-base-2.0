const express = require('express')
const urlib = require('url')
const router = express.Router()

const assertsChart1Month = require('../data/assets/home.chart.1.month')
const assertsChart3Month = require('../data/assets/home.chart.3.month')
const assertsChart6Month = require('../data/assets/home.chart.6.month')
const assertsChart12Month = require('../data/assets/home.chart.12.month')

const assertsHasBuyFalse = require('../data/assets/res.all.has_buy_false')
const assertsHasBuyTrue = require('../data/assets/res.all.has_buy_true')

const assertsExpectedValAll = require('../data/assets/res.expected.val.all')
const assertsExpectedVal71 = require('../data/assets/res.expected.val.71')
const assertsExpectedVal72 = require('../data/assets/res.expected.val.72')

const assertsExpectedEodAll = require('../data/assets/res.expected.eod.all')
const assertsExpectedEod71 = require('../data/assets/res.expected.eod.71')
const assertsExpectedEod72 = require('../data/assets/res.expected.eod.72')

const assertsSpecial71 = require('../data/assets/res.all.special.71')
const assertsSpecial72 = require('../data/assets/res.all.special.72')

const dateFormat = require('../dataFormat.js')
dateFormat.MyDate()

const pointConfig = require('../pointConfig')

// pattern 1 2 
router.get('/all', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var responseObj = null
  // 0:保有していない (is first) 　1:保有している  2:全売却 
  var POSSESS_BRAND_FLG = pointConfig.devType.POSSESS_BRAND_FLG
  if (POSSESS_BRAND_FLG == 0) {
    responseObj = assertsHasBuyFalse
  } else {
    responseObj = assertsHasBuyTrue
    responseObj = dateFormat.setOprationSetting(responseObj)
  }
  console.log('all response Success start ')
  console.log(responseObj)
  console.log('all response Success end')
  res.send(responseObj)
})

// https://stg-otbp-trnelb02.onetapbuy.jp/v1/user/assets/chart?graphStartD=2019/05/01
router.get('/chart', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  console.log(pathname)
  responseObj = null
  var query = reqParam.query
  var graphStartD =  query.graphStartD
  console.log(query)
  console.log('graphStartD: ' + graphStartD)

  switch(graphStartD) {
    case '2020/03/30':
      responseObj = assertsChart1Month
      break
    case '2020/01/30':
      responseObj = assertsChart3Month
      break
    case '2019/10/30':
      responseObj = assertsChart6Month
      break
    case '2019/04/30':
      responseObj = assertsChart12Month
      break
  }
  responseObj = dateFormat.setOprationSetting(responseObj)
  console.log('chart Readed Success start ')
  console.log(responseObj)
  console.log('chart Readed Success end')
  res.send(responseObj)
})

// https://stg-otbp-trnelb02.onetapbuy.jp/v1/user/assets/expected?BRAND_UNIT_INFO_LIST=
router.get('/expected', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  var query = reqParam.query
  var BRAND_UNIT_INFO_LIST = JSON.parse(query.BRAND_UNIT_INFO_LIST)
  var now1 = new Date();
  now1.mulMonths(1); // 加减日期操作
  var now3 = new Date();
  now3.mulMonths(3); // 加减日期操作
  var now6 = new Date();
  now6.mulMonths(6); // 加减日期操作
  var now12 = new Date();
  now12.mulYears(1); // 加减日期操作
  var now60 = new Date();
  now60.mulYears(5); // 加减日期操作
  var ago1Month = now1.Format('yyyy/MM/dd')
  var ago3Month = now3.Format('yyyy/MM/dd')
  var ago6Month = now6.Format('yyyy/MM/dd')
  var ago12Month = now12.Format('yyyy/MM/dd')
  var ago60Month = now60.Format('yyyy/MM/dd')
  
  console.log('expected request : ' + pathname)
  console.log(BRAND_UNIT_INFO_LIST)

  var isFirst = pointConfig.devType.isFirst
  if (isFirst || BRAND_UNIT_INFO_LIST.length  == 2) {
    switch (BRAND_UNIT_INFO_LIST[0].profitLossStartD) {
      case '2020/03/30': // 1Month
      case '2020/01/30': // 3Month
      case '2019/10/30': // 6Month
      case '2019/04/30': // 1Year
      case ago1Month: // 1Month
      case ago3Month: // 3Month
      case ago6Month: // 6Month
      case ago12Month: // 1Year
      responseObj = assertsExpectedValAll
      break
      case '2015/04/30': // 5Year
      case '2015/05/01': // 1Year
      case ago60Month:
      responseObj = assertsExpectedEodAll
      break
    }
  } else {
    if (BRAND_UNIT_INFO_LIST[0] != null && BRAND_UNIT_INFO_LIST[0].id == 71) {
      switch(BRAND_UNIT_INFO_LIST[0].profitLossStartD) {
        case '2020/03/30': // 1Month
        case '2020/01/30': // 3Month
        case '2019/10/30': // 6Month
        case '2019/04/30': // 1Year
        case ago1Month: // 1Month
        case ago3Month: // 3Month
        case ago6Month: // 6Month
        case ago12Month: // 1Year
        responseObj = assertsExpectedVal71
        break
        case '2015/04/30': // 5Year
        case '2015/05/01': // 1Year
        case ago60Month:
        responseObj = assertsExpectedEod71
        break
      }
    }
    if (BRAND_UNIT_INFO_LIST[0] != null && BRAND_UNIT_INFO_LIST[0].id == 72) {
      switch(BRAND_UNIT_INFO_LIST[0].profitLossStartD) {
        case '2019/03/30': // 1Month
        case '2020/01/30': // 3Month
        case '2019/10/30': // 6Month
        case '2019/04/30': // 1Year
        responseObj = assertsExpectedVal72
        break
        case '2015/04/30': // 5Year
        case '2015/05/01': // 1Year
        responseObj = assertsExpectedEod72
        break
      }
    }
  }
  responseObj = dateFormat.setOprationSetting(responseObj)
  console.log('expected response Success Start')
  console.log(responseObj)
  console.log('expected response Success end')
  res.send(responseObj)
})

// /v2/user/assets/71/special
router.get('/71/special', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = assertsSpecial71
  var query = reqParam.query
  console.log(pathname)
  responseObj = dateFormat.setOprationSetting(responseObj)
  console.log('special 71 response Success Start')
  console.log(responseObj)
  console.log('special 71 response Success end')
  res.send(responseObj)
})

// /v2/user/assets/72/special
router.get('/72/special', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname
  var query = reqParam.query
  var responseObj = assertsSpecial72
  console.log(pathname)
  responseObj = dateFormat.setOprationSetting(responseObj)
  console.log('special 72 response Success Start')
  console.log(responseObj)
  console.log('special 72 response Success end')
  res.send(responseObj)
})

// /v2/user/assets/71/chart
router.get('/71/chart', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  var query = reqParam.query
  var graphStartD = query.graphStartD
  console.log(pathname)
  responseObj = assertsChart6Month
  console.log('71/chart Readed Success graphStartD: ' + graphStartD)
  res.send(responseObj)
})

// /v2/user/assets/72/chart
router.get('/72/chart', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname
  var query = reqParam.query
  var graphStartD =  query.graphStartD 
  var responseObj = null
  console.log(pathname)
  responseObj = assertsChart6Month
  console.log('72 chart Readed Success graphStartD: ' + graphStartD)
  res.send(responseObj)
})


module.exports = router
