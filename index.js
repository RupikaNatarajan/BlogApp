const express = require('express')
const path = require('path')
require('dotenv').config
const cookieparser=require('cookie-parser')
const mongoose = require('mongoose')
const Blog  = require('./models/blog')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const { checkForAuthentication } = require('./middlewares/authentication')
const app = express()

const PORT = process.env.PORT

mongoose.connect(process.env.mongo)
.then(()=> console.log("database connected"))
app.set('view engine','ejs')

app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieparser())
app.use(checkForAuthentication("token"))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res)=>{
    const allblogs = await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs: allblogs
    })
})
app.use('/user',userRoute)
app.use('/blog',blogRoute)


app.listen(PORT,()=>{
    console.log("Server is listening")
})