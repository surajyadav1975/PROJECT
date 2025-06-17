const jwt=require("jsonwebtoken");
const User=require("../models/User");

module.exports=async function(req,res,next){
    // console.log(req.cookies.token);
    if(!req.cookies.token){
        return res.json({message:"you havent loggedin, try logging in"});
    }

    try{
        let decoded=jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let u=await User.findOne({email:decoded.email});
        // console.log(u);
        req.curruser=u;
        next();
    }catch(err){
    
        return res.json("error occured");
        return res.redirect("/");
    }
}