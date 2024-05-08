const { Sequelize , DataTypes } = require('sequelize');
const User = require("../models/usersModel");

// Connecting to a SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../PulseConnect_db.db' 
});

// Checking the connection to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('The connection to the database successfully.');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})();

console.log(User === sequelize.models.User);

// Synchronize the database schema models
(async ()=>{
    await sequelize.sync();
})();



module.exports=sequelize;