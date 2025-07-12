require("dotenv").config();
const express=require("express");
const app=express();
const PORT=process.env.PORT||8000;
const cors=require("cors")
const multer=require('multer')
const authenticateUser = require('./middleware/auth');
const blogController=require("./controllers/blog")
// const path=require("path");
// const Blog=require("./models/blog")
const userController=require("./controllers/user");
const upload=multer({dest:'uploads/'})
const mongoose=require("mongoose")
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect("mongodb://localhost:27017/blogify")


app.use(cors({
  origin: 'http://blogifyproject-env.eba-3snt3wpf.ap-south-1.elasticbeanstalk.com/api',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));


// app.set('view engine','ejs');
// app.set("views",path.resolve("./views"));

// app.get('/blog/add-new',blogController.getNewBlogPage)

app.post("/api/blog/submit", authenticateUser, upload.single('coverImage'),blogController.createNewBlog)

app.get("/api/",blogController.homePage) 

app.get("/api/blog/:id",blogController.getBlogById)

app.post("/api/blog/delete/:id",authenticateUser, blogController.
deleteBlog)


// app.get("/blog/edit/:id",blogController.getEditBlogPage)


app.post("/api/blog/edit/:id",authenticateUser, blogController.updateBlog)


app.post("/api/user/signup",userController.handleUserSignup)


app.post("/api/user/login",userController.handleUserLogin)


app.listen(PORT,()=>{
    console.log("server is listening at port",PORT);
})