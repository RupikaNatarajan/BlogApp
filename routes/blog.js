const{Router} = require('express')
const router = Router()
const multer = require('multer')
const path = require('path')
const blog = require('../models/blog')
const comment=require('../models/comment')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${file.originalname}`
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })
router.get('/add-new',(req,res)=>{
    return res.render("addblog",{
        user:req.user
    })
})

router.get('/:id',async(req,res)=>{
  const blogi = await blog.findById(req.params.id).populate('createBy')
  const comments = await comment.find({blogId:req.params.id}).populate("createdBy")
  return res.render("blog",{
    user:req.user,
    blogi,
    comments
  })
})

router.post('/comment/:blogid',async(req,res)=>{
  const Comment = await comment.create({
    content:req.body.content,
    blogId:req.params.blogid,
    createdBy:req.user._id, 
  })
  return res.redirect(`/blog/${req.params.blogid}`)
})

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const{title,body} = req.body
    const Blog = await blog.create({
        body,
        title,
        createBy : req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${Blog._id}`)
})

module.exports = router