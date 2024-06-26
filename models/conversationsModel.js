const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./config/PulseConnect_db.db');
const {User} = require('../models/usersModel.js');
const {Contact} = require('../models/contactsModel.js');




// Conversations model
const Conversation = sequelize.define('Conversation', {
    //conversation id
    ConversationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    //sender id
    SenderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID'
      }
    },
    //recipient id
    RecipientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'UserID'
      }
    },
    //message text
    MessageText: {
      type: DataTypes.TEXT
    }
  });


module.exports=Conversation; // export model