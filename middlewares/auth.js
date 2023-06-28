const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

exports.auth = (req,res,next) => {
    const token = req.header("x-api-key");
    if(!token){
        return res.status(401).json({err:"you need to enter a token"});
    }
    try{
        const decodeToken = jwt.verify(token, config.TOKEN_SECRET);
        req.tokenData = decodeToken;
        next();
    }
    catch(err){
        res.status(401).json({err:"token is invalid or expired!"});
    }
}