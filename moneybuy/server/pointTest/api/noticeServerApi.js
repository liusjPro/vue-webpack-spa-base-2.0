const express = require('express')
const router = express.Router()
const noticeList = require('../data/notice/res.list')
const noticeRead = require('../data/notice/res.read')
const urlib = require('url')
const dateFormat = require('../dataFormat.js')

router.get('/list', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  console.log(pathname)
  if (pathname.indexOf('list') >= 0) {
    responseObj = noticeList
    var query = reqParam.query
    var PAGE_DATA_CNT =  query.PAGE_DATA_CNT
    var SEQ_NO = reqParam.query.SEQ_NO
    var OPEN_DT = reqParam.query.OPEN_DT
    console.log('PAGE_DATA_CNT: ' + PAGE_DATA_CNT + ' SEQ_NO: ' + SEQ_NO + ' OPEN_DT:' + OPEN_DT)
  }
  responseObj = dateFormat.commonSetting(responseObj)
  console.log('notice list Success')
  res.send(responseObj)
})

router.post('/read', (req, res, next) => {
  var reqParam = urlib.parse(req.url)
  var pathname = reqParam.pathname
  var responseObj = null
  if (pathname.indexOf('read') >= 0) {
    var SEQ_NO = req.body.SEQ_NO
    responseObj = noticeRead
  }
  responseObj = dateFormat.commonSetting(responseObj)
  console.log('notice Readed Success' + SEQ_NO)
  res.send(responseObj)
})

module.exports = router
