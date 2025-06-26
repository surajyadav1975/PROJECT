const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const  {DBConnection} = require("./DB/mongoose.js");
const User = require("./models/User.js");
const Prob = require("./models/Prob.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Isloggedin= require('./middlewares/Isloggedin.js');
const Submissions = require("./models/Submissions.js");

dotenv.config();

const app=express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

DBConnection();

app.get("/", (req, res) => {
  res.status(200).send("🔥 Backend is running for the Online Judge");
});

app.post("/signup",async (req,res)=>{
  try{
    const {username , fullname , email , password , confirmpassword,usertype}=req.body;
    // console.log({username , fullname , email , password , confirmpassword})
  if(password != confirmpassword){
    return res.status(400).json({message: "Password and confirm password doesn't match"  });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  // console.log(existingUser);
  if (existingUser) { return res.status(409).json({ success: false, message: "User with this email already exists"});}

  bcrypt.genSalt(12, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        const user = await User.create({
            username,
            fullname,
            email: email.toLowerCase(),
            password: hash,
            usertype,
        });

        let token = jwt.sign({ 
          id: user._id, 
          email: user.email ,
          usertype: user.usertype
        },process.env.JWT_KEY);

        res.cookie("token",token,{
          httpOnly: true,      
          secure: process.env.NODE_ENV === "production",         
          sameSite: process.env.NODE_ENV === "production"? 'None' : 'Lax',          
          maxAge: 24 * 60 * 60 * 1000, 
        });
        
        return res.status(200).json({message:"Registered"});
      });
  });
  }
  catch(err){
    return res.status(400).json({success: false,message: "Validation failed"});
  }
})

app.post("/login",async (req,res)=>{
  try{
    const {email , password}=req.body;
    if (!(email && password)) {
      return res.status(400).json({success: false,message: "Please provide both email and password"});
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // console.log(user);
    if (!user) {
      return res.status(401).json({success: false,message: "Invalid email or password"});
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if(result){
        let token = jwt.sign({ 
          id: user._id, 
          email: user.email,
          usertype: user.usertype
        },process.env.JWT_KEY);

        res.cookie("token",token,{
          httpOnly: true,      
          secure: process.env.NODE_ENV === "production",         
          sameSite: process.env.NODE_ENV === "production"? 'None' : 'Lax',      
          maxAge: 24 * 60 * 60 * 1000, 
        });
        return res.status(200).json({message:"LoogedIN",userid:user._id});
      }
      else{
        return res.status(400).json({message:"incorrect credentials"});
      }
    });
  }
  catch(err){
    return res.status(400).json({success: false,message: "Validation failed"});
  }
})

app.get('/logout',Isloggedin,(req,res)=>{
  // console.log('hi');
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",         
      sameSite: process.env.NODE_ENV === "production"? 'None' : 'Lax',    
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully!",
    });
})

app.post("/createproblem",Isloggedin,async (req,res)=>{
  console.log("hi");
  try{
    const {title,tag,difficulty,description,testcases}= req.body;
    const prob = await Prob.findOne({ title});
    if (prob) {
      return res.status(401).json({success: false,message: "problem already exist with this name"});
    }
    const p= await Prob.create({
      title,
      tag,
      difficulty,
      description,
      testcases
    });
    // console.log(p);
    res.status(200).json({message:"successfully problem created"})
  }
  catch(err){
    return res.status(400).json({success: false,message: "problem creation failed"});
  }
})

app.get("/problemlist",Isloggedin,async (req,res)=>{

  try{
    // console.log("hi")
    const prob = await Prob.find();
    res.status(200).json({ prob });
  }
  catch(err){
    return res.status(400).json({success: false,message: "failed to fetch problem"});
  }
})

app.put("/edit/:id",Isloggedin,async (req,res)=>{

  try {
        const { id } = req.params;
        const { title, tag, difficulty, description, testcases } = req.body;

        const problem = await Prob.findById(id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        problem.title = title;
        problem.tag = tag;
        problem.difficulty = difficulty;
        problem.description = description;
        problem.testcases = testcases;
        await problem.save();

        res.json({ message: 'Problem updated successfully.' });
    } catch (err) {
        console.error('Error updating problem:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

app.delete("/delete/:id",Isloggedin,async (req,res)=>{

   try {
        const { id } = req.params;

        const problem = await Prob.findById(id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        await Prob.findByIdAndDelete(id);
        res.json({ message: 'Problem deleted successfully.' });
    } catch (err) {
        console.error('Error deleting problem:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

app.get("/problem/:id",Isloggedin,async (req, res) => {
  try {
    const problem = await Prob.findById(req.params.id);
    // console.log(problem)
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, problem });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/submissions/:id",Isloggedin,async (req, res) => {
  try {
    const submissions = await Submissions.find({ user: req.curruser.id, problem: req.params.id });
    // console.log(submissions)
    if (!submissions) {
      return res.status(404).json({ success: false, message: "submissions not found" });
    }
    res.status(200).json({ success: true, submissions });

  } catch (err) {
    // console.error(err);
    res.status(500).json({ success: false, message: "cant fetch submissions" });
  }
});

app.get("/userstats",Isloggedin,async (req, res) => {
  try {
        const userId = req.curruser.id; 

        const submissions = await Submissions.find({user:userId});

        const totalSubmissions = submissions.length;

        const solvedProblems = new Set();

        submissions.forEach((submission) => {
            if (submission.verdict === 'Accepted') {
                solvedProblems.add(submission.problem.toString());
            }
        });

        const problemsSolved = solvedProblems.size;
     
        return res.json({
            problemsSolved,
            submissionsDone: totalSubmissions,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get("/dashboard", Isloggedin, (req, res) => {
    res.status(200).send(req.curruser);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});