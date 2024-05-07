const asyncHadler = require('express-async-handler');
const Contact = require("../models/contactsModel");
const User = require("../models/usersModel");
const Conversation = require("../models/conversationsModel");
const { Op } = require('sequelize');

//@desc get all conversations
//route
//@acces private

const getMessages= asyncHadler(async (req,res)=>{
    try {
        // Получаем список контактов из базы данных

        const contact = await Contact.findByPk(req.params.id);
        const sent_messages = await Conversation.findAll({ where: { SenderID: req.user.UserID, RecipientID: contact.ContactID } });
        const received_messages = await Conversation.findAll({ where: { SenderID: contact.ContactID, RecipientID: req.user.UserID } });
        const messages = await Conversation.findAll({
            where: {
              [Op.or]: [
                { SenderID: req.user.UserID }, // Отправленные сообщения текущим пользователем
                { RecipientID: req.user.UserID } // Полученные сообщения текущим пользователем
              ]
            },
            order: [['createdAt', 'DESC'], ['createdAt', 'DESC']] // Сортировка по дате отправления и получения
          });
          


        // тут надо сделать вид переписки нормальный.
        // Отправляем список контактов в качестве ответа
        let contact_action = `/api/contacts/${contact.ContactID}`;
        res.render('conversations', {sent_messages: sent_messages, received_messages:received_messages,messages:messages,senderId:req.user.UserID,contact_action: contact_action, contact_id: contact.ContactID })
    } catch (error) {
        // В случае ошибки отправляем статус ошибки и сообщение об ошибке
        console.error('Ошибка при получении списка контактов:', error);
        res.status(500).json({ error: 'Произошла ошибка при получении списка контактов' });
    }});


//@desc Create new conversation
//@route Post /api/contacts
//@acces private

const sendMessage=asyncHadler(async(req,res)=>{
    try {
        // Проверка аутентификации пользователя
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Создание контакта с привязкой к текущему пользователю
        const recipient = await Contact.findOne({where:{ContactID:req.params.id}});
        if (recipient){
        const {MessageText} = req.body;
        const messageData = {

            SenderID: req.user.UserID,
            RecipientID: recipient.ContactID
            
        }
        if (req.body.MessageText) {
            messageData.MessageText = req.body.MessageText;
        }


// убрать повторение контактов

            const message = await Conversation.create(messageData);
            res.status(201).json(message);
        
            }
    }
            
        
     catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'An error occurred while adding contact' });
    }
});

//@desc update conversation
//@route put /api/contacts/:id
//@acces private

const updateContact=asyncHadler(async(req,res)=>{
    try {
        const {ContactName} = req.body
        // Проверка аутентификации пользователя
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Поиск контакта для обновления
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        // Проверка, что контакт принадлежит текущему пользователю
        if (contact.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Обновление контакта
          
        
        
        await contact.update({ContactName});
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'An error occurred while updating contact' });
    }
});



module.exports={getMessages, sendMessage};