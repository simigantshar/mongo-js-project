const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel, validateUser, validateLogIn, createToken } = require("../models/userModel");
const router = express.Router();

router.get("/", (req,res) => {
    res.json({msg:"users endpoint!"});
})

router.post("/", async(req,res) => {
    const validateBody = validateUser(req.body);
    if(validateBody.error){
        res.status(400).json(validateBody.error.details);
    }
    try{
        const user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "********";
        res.json(user);
    }
    catch(err){
        if(err.code == 11000){
            return res.status(401).json({error:"account with that email already exists"});
        }
        console.log(err);
        res.status(502).json({err})
    }
});

router.post("/logIn", async(req,res) => {
    const validateBody = validateLogIn(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({err:"email not found!"});
        }
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass){
            return res.status(401).json({err:"password is wrong!"});
        }
        const token = createToken(user._id, user.role);
        res.status(201).json({token: token});
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;