const express = require('express');
const router = express.Router();
const iostream = require('./iostream')

// const products = [
//     {name:"โน๊ตบุ๊ค", price:25500, image:"images/products/product1.png", description: "Notebook"},
//     {name:"เสื้อผ้า", price:2000, image:"images/products/product2.png", description: "Clothes"},
//     {name:"หูฟัง", price:1500, image:"images/products/product3.png", description: "Earphones"}
// ]

router.get('/', (req, res)=>{
    // console.log(products)
    const products = iostream.read();
    res.render('index.ejs', {products: products});
})

router.post('/insert', (req, res) => {

    req.body.image = "images/products/" + req.body.image;
    // products.push(req.body)
    iostream.write(req.body)
    res.redirect('/')
})

router.get('/addForm', (req, res) => {
    res.render('form');
})

router.get('/manage', (req, res) => {
    const products = iostream.read();
    res.render('manage', {products: products})
})

module.exports = router;