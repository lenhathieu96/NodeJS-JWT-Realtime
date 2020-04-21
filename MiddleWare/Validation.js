const jwt = require('jsonwebtoken')
const {refreshTokens} = require('../Controller/Token')
const SecrectKey = require('../Key')

module.exports.authValidate = (req,res,next)=>{
    var nameErrors=[]
    var passwordErrors=[]
    if(!req.body.email){
        nameErrors.push("Bạn chưa nhập tên đăng nhập")
    }
    if(!req.body.password){
        passwordErrors.push("Bạn chưa nhập mật khẩu")
    }
    if(nameErrors.length||passwordErrors.length){
       res.render('index',{
        values:req.body,
        passwordErrors:passwordErrors,
        nameErrors:nameErrors
       })
       return;
    }
    next()
}


module.exports.requireAuth =  (req,res,next)=>{
    //Kiểm tra token gửi lên từ cookies
    if(req.signedCookies.token){
        //xác minh token
        jwt.verify(req.signedCookies.token,SecrectKey.Key, async (err,payload)=>{
            //token lỗi, có thể do hết hạn hoặc do token giả
            if(err){
                //Kiểm tra refreshToken gửi lên từ cookies
                console.log("incorrect token")
                if(req.signedCookies.refreshToken){
                    console.log(req.signedCookies.refreshToken)
                    refreshTokens(req.signedCookies.refreshToken)
                    .then(token=>console.log(token, "this is new token"))
                    .catch(err=>{
                        res.redirect('/')
                    })
                }else{
                    console.log("refreshToken is Null")
                    res.redirect('/')
                }
                return; 
            }
            //token hợp lê, chuyển sang middleware tiếp theo
            console.log("correct token")
            next()
            return;
        })
        
    }
    else{
        res.redirect('/')
    }

    
}