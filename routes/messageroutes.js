const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controller/MessageController");
const authmiddleware = require('../middleware/authmiddleware')

const router = express.Router();

router.route("/:chatId").get(authmiddleware.verifytoken, allMessages);
router.route("/").post(authmiddleware.verifytoken, sendMessage);

module.exports = router;