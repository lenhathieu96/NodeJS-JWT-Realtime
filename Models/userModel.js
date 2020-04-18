const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
/**User Schema */
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },

    gender:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.methods.comparePassword = function(userPassword){
    return bcrypt.compareSync(userPassword,this.password)
}

var User = mongoose.model("Users",userSchema,"Users");
module.exports = User