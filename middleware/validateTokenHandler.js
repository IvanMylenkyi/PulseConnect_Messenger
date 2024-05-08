const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");



const validateToken= asyncHandler(async (req,res, next)=>{
    const accessToken = require("../controllers/userController"); //import accessToken
    req.headers.authorization = `Bearer ${accessToken}`; //add header for auth
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization; // variable of authorization header
    //find authorization header
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]; //get token 
        //verification
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user=decoded.user;
            next();
        });
        //if token invalid
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token missing")
        }
    }
});
module.exports = validateToken; // export method