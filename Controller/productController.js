const Product = require('../Models/productModel')

module.exports.Product = (req,res)=>{
    res.status(200).json({message:"alo"})
}

module.exports.addProductIO = (data)=>{
    return new Promise((resolve,reject)=>{
        let product = new Product(data)
        product.save()
        .then(()=>{
            resolve()
        })
        .catch(err=>{
            reject(err)
        })
    })
}

module.exports.getAll =()=>{
    return new Promise((resolve,reject)=>{
        Product.find({},function(err,products){
            if(err){
                reject(err)
            }
            resolve(products)
        })
    })
}

module.exports.updateProductIO = (id,data)=>{
    return new Promise((resolve,reject)=>{
        Product.findByIdAndUpdate(id,data)
        .then(()=>resolve())
        .catch(err=>reject(err))
    })
}

module.exports.deleteProductIO = (id)=>{
   return new Promise((resolve,reject)=>{
       Product.findByIdAndRemove(id)
       .then(()=>resolve())
       .catch(err=>reject(err))
   })
}