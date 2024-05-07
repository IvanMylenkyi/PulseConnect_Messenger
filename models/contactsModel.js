
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./config/PulseConnect_db.db');
const {User} = require('../models/usersModel.js');



//  Contacts model
const Contact = sequelize.define('Contact', {
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  ContactID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID'
    }
  },
  ContactName: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
});

// Установка связи между таблицами Users и Contacts

// сreate foreign keys for table Contacts
(async () => {
  try {
    await sequelize.query('PRAGMA foreign_keys=ON'); // Включаем поддержку внешних ключей
    await sequelize.query('PRAGMA foreign_keys_list'); // Проверяем список внешних ключей
    await sequelize.query('PRAGMA foreign_key_check'); // Проверяем целостность внешних ключей
    await sequelize.query('PRAGMA foreign_key_list(Contacts)'); // Показываем список внешних ключей для таблицы Contacts
    console.log('Foreign keys for Contacts created successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
})();


module.exports = Contact;
