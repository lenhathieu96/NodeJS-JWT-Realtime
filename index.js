require('dotenv').config({path:'./.env'})

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(
    console.log("ket noi database thanh cong")
)

const authRoute = require('./Route/authRoute')
const productRoute = require('./Route/productRoute')
const checkToken = require('./MiddleWare/checkToken')
const controlProduct = require('./Controller/productController')

const port = 3000

app.set('view engine','pug')
app.set('views','./Views')

app.use(express.static('Views'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use('/',authRoute)
app.use('/product',checkToken.checkJWT,productRoute)

io.on('connect',(socket)=>{
    console.log('a user connected')

    socket.on('getAll',()=>{
        controlProduct.getAll()
        .then(product=>{
            socket.emit('data',product)
        })
        .catch(err=>{console.log(err)})
    })

    socket.on('insert',(data)=>{
       
       controlProduct.addProductIO(data)
       .then(()=>{
           console.log('sucess')
           socket.emit('edit_result',true)
           controlProduct.getAll()
           .then(product=>{
               socket.emit('data',product)
               socket.broadcast.emit('data',product)
            })
           .catch(err=>{console.log(err)})
        //    socket.emit('data','du lieu ne')
           
        })
       .catch((err)=>{
            console.log(err)
            socket.emit('edit_result',false)
       })    
    })

    socket.on('update',(data)=>{
       controlProduct.updateProductIO(data._id,data.Product)
       .then(()=>{
            socket.emit('edit_result',true)
            controlProduct.getAll()
            .then(product=>{
                socket.emit('data',product)
                socket.broadcast.emit('data',product)
            })
       })
       .catch(err=>{
        console.log(err)
        socket.emit('edit_result',false)
       })
        
    })

    socket.on('delete',(id)=>{
        controlProduct.deleteProductIO(id)
        .then(()=>{
            socket.emit('delete_result',true)
            controlProduct.getAll()
            .then(product=>{
                socket.emit('data',product)
                socket.broadcast.emit('data',product)
            })
       })
       .catch(err=>{
        console.log(err)
        socket.emit('delete_result',false)
       })
    })
})

http.listen(port,()=>console.log("server started on port: " + port))