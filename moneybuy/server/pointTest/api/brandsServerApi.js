const express = require('express')
const urlib = require('url')
const router = express.Router()
const brandsList = require('../data/brands/res.list')

router.get('/list', (req, res, next) => {
  var reqParam = urlib.parse(req.url, true)
  var pathname = reqParam.pathname 
  var responseObj = null
  console.log(pathname)
  responseObj = brandsList
  console.log('Readed Success')
  res.send(responseObj)
})



module.exports = router
