const express = require('express');
const router = express.Router();
const objectId = require("mongodb").ObjectID;
const jsonParser = express.json();

router.get("/", function (req, res) {
    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.find({}).toArray(function (err, products) {
        if (err) return res.json({success: false, msg: "Продукты не найдены"});
        res.send(products)
    });
});
router.get("/:id", function (req, res) {
    const id = new objectId(req.params.id);
    console.log(id);
    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.findOne({_id: id}, function (err, product) {
        if (err) return res.json({success: false, msg: "Продукт не был добавлен"});
        res.send(product);
    });
});
router.post("/add", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const name = req.body.Name;
    const description = req.body.Description;
    const price = req.body.Price;
    const color = req.body.Color;
    const wire = req.body.Wireless;
    const backlight = req.body.Backlight;
    const producer = req.body.Producer;
    const category = req.body.Category;
    // TODO add photos

    const product = {Name: name, Description: description, Price: price, Color: color, Wireless: wire};

    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.insertOne(product, function (err, result) {

        if (err) return res.json({success: false, msg: " не был добавлен"});
        res.send(product);
    });
});
router.delete("/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return res.json({success: false, msg: "Продукт не был удален"});
        let product = result.value;
        res.send(product);
    });
});
router.put("/update", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const name = req.body.Name;
    const description = req.body.Description;
    const price = req.body.Price;
    const color = req.body.Color;
    const wire = req.body.Wireless;
    const backlight = req.body.Backlight;
    const producer = req.body.Producer;
    const category = req.body.Category;
    // TODO add photos

    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.findOneAndUpdate({_id: id}, {
            $set: {
                Name: name,
                Description: description,
                Price: price,
                Color: color,
                Wireless: wire
            }
        },
        {returnOriginal: false}, function (err, result) {

            if (err) return res.json({success: false, msg: "Продукт не был обновлен"});
            const product = result.value;
            res.send(product);
        });
});
module.exports = router;