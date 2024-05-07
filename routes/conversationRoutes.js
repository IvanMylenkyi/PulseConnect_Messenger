const express = require("express");
const router=express.Router();
const {getMessages, sendMessage} = require("../controllers/conversationController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route('/:id/conversations').get(getMessages).post(sendMessage);


module.exports=router;