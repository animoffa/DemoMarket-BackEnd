const express = require('express');
const checkReg = require('../middlewares/auth');
const {signup, signin} =require('../controllers/auth');
const bcrypt=require('bcryptjs')
const router = express.Router()
console.log( bcrypt.hashSync('123', 8))
router.post('/signup', checkReg, signup)

router.post('/signin', signin)

module.exports=router;