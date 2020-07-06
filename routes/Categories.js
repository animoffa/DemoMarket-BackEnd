const express = require('express');
const router = express.Router();
const objectId = require("mongodb").ObjectID;
const jsonParser = express.json();

router.get("/", function (req, res) {
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.find({}).toArray(function (err, categories) {
        if (err) return res.json({success: false, msg: "Категории не найдены"});
        res.send(categories)
    });
});
router.get("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    console.log(id);
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOne({_id: id}, function (err, categories) {
        if (err) return res.json({success: false, msg: "Категория не найдена"});
        res.send(categories);
    });
});
router.post("/add", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const name = req.body.name;
    const description = req.body.description;
    // TODO add photos

    const category = {name: name, description: description};
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.insertOne(category, function (err, result) {

        if (err) return res.json({success: false, msg: "Категория не была добавлена"});
        res.send(category);
    });
});
router.delete("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return res.json({success: false, msg: "Категория не удалена"});
        let category = result.value;
        res.send(category);
    });
});
router.put("/update", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const name = req.body.name;
    const description = req.body.description;

    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOneAndUpdate({_id: id}, {$set: {name: name, description: description}},
        {returnOriginal: false}, function (err, result) {

            if (err) return res.json({success: false, msg: "Категория не обновлена"});
            const category = result.value;
            res.send(category);
        });
});

module.exports = router;