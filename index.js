const path=require("path");
const express=require("express");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const cookieParser=require("cookie-parser");


const app=express();
const PORT=8000;

const Blog=require("./models/blog");
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");
const {checkForAuthenticationCookie} = require("./middlewares/authentication");

//connection
mongoose.connect("mongodb://localhost:27017/blogging").then(()=>{
    console.log("MongoDB connected")
})
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));





app.get("/",async (req,res)=>{
    const allBlogs=await Blog.find({});
    console.log(allBlogs);
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>{
    console.log(`Server is running at PORT: ${PORT}`);
})