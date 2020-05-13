const express = require('express');
const router = express.Router();
const objectId = require("mongodb").ObjectID;
const jsonParser = express.json();

router.get("/Categories", function (req, res) {
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.find({}).toArray(function (err, categories) {
        res.send(categories)
    });
});
router.get("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    console.log(id);
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOne({_id: id}, function (err, categories) {
        if (err) return console.log(err);
        res.send(categories);
    });
});
router.post("/add", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const name= req.body.Name;
    const description = req.body.Description;
    const products=req.body.Products;
    // TODO add photos

    const category = {Name: name, Description: description,Products: products};

    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.insertOne(category, function (err, result) {

        if (err) return res.json({success: false, msg: "Пользователь не был добавлен"});

        res.send(category);
    });
});
router.delete("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return console.log(err);
        let category = result.value;
        res.send(category);
    });
});
router.put("/Update", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const name= req.body.Name;
    const description = req.body.Description;
   const Products = req.body.Products;
    // TODO add photos

    const CategoriesCollection = req.app.locals.CategoriesCollection;
    CategoriesCollection.findOneAndUpdate({_id: id}, {$set: {Name: name, Description: description,Products:Products}},
        {returnOriginal: false}, function (err, result) {

            if (err) return console.log(err);
            const category = result.value;
            res.send(category);
        });
});

module.exports = router;