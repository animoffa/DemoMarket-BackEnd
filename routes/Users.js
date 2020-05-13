const express = require('express');
const router = express.Router();
const objectId = require("mongodb").ObjectID;
const jsonParser = express.json();

router.get("/", function (req, res) {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, users) {

        if (err) return res.json({success: false, msg: "Пользователи не найдены"});
        res.send(users)
    });
});
router.get("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function (err, user) {

        if (err) return res.json({success: false, msg: "Пользователь не найден"});
        res.send(user);
    });
});


router.delete("/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return res.json({success: false, msg: "Пользователь не удален"});
        let user = result.value;
        res.send(user);
    });
});

router.put("/", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const basket = req.body.Basket;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, {$set: {Basket: basket}},
        {returnOriginal: false}, function (err, result) {

            if (err) return res.json({success: false, msg: "Пользователь не обновлен"});
            const user = result.value;
            res.send(user);
        });
});




module.exports = router;