const express=require('express');
const { signUp, logIn, logOut, createProblem, problemList, editProblem, deleteProblem, fetchProblem, fetchSubmissions, userStats, aihints } = require('../controllers/Controllers');
const Isloggedin = require('../middlewares/Isloggedin');

const router=express.Router()

router.get("/",function(req,res){
    res.status(200).send("🔥 Backend is running for the Online Judge");
});

router.post("/signup",signUp);
router.post("/login",logIn);
router.get("/logout",Isloggedin,logOut);
router.post("/createproblem",Isloggedin,createProblem);
router.get("/problemlist",Isloggedin,problemList);
router.put("/edit/:id",Isloggedin,editProblem);
router.delete("/delete/:id",Isloggedin, deleteProblem);
router.get("/problem/:id",Isloggedin,fetchProblem);
router.get("/submissions/:id",Isloggedin,fetchSubmissions);
router.get("/userstats",Isloggedin,userStats);
router.post("/aihints",Isloggedin,aihints);
router.get("/dashboard", Isloggedin, (req, res) => {
    res.status(200).send(req.curruser);
});

module.exports=router;