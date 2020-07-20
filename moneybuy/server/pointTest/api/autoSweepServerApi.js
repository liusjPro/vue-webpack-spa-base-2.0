/* eslint-disable eqeqeq */
const express = require('express')
const router = express.Router()
const atuosweep = require('../data/autosweep/res.autosweep')
const urlib = require('url')
const dateFormat = require('../dataFormat.js')

router.get('/', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = atuosweep
  console.log('request autosweep get ' + pathname)
  responseObj = dateFormat.commonSetting(responseObj)
  console.log('response autoSeeep start')
  console.log(responseObj)
  console.log('response autoSeeep end')
  res.send(responseObj)
})

router.post('/', (req, res, next) => {
  var reqParam = urlib.parse(req.url)
  var responseObj = null
  var BRAND_ID = req.body.BRAND_ID
  console.log('request autosweep set BRAND_ID: ' + reqParam + ':' + BRAND_ID)
  atuosweep.BRAND_ID = req.body.BRAND_ID
  responseObj = atuosweep
  responseObj = dateFormat.commonSetting(responseObj)
  console.log('response autoSeeep start')
  console.log(responseObj)
  console.log('response autoSeeep end')
  res.send(responseObj)
})

module.exports = router
