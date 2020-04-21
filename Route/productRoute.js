const express = require('express')
const router = express.Router()

const productController = require('../Controller/productController')

router.get('/',productController.Product)

module.exports = router