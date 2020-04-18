const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Author:{
        type:String,
        required:true
    },
    NXB:{
        type:String,
        required:true
    },
    Quantity:{
        type:Number,
        require:true
    },
    Prices:{
        type:Number,
        required:true
    }
}) 
var Product = mongoose.model("Products",productSchema,"Products")
module.exports = Product