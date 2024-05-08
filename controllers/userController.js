const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const Contact = require("../models/contactsModel");
const { use } = require("../routes/userRoutes");
const { json } = require("sequelize");


// @desc Register a user
// @route POST api/users/register
// @access public


const registerUser = asyncHandler( async (req,res)=>{

    const {username,Email,Password, Name, LastName} = req.body; // request body
    //checking mandatory fields
    if(!username || !Email || !Password){
        res.status(400);
        throw new Error("Mandatory fields are empty");
    }
    //check if user in db
    const userAviable = await User.findOne({ where: { Email } });
    if (userAviable){
        res.status(400);
        throw new Error("User already registred!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log("Hashed password: ", hashedPassword);
    const userData = { username, Email, Password : hashedPassword, };
    // Add optional fields if they are present in the request
    if (Name) {
        userData.Name = Name;
    }
    if (LastName) {
        userData.LastName = LastName;
    }
    //create user
    const user = await User.create(userData);
    console.log(`User created ${user}`); // info about user in console

    if (user){
        accessToken = jwt.sign({ //auth user
            user:{
                username: user.username,
                Email: user.Email,
                UserID: user.UserID,
            },
    
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:'30m' } // access token expires in 30m
        );
        console.log(accessToken);
        module.exports=accessToken; // export access token
    }   
    //if invalid user data
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});



// @desc Login a user
// @route POST api/users/login
// @access public

let accessToken; 

const loginUser = asyncHandler(async (req,res)=>{
    const {Email, Password} = req.body; // request body
    //check mandatory fields
    if (!Email || !Password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    //find user in db
    const user = await User.findOne({where: {Email} });
    //compare password with hashpassword and log in
    if(user &&(await bcrypt.compare(Password,user.Password))){
        //auth user
        accessToken = jwt.sign({
            user:{
                username: user.username,
                Email: user.Email,
                UserID: user.UserID,
            },
    
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:'30m' } //access token expires in 30m
        );
        console.log(accessToken);
        module.exports=accessToken; // export access token
        res.send(200,accessToken)
    // if user data invalid
    }
    else{
        res.status(401);
        throw new Error("email or password in not valid")
    }
});

// @desc Login a user
// @route POST api/users/current
// @access private

const currentUser = asyncHandler(async (req,res)=>{
    //display the user page
    const contacts = await Contact.findAll({ where: { UserID: req.user.UserID } });
    console.log(contacts);
    res.render('current_user', { user: req.user, contacts:contacts });
});

module.exports={ registerUser, loginUser, currentUser}; // export methods
