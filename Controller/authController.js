const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const secretKey = require('../Key')
module.exports.Login = (req,res)=>{
  res.render('index')
}

  module.exports.adminLogin = (req,res)=>{
    let accountError=[]
    if(req.body.email==='admin@123'){
      if(req.body.password==='admin'){
        res.redirect('/dashboard')
        return;
      }else{
        accountError.push('Sai Mật Khẩu')
        res.render('index',{
          values:req.body,
          accountError:accountError
        })
      }
    }else{
      accountError.push('Không Tồn Tại Tên Đăng Nhập')
      res.render('index',{
        values:req.body,
        accountError:accountError
      })
    }
  }

//Log in bằng JWT =====================================================================================
module.exports.JWTLogin = (req,res)=>{
  //Kiểm tra User có tồn tại trong database hay không
  User.findOne({email:req.body.email},(err,user)=>{
    if(err) throw new err
     //nếu không trả về error cho client
    if(!user){
      return res.status(400).send({message:"Authentication failed, User Not Found"})
    }
    //Nếu tồn tại email kiểm tra password
    if(!user.comparePassword(req.body.password)){
      return res.status(400).send("Authentication failed, Wrong Password")
    }else{
      //Xác thực thành công trả về token có thời hạn 5h cho người dùng
      return res.status(200).json({token:jwt.sign({userID:user._id},secretKey,{expiresIn:"5h"})})
    }
  })
}

module.exports.SignUp = (req,res)=>{
  console.log(req.body)
  var user = new User(req.body)
  console.log(user)
  user.password = bcrypt.hashSync(req.body.password,10);
  user.save((err,user)=>{
    if(err) throw new err
    return res.json(user)
  })
  
}


