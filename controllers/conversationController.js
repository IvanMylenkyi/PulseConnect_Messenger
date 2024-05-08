const asyncHadler = require('express-async-handler');
const Contact = require("../models/contactsModel");
const User = require("../models/usersModel");
const Conversation = require("../models/conversationsModel");
const { Op } = require('sequelize');

//@desc get all messages
//route /api/contacts/:id/conversations
//@acces private

const getMessages= asyncHadler(async (req,res)=>{
    try {
        // We get a contact from db
        const contact = await Contact.findByPk(req.params.id);
        //sort of messages
        const messages = await Conversation.findAll({
            where: {
              [Op.or]: [
                { SenderID: req.user.UserID }, // Sent messages to the current user
                { RecipientID: req.user.UserID } // Messages received by the current user
              ]
            },
            order: [['createdAt', 'DESC'], ['createdAt', 'DESC']] // Sort by the date of departure and receipt
          });
        //display the conversation page
        const name= await User.findOne({where:{username:req.user.UserID}})
        res.render('conversations', {messages:messages, ContactName:name})
        // In case of error, send the status of an error and an error message

    } catch (error) {
        console.error('Error when receiving a list of contacts:', error);
        res.status(500).json({ error: 'An error occurred when receiving a list of contacts' });
    }});


//@desc send message
//@route Post /api/contacts/:id/conversations
//@acces private

const sendMessage=asyncHadler(async(req,res)=>{
    try {
        // Checking user authentication
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // select recipient
        const recipient = await Contact.findOne({where:{ContactID:req.params.id}});
        //if selected successful
        if (recipient){
        const {MessageText} = req.body; //reqest body
        //Data
        const messageData = {

            SenderID: req.user.UserID, // SenderID
            RecipientID: recipient.ContactID //RecipientID
            
        }
        // get message text
        if (req.body.MessageText) {
            messageData.MessageText = req.body.MessageText;
        }
        //create message in db & send
            const message = await Conversation.create(messageData);
            res.status(201).json(message); //json message
        
            }
    }
            // In case of error, send the status of an error and an error message
     catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'An error occurred while adding contact' });
    }
});



module.exports={getMessages, sendMessage}; //export methods