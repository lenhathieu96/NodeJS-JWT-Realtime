const express = require('express')
const router = express.Router()

const productController = require('../Controller/productController')
const middleware = require('../MiddleWare/checkToken')

router.get('/',productController.Product)

module.exports = router