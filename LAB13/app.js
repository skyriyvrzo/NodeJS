const express = require('express');
const app = express();
const path = require('path');
const myRouter = require('./routes/myrouter'); // นำเข้า myrouter.js

const session = require("express-session");
const port = 80

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(myRouter);  // ใช้ myrouter.js

app.listen(port, () => {
    console.log(`🚀 Starting server at port: ${port}`);
});




