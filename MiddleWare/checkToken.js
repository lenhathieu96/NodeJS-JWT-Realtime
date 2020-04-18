const jwt = require('jsonwebtoken')
const secrectKey = require('../Key')
module.exports.checkJWT = (req,res,next)=>{
    try{
        const token = req.headers.authorization
        console.log(token)
        jwt.verify(token,secrectKey,(err,payload)=>{
            console.log(payload)
            if(err){
               return res.status(400).send('User Undefined')
            }
            else{
               next()
            }
        })
    }catch(error){
        res.status(400).send("Login Error")
    }
}