const {check,validationResult,checkSchema} = require('express-validator')

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

// module.exports.signupValidate = [checkSchema({
//     name:{
//         in:['body'],
//         isLength:{
//             errorMessage:"Do dai ko du",
//             options:{min:7}
//         }
//     },
//     password:{
//         in:['body'],
//         isLength:{
//             errorMessage:"Do dai ko du",
//             options:{min:7}
//         }
//     }
// })],(req,res,next)=>{
//     const Errors = validationResult(req)
//     if(!Errors.isEmpty()){
//         res.send('alo')
//     }else{
//         res.send('ola')
//     }
// }


module.exports.requireAuth = (req,res,next)=>{
    next()
}