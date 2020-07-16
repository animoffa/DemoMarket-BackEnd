const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const account = require('./routes/Products');
const categories = require('./routes/Categories');
const users = require('./routes/Users');
const auth=require('./routes/auth');
const ord = require('./routes/Orders');
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const jsonParser = express.json();
require('dotenv').config()

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
    app.locals.OrdersCollection = db.collection('Orders');
    app.locals.collection = client.db("HolyKey").collection("Users");

    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
});

app.use('/products', account);
app.use('/categories', categories);
app.use('/users',users);
app.use('/auth', auth);

app.get("/Orders", function (req, res) {
    const OrdersCollection = req.app.locals.OrdersCollection;
    OrdersCollection.find({}).toArray(function (err, orders) {
        if (err) return res.json({success: false, msg: "Заказы не найдены"});
        res.send(orders)
    });
});


process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});