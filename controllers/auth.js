const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const express = require('express');

const router = express.Router()
const UserFailmsg="Неверный логин или пароль";

router.signup = (req, res) => {
    const collection = req.app.locals.collection;
    const {mail,name, basket, password} = req.body;

    try {
        const newUser={mail,name,basket,isAdmin:false,password: bcrypt.hashSync(password, 8)};
        collection.insertOne(newUser, function (err, result) {
            if (err) return res.json({success: false, msg: "error"});
            res.send(newUser);
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            msg:err
        })
    }
}

router.signin = async (req, res) => {
    const {email, password} = req.body
    console.log (req.body)
    let success=true;
    const collection = req.app.locals.collection;
    try {
        const user = await collection.findOne({mail:email})
        if (!user)
            return res.status(400).json({
                success: false,
                msg:UserFailmsg
            })

        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch)
            return res.status(400).json({
            success: false,
            msg:UserFailmsg
        })
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: 300000})
        res.status(200).json(({
            id: user._id,
            mail: user.mail,
            name: user.name,
            basket: user.basket,
            isAdmin:user.isAdmin,
            success,
            token,
        }))
    } catch (err) {
        res.status(400).json({
            success: false,
            msg:err
        })
    }
}