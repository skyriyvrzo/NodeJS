const express = require('express');
const router = express.Router();

const products = [
    {name:"โน๊ตบุ๊ค", price:25500, image:"images/products/product1.png"},
    {name:"เสื้อผ้า", price:2000, image:"images/products/product2.png"},
    {name:"หูฟัง", price:1500, image:"images/products/product3.png"}
]

router.get('/', (req, res)=>{
    console.log(products)
    res.render('index.ejs', {products:products});
})

router.post('/insert', (req, res) => {

    req.body.image = "images/products/" + req.body.image;

    products.push(req.body)
    res.redirect('/')
})

router.get('/addForm', (req, res) => {
    res.render('form');
})

router.get('/manage', (req, res) => {
    res.render('manage')
})

module.exports = router;