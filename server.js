const express =require("express");
const dotenv = require("dotenv").config();
const sequelize = require('./config/dbConnections');
const app = express();
const errorHandler = require("./middleware/errorHandler.js");





const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(errorHandler);
app.use("/api/users",require("./routes/userRoutes.js"));
app.use("/api/contacts",require("./routes/contactRoutes.js"));
app.use("/api/contacts",require("./routes/conversationRoutes.js"));

app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', function (req, res) {
  res.render('index');
});


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
//   });

app.listen(port, ()=>{
    console.log("PulseConnect listening at " + '\x1b[36m%s\x1b[0m', `http://localhost:${port}\n`);
});



