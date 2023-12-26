// app.js
const userroutes=require('./routes/userroutes')
const chatroutes= require("./routes/chatroutes");
const messageroutes=require('./routes/messageroutes')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors=require('cors')
app.use(express.json());
app.use(cors())



app.use('/user',userroutes)
app.use('/chat',chatroutes)
app.use('/message',messageroutes)


module.exports = app;
