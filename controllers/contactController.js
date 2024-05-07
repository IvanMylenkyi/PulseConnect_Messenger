const asyncHadler = require('express-async-handler');
const Contact = require("../models/contactsModel");
const User = require("../models/usersModel");

//@desc get all contacts
//route
//@acces private

const getContacts= asyncHadler(async (req,res)=>{
    try {
        // Получаем список контактов из базы данных
        const contacts = await Contact.findAll({ where: { UserID: req.user.UserID } });

        // Отправляем список контактов в качестве ответа
        res.status(200).json(contacts);
    } catch (error) {
        // В случае ошибки отправляем статус ошибки и сообщение об ошибке
        console.error('Ошибка при получении списка контактов:', error);
        res.status(500).json({ error: 'Произошла ошибка при получении списка контактов' });
    }});



//@desc Get contact
//@route get /api/contacts/:id   
//@acces private

const getContact=asyncHadler(async(req,res)=>{
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        let contact_action = `{ContactID:${contact.ContactID}}`;
        res.render('current_contact', { contact: req.contact, contact_action: contact_action, contact_id:contact.ContactID })
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'An error occurred while fetching contact' });
    }
});



//@desc Create new contact
//@route Post /api/contacts
//@acces private

const addContact=asyncHadler(async(req,res)=>{
    try {
        // Проверка аутентификации пользователя
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Создание контакта с привязкой к текущему пользователю

        const {ContactUsername, ContactName, UserID} = req.body;
        


        if(!ContactUsername){
            res.status(400);
            throw new Error("Mandatory fields are empty");
        }
          
        const user = await User.findOne({ where: { username: ContactUsername } });
        if (user) {
            // Получаем данные о контакте
            const contactData = {
                UserID: req.user.UserID, // UserID cоздателя контакта
                ContactID: user.UserID, // UserID контакта
            };
        
            // Добавляем необязательные поля, если они присутствуют в запросе
            if (req.body.ContactName) {
                contactData.ContactName = req.body.ContactName;
            }
        
// убрать повторение контактов

            const contact = await Contact.create(contactData);
            res.status(201).json(contact);
        
            }
        

        
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'An error occurred while adding contact' });
    }
});

//@desc update contact
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

//@desc delete new contact
//@route delete /api/contacts/:id
//@acces private

const deleteContact=asyncHadler(async(req,res)=>{
    try {
        // Проверка аутентификации пользователя
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Поиск контакта для удаления
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        // Проверка, что контакт принадлежит текущему пользователю
        if (contact.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Удаление контакта
        await contact.destroy();
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'An error occurred while deleting contact' });
    }
});



module.exports={getContact, addContact, getContacts, updateContact, deleteContact};
