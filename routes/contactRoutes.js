const express = require("express");
const router=express.Router();
const {getContacts, addContact, getContact, updateContact, deleteContact} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route('/').get(getContacts).post(addContact);
router.route('/:id').get(getContact);
router.route('/:id/del').post(deleteContact);
router.route('/:id/upd').post(updateContact);


module.exports=router;