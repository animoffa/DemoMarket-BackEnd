const express = require('express');
const checkReg = require('../middlewares/auth');
const {signup, signin} =require('../controllers/auth');
const bcrypt=require('bcryptjs')
const router = express.Router()
router.post('/signup', checkReg, signup)

router.post('/signin', signin)

module.exports=router;