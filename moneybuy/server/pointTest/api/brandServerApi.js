const express = require('express')
const urlib = require('url')
const router = express.Router()
const chart71eod = require('../data/brand/res.chart.71.eod')
const chart72eod = require('../data/brand/res.chart.72.eod')

// /v1/brand/chart?BRAND_UNIT_INFO_LIST=[{%22brandId%22:71,%22graphStartD%22:%222015/04/30%22}]
// /v1/brand/chart?BRAND_UNIT_INFO_LIST=[{%22brandId%22:72,%22graphStartD%22:%222015/04/30%22}]
router.get('/chart', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  var query = reqParam.query
  var BRAND_UNIT_INFO_LIST =  query.BRAND_UNIT_INFO_LIST
  if (BRAND_UNIT_INFO_LIST.indexOf('71') >= 0) {
    responseObj = chart71eod
  } else {
    responseObj = chart72eod
  }
  console.log('Readed Success')
  res.send(responseObj)
})

module.exports = router
