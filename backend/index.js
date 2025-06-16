const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const  {DBConnection} = require("./DB/mongoose.js");
const {User} = require("./models/user.js");
const user = require("./models/user.js");
dotenv.config();

const app=express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

DBConnection();

app.get("/", (req, res) => {
  res.status(200).send("🔥 Backend is running for the Online Judge");
});

app.post("/signup",(req,res)=>{

  const {username , fullname , email , password , confirmpassword}=req.body;

  if(password != confirmpassword){
    return res.status(400).json({message: "Password and confirm password doesn't match"  });
  }

  res.status(200).send("succesfully signed up");
})

app.post("/login",(req,res)=>{
  const {username ,email , password}=req.body;
  console.log(req.body)
  res.status(200).send("succesfully logged in");
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});