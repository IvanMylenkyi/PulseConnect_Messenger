const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./config/PulseConnect_db.db');
// User model

const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username:{
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    Name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    LastName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    Password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
  });


module.exports=User;