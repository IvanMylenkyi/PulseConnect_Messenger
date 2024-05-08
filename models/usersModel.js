const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./config/PulseConnect_db.db');
// User model

const User = sequelize.define('User', {
    //user id
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    //username
    username:{
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    //name (optional)
    Name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    //lastname (optional)
    LastName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    //email
    Email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    //password
    Password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
  });


module.exports=User; //export model