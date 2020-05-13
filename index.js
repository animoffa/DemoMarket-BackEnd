const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/Products');
const categories = require('./routes/Categories');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

app.use('/Products',account);
app.use('/Categories',categories);
app.get("/Users", function (req, res) {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, users) {

        if (err) return console.log(err);
        res.send(users)
    });
});
app.get("/Users/:id", function (req, res) {

    const id = new objectId(req.params.id);
    console.log(id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function (err, user) {

        if (err) return console.log(err);
        res.send(user);
    });
});

app.post("/registration", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const mail = req.body.Mail;
    const pass = req.body.Password;
    const user = {Mail: mail, Password: pass};

    const collection = req.app.locals.collection;
    collection.insertOne(user, function (err, result) {

        if (err) return res.json({success: false, msg: "Пользователь не был добавлен"});
        else {
            return res.json({success: true, msg: "Пользователь был добавлен"});
        }
        ;
        res.send(user);
    });
});

app.delete("/Users/:id", function (req, res) {

    const id = new objectId(req.params.id);
    console.log(id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function (err, result) {

        if (err) return console.log(err);
        let user = result.value;
        res.send(user);
    });
});

app.put("/Users", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const basket = req.body.Basket;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, {$set: {Basket: basket}},
        {returnOriginal: false}, function (err, result) {

            if (err) return console.log(err);
            const user = result.value;
            res.send(user);
        });
});

app.post('/auth', (req, res) => {
    const mail = req.body.Mail;
    const password = req.body.Password;

    const collection = req.app.locals.collection;
    collection.findOne({Mail: mail}, function (err, user) {
        if (err) throw err;
        if (!user)
            return res.json({success: false, msg: "Пользователь not found"});

            if (password===user.Password) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600 * 24
                });
                return res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        Name: user.Name,
                        Mail: user.Mail,
                        Basket: user.Basket
                    }
                });
            } else {
                return res.json({success: false, msg: "Пароли не совпадают"});
            }
        });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});