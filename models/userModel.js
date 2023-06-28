const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

const pMin = 8;
const pMax = 30;
const eMin = 2;
const eMax = 200;

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"user"
    }
},{timestamps:true});

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (id, role = "user") => {
    return jwt.sign({_id:id, role:role}, config.TOKEN_SECRET, {expiresIn:"30min"});
}

exports.validateLogIn = (reqBody) => {
    const joiSchema = joi.object({
        email:joi.string().min(eMin).max(eMax).email().required(),
        password:joi.string().min(pMin).max(pMax).required(),
    })
    return joiSchema.validate(reqBody);
}

exports.validateUser = (reqBody) => {
    const joiSchema = joi.object({
        name:joi.string().min(2).max(100).required(),
        email:joi.string().min(eMin).max(eMax).email().required(),
        password:joi.string().min(pMin).max(pMax).required(),
    });
    
    return joiSchema.validate(reqBody);
}