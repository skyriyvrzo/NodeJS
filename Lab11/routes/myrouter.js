const express = require('express');
const router = express.Router();

//เรียกใช้งาน Multer และกำหนด options
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './public/images/products') //file part
    },
    filename:function(req, file, cb){
        cb(null, Date.now()+".jpg") //auto filename
    }
})

const upload = multer({
    storage:storage
})



//เรียกใช้งาน Model
const Product = require('../models/products');

// const products = [
//         {name:"โน๊ตบุ๊ค", price:25500, image:"images/products/product1.png", description:"Notebook"},
//         {name:"เสื้อผ้า", price:2000, image:"images/products/product2.png", description:"Clothes"},
//         {name:"หูฟัง", price:1500, image:"images/products/product3.png", description:"Earphones"}
//     ]

const title = "ITMI Shop";
let priceFilter = {
    min: "",
    max: ""
}

// router.get('/', (req, res)=>{
//     Product.find().exec((err, doc)=>{
//         res.render('index.ejs', {products:doc, title: title});
//     })    
// })

router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // ดึงข้อมูลทั้งหมดจาก DB
        res.render("index", {products:products, title: title, priceFilter: priceFilter  }); // ส่งไปที่ index.ejs
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        priceFilter = {
            min: req.query.min,
            max: req.query.max
        }

        const min = priceFilter.min === "" ? 0 : priceFilter.min;
        const max = priceFilter.max === "" ? Number.MAX_SAFE_INTEGER : priceFilter.max;

        const products = await Product.find({price: {$gte: min, $lte: max}})

        res.render('index', {products: products, title: title, priceFilter: priceFilter })
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message });
    }
});

router.get('/addForm', (req, res)=>{
    res.render('form');
})

router.get('/manage',async (req, res)=>{
    const title = "Manage Product"
    try {
        const products = await Product.find();
        res.render('manage', {products: products, title: title});
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message });
    }
})

router.post('/insert', upload.single("image"), async (req, res) => {
    //console.log(req.file);
    try {
        // บันทึกข้อมูลสินค้า
        const newProduct = new Product({ 
            name: req.body.name, 
            price: req.body.price, 
            image: req.file.filename, 

            description: req.body.description 
        });
        const savedProduct = await newProduct.save();
        res.redirect('/');

        //res.status(201).json({ message: "Product added", product: savedProduct });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
});

router.get('/delete/:id', async (req, res) => {
    console.log('Delete ID: ', req.params.id)
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id, {useFindAndModify: false}).exec();
        res.redirect('/manage');
    } catch (e) {
        res.status(500).json({message: "Server Error", error: e.message});
    }
});

router.get('/:id', async (req, res) => {
    const title = "Product Detail"
   try {
       const product_id = req.params.id;
       const product = await Product.findOne({_id: product_id}).exec();
       // console.log(product);
       res.render('product', {product: product, title: title})
   } catch (e) {
       res.status(500).json({message: "Server Error", error: e.message});
   }
});

router.post('/edit', async (req, res) => {
    const title = "Edit Product"
    try {
        const edit_id = req.body.id;
        // console.log(edit_id)
        const product = await Product.findOne({_id: edit_id}).exec()
        console.log(product)
        res.render('formedit', {product: product, title: title})
    } catch (e) {
        res.status(500).json({message: "Server Error", error: e.message});
    }
});

router.post('/update', upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id;
        const existingProduct = await Product.findById(id)
        const data = {
            name: req.body.name,
            price: req.body.price,
            image: req.file ? req.file.filename : existingProduct.image,
            description: req.body.description,
        }
        // console.log('ID: ', id)
        // console.log('Data: ',data)

        await Product.findByIdAndUpdate(id, data, {useFindAndModify: false}).exec()
        await res.redirect('/manage')
    } catch (e) {
        res.status(500).json({message: "Server Error", error: e.message});
    }
});

module.exports = router;