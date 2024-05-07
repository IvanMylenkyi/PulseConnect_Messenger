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
    const {username,Email,Password, Name, LastName} = req.body;
    if(!username || !Email || !Password){
        res.status(400);
        throw new Error("Mandatory fields are empty");
    }
    const userAviable = await User.findOne({ where: { Email } });
    if (userAviable){
        res.status(400);
        throw new Error("User already registred!");
    }

    //Hash password

    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log("Hashed password: ", hashedPassword);
    const userData = { username, Email, Password : hashedPassword, };
    // Добавляем необязательные поля, если они присутствуют в запросе
    if (Name) {
        userData.Name = Name;
    }
    if (LastName) {
        userData.LastName = LastName;
    }

    const user = await User.create(userData);
    console.log(`User created ${user}`);
    if (user){
        accessToken = jwt.sign({
            user:{
                username: user.username,
                Email: user.Email,
                UserID: user.UserID,
            },
    
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:'15m' }
        );
        console.log(accessToken);
        module.exports=accessToken;
        // res.redirect("/api/users/current");
    }   
    
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
    const {Email, Password} = req.body;
    if (!Email || !Password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({where: {Email} });
    //compare passwoed with hashpassword
    if(user &&(await bcrypt.compare(Password,user.Password))){
        accessToken = jwt.sign({
            user:{
                username: user.username,
                Email: user.Email,
                UserID: user.UserID,
            },
    
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:'15m' }
        );
        console.log(accessToken);
        module.exports=accessToken;
        res.send(200,accessToken)
        // res.redirect('/api/users/current');
    }
    else{
        res.status(401);
        throw new Error("email or password in not valid")
    }
});

const getAccessToken = asyncHandler(async (req, res, next) => {
    // Здесь может быть ваш код для получения access token
    req.accessToken = accessToken; // Пример присвоения токена к объекту запроса (req)
    next();
});

module.exports = getAccessToken;


const currentUser = asyncHandler(async (req,res)=>{
    const contacts = await Contact.findAll({ where: { UserID: req.user.UserID } });

        // Отправляем список контактов в качестве ответа
    res.render('current_user', { user: req.user, contacts:contacts });

});

module.exports={ registerUser, loginUser, currentUser};
