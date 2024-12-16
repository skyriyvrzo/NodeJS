const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.status(200).type('text/html').sendFile(path.join(__dirname, '../templates/index.html'))
});

router.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const isFile = path.join(__dirname, `../templates/product${id}.html`);
    // res.send(`<h1>Hello Product ID: ${id}</h1>`);
    // if(id === '1') {
    //     res.sendFile(path.join(__dirname, '../templates/product1.html'));
    // } else if(id === '2') {
    //     res.sendFile(path.join(__dirname, '../templates/product2.html'));
    // } else if(id === '3') {
    //     res.sendFile(path.join(__dirname, '../templates/product3.html'));
    // }

    // res.sendFile(path.join(__dirname, `../templates/product${id}.html`));

    if(fs.existsSync(isFile)){
        res.sendFile(isFile);
    } else {
        res.redirect('/');
    }
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;