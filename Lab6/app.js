const express = require('express');
const app = express();
const path = require('path');
const PORT = 80;
const router = require('./routes/myRouter');
app.use(router)

app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});