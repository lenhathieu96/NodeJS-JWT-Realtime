const express = require('express')
const router = express.Router()

const dashboardController = require('../Controller/dashboardController')

router.get('/',dashboardController.Dashboard)

module.exports = router