const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/Products');
const categories = require('./routes/Categories');
const jwt = require('jsonwebtoken');

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const mongoClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});

let dbClient;

app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    const db = client.db('HolyKey');
    app.locals.ProductsCollection = db.collection('Products');
    app.locals.CategoriesCollection = db.collection('Categories');
    app.locals.collection = client.db("HolyKey").collection("Users");

    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
});

app.use('/products', account);
app.use('/categories', categories);
app.get("/users", function (req, res) {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, users) {

        if (err) return res.json({success: false, msg: "Пользователи не найдены"});
        res.send(users)
    });
});
app.get("/users/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function (err, user) {

        if (err) return res.json({success: false, msg: "Пользователь не найден"});
        res.send(user);
    });
});

app.post("/registration", jsonParser, function (req, res) {
});

app.delete("/users/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return res.json({success: false, msg: "Пользователь не удален"});
        let user = result.value;
        res.send(user);
    });
});

app.put("/users", jsonParser, function (req, res) {

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

app.post('/auth', (req, res) => {

});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});