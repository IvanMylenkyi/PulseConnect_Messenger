const asyncHadler = require('express-async-handler');
const Contact = require("../models/contactsModel");
const User = require("../models/usersModel");

//@desc get all contacts
//route get /api/contacts/
//@acces private

const getContacts= asyncHadler(async (req,res)=>{
    try {
        // We get a list of contacts from the database
        const contacts = await Contact.findAll({ where: { UserID: req.user.UserID } });

        // We send a list of contacts as an answer
        res.status(200).json(contacts);
    } catch (error) {
        // In case of error, send the status of an error and an error message
        console.error('Error when receiving a list of contacts:', error);
        res.status(500).json({ error: 'An error occurred when receiving a list of contacts' });
    }});



//@desc Get contact
//@route get /api/contacts/:id   
//@acces private

const getContact=asyncHadler(async(req,res)=>{
    try {
        // select a contact from id
        const contact = await Contact.findByPk(req.params.id); 
        // if contact not found
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        let contact_action = `{ContactID:${contact.ContactID}}`; //variable for client side
        res.render('current_contact', { contact_action: contact_action, contact_id:contact.ContactID }) // display the page
        // In case of error, send the status of an error and an error message
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
        // Checking user authentication
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const {ContactUsername, ContactName, UserID} = req.body; //request body
        // chek mandatory fields
        if(!ContactUsername){
            res.status(400);
            throw new Error("Mandatory fields are empty");
        }
        // Creation of contact with a reference to the current user
        const user = await User.findOne({ where: { username: ContactUsername } });
        if (user) {
            // We get contact data
            const contactData = {
                UserID: req.user.UserID, // UserID creator of contact
                ContactID: user.UserID, // UserID contact
            };
        
            // Add optional fields if they are present in the request
            if (req.body.ContactName) {
                contactData.ContactName = req.body.ContactName;
            }
            
            //create contact
            const contact = await Contact.create(contactData);

            res.status(201).json(contact); //display the contact json
        
            }
            //if user does not exist
        else{
            res.status(400).json({error:'User does not exist'})
        }

       // In case of error, send the status of an error and an error message 
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'An error occurred while adding contact/contact already added' });
    }
});

//@desc update contact
//@route put /api/contacts/:id
//@acces private

const updateContact=asyncHadler(async(req,res)=>{
    try {
        const {ContactName} = req.body
        // Checking user authentication
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Contact search for updating
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        // Check that the contact belongs to the current user
        if (contact.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Contact update
          
        await contact.update({ContactName});
        res.status(200).json(contact); // display contact json
        // In case of error, send the status of an error and an error message
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
        // Checking user authentication
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Contact search for removal
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        // Check that the contact belongs to the current user
        if (contact.UserId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Contact removal
        await contact.destroy();
        res.status(200).json({ message: 'Contact deleted successfully' }); //display message about delete contact
        // In case of error, send the status of an error and an error message
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'An error occurred while deleting contact' });
    }
});


module.exports={getContact, addContact, getContacts, updateContact, deleteContact}; //export methods
