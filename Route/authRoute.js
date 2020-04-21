const express = require('express')
const router = express.Router()


const authcontroller = require('../Controller/authController')
const validate = require('../MiddleWare/Validation')


router.get('/',authcontroller.Login)
router.post('/',validate.authValidate,authcontroller.JWTWebLogin)
router.post('/UserLogin',validate.authValidate,authcontroller.JWTLogin)
router.post('/signup',authcontroller.SignUp)


module.exports = router