const express = require('express')
const router = express.Router()
const {check,validationResult } = require('express-validator')

const authcontroller = require('../Controller/authController')
const dashboardController = require('../Controller/dashboardController')
const validate = require('../MiddleWare/Validation')


router.get('/',authcontroller.Login)
router.post('/',validate.authValidate,authcontroller.adminLogin)
router.get('/dashboard',dashboardController.Dashboard)
router.post('/UserLogin',validate.authValidate,authcontroller.JWTLogin)
router.post('/signup',authcontroller.SignUp)


module.exports = router