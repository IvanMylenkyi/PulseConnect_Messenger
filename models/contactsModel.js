
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./config/PulseConnect_db.db');
const {User} = require('../models/usersModel.js');



//  Contacts model
//define contact model
const Contact = sequelize.define('Contact', {
  //User id
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, //refer model User
      key: 'UserID'//refer on key
    }
  },
  //contact id
  ContactID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, //refer model User
      key: 'UserID' //refer on key
    }
  },
  //Contact name (optional)
  ContactName: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  //id
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
});


module.exports = Contact; //export model
