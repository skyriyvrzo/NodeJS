const express = require('express');
const app = express();
const path = require('path');
const myRouter = require('./routes/myrouter'); // นำเข้า myrouter.js
require("dotenv").config();

const session = require("express-session");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(myRouter);  // ใช้ myrouter.js

app.listen(8080, () => {
    console.log("🚀 Starting server at port: 8080");
});




