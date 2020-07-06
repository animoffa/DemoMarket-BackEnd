const express = require('express');
const router = express.Router();
const objectId = require("mongodb").ObjectID;
const jsonParser = express.json();

router.get('/',(req,res) => {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if(pageNo < 0 || pageNo === 0) {
        let response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.count({},function(err,totalCount) {
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"}
        }
        ProductsCollection.find({}).skip(query.skip).limit(size).toArray(function (err, products) {
            if (err) return res.json({success: false, msg: "Продукты не найдены"});
            response = {"error" : false,"totalCount" : totalCount, "products" : products, currentPage:pageNo};
            res.send(response);
        });
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

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const color = req.body.color;
    const wire = req.body.wireless;
    const backlight = req.body.backlight;
    const producer = req.body.producer;
    const category = req.body.category;
    // TODO add photos

    const product = {name: name, description: description, price: price, color: color, wireless: wire};

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
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const color = req.body.color;
    const wireless = req.body.wireless;
    const backlight = req.body.backlight;
    const producer = req.body.producer;
    const category = req.body.category;
    // TODO add photos

    const ProductsCollection = req.app.locals.ProductsCollection;
    ProductsCollection.findOneAndUpdate({_id: id}, {
            $set: {
                name: name,
                description: description,
                price: price,
                color: color,
                wireless: wireless,
                backlight:backlight,
                producer:producer,
                category:category,
            }
        },
        {returnOriginal: false}, function (err, result) {

            if (err) return res.json({success: false, msg: "Продукт не был обновлен"});
            const product = result.value;
            res.send(product);
        });
});
module.exports = router;