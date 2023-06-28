const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const toySchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    user_id:String,
},{timestamps:true});

exports.ToyModel = new mongoose.model("toys", toySchema);

exports.validateToys = (reqBody) => {
    const joiSchema = joi.object({
        name:joi.string().min(2).max(50).required(),
        info:joi.string().min(2).max(300).required(),
        category:joi.string().min(2).max(50).required(),
        img_url:joi.string().max(500).required(),
        price:joi.number().min(0).max(100000).required(),
    });

    return joiSchema.validate(reqBody);
}