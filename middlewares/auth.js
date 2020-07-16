const jwt=require('jsonwebtoken');
const express = require('express');

const router = express.Router()

router.checkReg = (req, res,next) => {
    try {
        const collection = req.app.locals.collection;
        const user = collection.findOne({mail: req.body.mail});
        if (user)
            return res.status(400).send({
                success: false,
                msg: "email is already in use"
            })
        next();

    } catch (e) {
        res.status(500).send({
            success: false,
            msg:e
        })
    }
}

router.tokenCheck=(req, res, next) => {
    let token = req.headers['authorization'] || req.headers['x-access-token']

    if (!token)
        return res.status(400).json({
            success: false,
            msg: 'No token'
        })
    if (token.startsWith('Bearer '))
        token = token.slice(7, token.length)
    if (!token)
        return res.status(400).json({
            success: false,
            msg: 'No token'
        })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (err) {
        console.log('Decode token failed: ', err)
        res.status(400).json({
            success: false,
            msg: err
        })
    }
}
module.exports=router;