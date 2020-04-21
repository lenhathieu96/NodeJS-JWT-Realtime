const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const secretKey = require('../Key')
const {createToken, createRefreshToken} =require('./Token') 


module.exports.Login = (req,res)=>{
  res.render('index')
}

  module.exports.JWTWebLogin = (req,res)=>{
    let accountError=[]
    User.findOne({email:req.body.email}, async (err,user)=>{
      if(err) throw new err
       //nếu không trả về error cho client
      if(!user){
        accountError.push('NGười Dùng Không Tồn Tại')
        res.render('index',{
          values:req.body,
          accountError:accountError
        })
      }
      //Nếu tồn tại email kiểm tra password
      if(!user.comparePassword(req.body.password)){
        accountError.push('Sai Mật Khẩu')
        res.render('index',{
          values:req.body,
          accountError:accountError
        })
        return;
      }else{
         //Xác thực thành công trả về token có thời hạn cho người dùng
        const token = createToken(user)
        const refreshToken = createRefreshToken(user)
        res.cookie('token',token,{
          httpOnly:true,
          signed:true
        })
        res.cookie('refreshToken',refreshToken,{
          httpOnly:true,
          signed:true
        })
        res.redirect('/dashboard')
        return;
      }
    })
  }

//Log in bằng JWT =====================================================================================
module.exports.JWTLogin = (req,res)=>{
  //Kiểm tra User có tồn tại trong database hay không
  User.findOne({email:req.body.email}, async (err,user)=>{
    if(err) throw new err
     //nếu không trả về error cho client
    if(!user){
      return res.status(400).send({message:"Authentication failed, User Not Found"})
    }
    //Nếu tồn tại email kiểm tra password
    if(!user.comparePassword(req.body.password)){
      return res.status(400).send("Authentication failed, Wrong Password")
    }else{
      const [token,refreshToken] = await createTokens(user,secretKey.Key,secretKey.refreshKey)
      //Xác thực thành công trả về token có thời hạn 5h cho người dùng
      return res.status(200).json({
        token,refreshToken
      })
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


