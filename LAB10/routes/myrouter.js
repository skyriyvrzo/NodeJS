const express = require('express');
const router = express.Router();
const Product = require('../models/products')
const Valentine = require('../models/valentinesday')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/images/products`) //file path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpg") //auto filename
    }
})

const upload = multer({
    storage: storage
})

const products = [
        {name:"โน๊ตบุ๊ค", price:25500, image:"images/products/product1.png", description:"Notebook"},
        {name:"เสื้อผ้า", price:2000, image:"images/products/product2.png", description:"Clothes"},
        {name:"หูฟัง", price:1500, image:"images/products/product3.png", description:"Earphones"}
    ]
const title = "ITMI Shop";
router.get('/', async (req, res)=>{
    try{
        const products = await Product.find();
        res.render('index.ejs', {products:products, title: title});
    } catch (err) {
        res.status(500).json({message: 'Server Error', error: err.message})
    }
})

router.get('/addForm', (req, res)=>{
    res.render('form');
})

router.get('/manage', (req, res)=>{
    res.render('manage', {products:products});
})

// router.get('/insert',(req, res)=>{
//     console.log(req.query);
//     console.log(req.query.name);
//     console.log(req.query.price);
//     console.log(req.query.image);
//     console.log(req.query.description);
//     res.render('form');
// })

router.post('/insert', upload.single('image'), async (req, res) => {
    try {
        let newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.filename,
            description: req.body.description
        })

        const savedProduct = await newProduct.save()

        // res.status(201).json({message: 'Product added', product: savedProduct})
        // products.push(newProduct); // เพิ่มสินค้าใหม่ใน products
        res.redirect('/'); // กลับไปหน้าแรก
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
})

//Valentine's Day
router.get('/valentine',  async (req, res) => {
    try {
        const valentines = await Valentine.find()
        console.log(valentines)
        res.render('festival/valentine', {valentines: valentines, 'title': 'Valentine\'s Day'})
    } catch (e) {
        res.status(500).json({message: 'Server Error', error: e.message})
    }
})

router.get('/addFormValentine', (req, res)=>{
    res.render('festival/formValentinesDay');
})

router.post('/insertValentine', upload.single('image'), async (req, res) => {
    try {
        let valentines = new Valentine({
            nameOne: req.body.nameOne,
            nameTwo: req.body.nameTwo,
            duration: req.body.duration,
            firstmet: req.body.firstmet,
            placestogo: req.body.placestogo,
            image: req.file.filename
        })

        const save = await valentines.save()

        res.redirect('/valentine');
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
})

module.exports = router;



