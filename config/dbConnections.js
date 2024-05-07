const { Sequelize , DataTypes } = require('sequelize');
const User = require("../models/usersModel");

// Подключение к базе данных SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../PulseConnect_db.db' // Путь к файлу базы данных
});

// Проверяем соединение с базой данных
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
  }
})();


console.log(User === sequelize.models.User);
// // const Conversation = sequelize.define('Conversation', {
// //   // Определение полей модели
// // });

// // const Contact = sequelize.define('Contact', {
// //   // Определение полей модели
// // });

// // Устанавливаем связи между моделями
// // Например:
// User.hasMany(Conversation);
// Conversation.belongsTo(User);

// Синхронизируем схему базы данных с определенными моделями
(async ()=>{
    await sequelize.sync();
})();



module.exports=sequelize;