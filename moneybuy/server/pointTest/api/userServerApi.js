const express = require('express')
const urlib = require('url')
const router = express.Router()
const maintenance = require('../data/user/res.maintenance')
const userStatus = require('../data/user/res.status')
const pointConfig = require('../pointConfig')

router.get('/maintenance', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = maintenance
  responseObj.MAINTENANCE_FLG = pointConfig.devType.MAINTENANCE_FLG
  console.log(pathname)
  console.log('Readed Success')
  res.send(responseObj)
})
 
router.get('/maintenance1', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = maintenance
  responseObj.MAINTENANCE_FLG = pointConfig.devType.MAINTENANCE_FLG
  console.log('Readed Success')
  res.send(responseObj)
})

// 1 : new user 2: old user
router.get('/status', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = userStatus
  // 0:保有していない (is first) 　1:保有している  2:全売却 
  responseObj.POSSESS_BRAND_FLG = pointConfig.devType.POSSESS_BRAND_FLG
  responseObj.ATTENTION_FLG = pointConfig.devType.ATTENTION_FLG // 0: popup 1 : popupしない
  responseObj.REAL_POINT = pointConfig.devType.myRealAmount
  // 0:キャンペーン適用対象外 1:キャンペーン適用対象、当選未確認 2:キャンペーン適用対象、当選確認済
  responseObj.CAMPAIGN_APPLIED_FLG = pointConfig.devType.CAMPAIGN_APPLIED_FLG

  console.log('user status request success: ' + pathname)
  console.log('POSSESS_BRAND_FLG: ' + responseObj.POSSESS_BRAND_FLG + ' ATTENTION_FLG:' + responseObj.ATTENTION_FLG  + ' CAMPAIGN_APPLIED_FLG: ' + responseObj.CAMPAIGN_APPLIED_FLG )
  console.log(responseObj)

  res.send(responseObj)
})

// 1 : new user 2: old user
router.post('/status', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = userStatus
  responseObj.POSSESS_BRAND_FLG = 1
  responseObj.ATTENTION_FLG = 1 // 0: popup 1 : popupしない
  responseObj.REAL_POINT = pointConfig.devType.myRealAmount
  // 0:キャンペーン適用対象外 1:キャンペーン適用対象、当選未確認 2:キャンペーン適用対象、当選確認済
  responseObj.CAMPAIGN_APPLIED_FLG = 0
  console.log('user post status request success: ' + pathname)
  res.send(responseObj)
})

module.exports = router
