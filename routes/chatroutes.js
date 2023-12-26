const express = require("express");
const {
  findOrCreateChat,fetchchat,createGroup,fetchGroups,removeusers,addUserstogroup,deletegroup
} =require('../controller/ChatController')
const authmiddleware=require('../middleware/authmiddleware')

const router = express.Router();

router.route("/").post(authmiddleware.verifytoken, findOrCreateChat);
router.route("/").get(authmiddleware.verifytoken, fetchchat);
router.route("/creategroup").post(authmiddleware.verifytoken, createGroup);
router.route("/groups").get(authmiddleware.verifytoken, fetchGroups);
router.route("/addusers/:id").patch(authmiddleware.verifytoken, addUserstogroup);
router.route("/removeusers/:id").patch(authmiddleware.verifytoken, removeusers);
router.route('/deletegroup/:id').delete(authmiddleware.verifytoken,deletegroup)

module.exports = router;