const express = require('express');
const app = express();
const path = require('path');
const port = 80
const session = require('express-session')

const router = require('./routes/myrouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=>{
    console.log(`Starting server at port: ${port}`);
})



