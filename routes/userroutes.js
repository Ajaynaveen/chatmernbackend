const express = require('express');
const router = express.Router();
const { signup, login,getdetails,fetchallusers } = require('../controller/UserController')
const authmiddleware=require('../middleware/authmiddleware')



router.post('/signup', signup);


router.post('/login', login);

router.get('/details',authmiddleware.verifytoken,getdetails)

router.get('/fetchusers',authmiddleware.verifytoken,fetchallusers)



module.exports = router;
