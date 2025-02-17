const express = require('express');
const router = express.Router();
const connect = require('../config/db')

//เรียกใช้งาน Model
const Product = require('../models/products');
const Member = require('../models/members')
const Sale = require('../models/sales')

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

const title = "ITMI Shop";

// router.get('/', (req, res)=>{
//     Product.find().exec((err, doc)=>{
//         res.render('index.ejs', {products:doc, title: title});
//     })    
// })

router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // ดึงข้อมูลทั้งหมดจาก DB
        res.render("index", {products:products, title: title}); // ส่งไปที่ index.ejs
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/addForm', (req, res)=>{
    const title = "Add New Product";
    res.render('form',{title: title});
})

router.get('/manage', async (req, res)=>{
    const title = "Manage Product";
    try {
        const products = await Product.find(); 
        res.render("manage", {products:products, title: title}); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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

router.get('/delete/:id', async (req, res)=>{
    //console.log("Deltete ID: ", req.params.id);
    try {
        await Product.findByIdAndDelete(req.params.id, {useFindAndModify: false}).exec();
        res.redirect('/manage'); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

// 🔹 Route สำหรับค้นหาสินค้าตามตัวกรองที่ผู้ใช้ป้อน
router.get("/findindex", async (req, res) => {
    res.render('find');
});

router.get("/find", async (req, res) => {
    try {
        let query = {};

        if (req.query.name) {
            query.name = { $eq: req.query.name }; // ค้นหาสินค้าชื่อที่ตรงกับค่าที่ป้อน
        }
        if (req.query.minPrice) {
            query.price = { ...query.price, $gte: parseInt(req.query.minPrice) }; // ค้นหาราคามากกว่าหรือเท่ากับ
        }
        if (req.query.maxPrice) {
            query.price = { ...query.price, $lte: parseInt(req.query.maxPrice) }; // ค้นหาราคาน้อยกว่าหรือเท่ากับ
        }
        if (req.query.exclude) {
            query.name = { $ne: req.query.exclude }; // ค้นหาสินค้าที่ไม่ใช่ชื่อที่กำหนด
        }
        if (req.query.highPriceOnly) {
            query.price = { $gt: 5000 }; // แสดงเฉพาะสินค้าที่ราคาเกิน 5000
        }
        if (req.query.lowPriceOnly) {
            query.price = { $lt: 2000 }; // แสดงเฉพาะสินค้าที่ราคาต่ำกว่า 2000
        }

        const products = await Product.find(query);
        res.render("findResults", { products, title: "ผลการค้นหา" });

    } catch (error) {
        res.status(500).send("เกิดข้อผิดพลาด: " + error.message);
    }
});


router.get('/search', async (req, res) => {
    try {
        let minPrice = req.query.min ? parseFloat(req.query.min) : 0;
        let maxPrice = req.query.max ? parseFloat(req.query.max) : Number.MAX_VALUE;

        //console.log(minPrice, maxPrice);
        let products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        //console.log(products);
        res.render("index", {products:products, title: title});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
    
});


router.get('/:id', async (req, res)=>{
    const title = "Product Detail";    
    try {
        const product_id = req.params.id;
        product = await Product.findOne({_id: product_id}).exec(); 

        //console.log(product);
        res.render("product", {product:product, title: title}); 

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})


router.post('/edit', async (req, res) => {
    const title = "Edit Product";
    try {
        const edit_id = req.body.id;
        //console.log(edit_id);
        product = await Product.findOne({_id: edit_id}).exec();
        //console.log(product); 
        res.render('formedit', {product: product, title: title});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
});

router.post('/update', upload.single("image"), async (req, res) => {    
    try {
        const id = req.body.id;
        const data = { 
            name: req.body.name, 
            price: req.body.price, 
            description: req.body.description 
        };
        if (req.file) {
            data.image = req.file.filename;
        }
        
        // console.log("รหัสสินค้า: ", id);
        // console.log("รายละเอียดสินค้า: ", data);

        await Product.findByIdAndUpdate(id, data, {useFindAndModify: false}).exec();
        await res.redirect('/manage');

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
});

router.get('/sales/all', async (req, res) => {
    const sales = await Sale.find().populate('product').populate('member')
    res.render('sales/showsale', {sales})
})

router.get('/sales/new', async (req, res) => {
    const products = await Product.find()
    const members = await Member.find()
    res.render('sales/newsale', {products, members})
})

router.post('/sales/insert', async (req, res) => {
    const {product, member, quantity} = req.body

    const productData = await Product.findById(product)
    const totalPrice = productData.price * quantity

    const newSale = new Sale({
        product,
        member,
        quantity,
        totalPrice
    })

    await newSale.save
    res.render('/sales/all')
})

module.exports = router;


        // const savedProduct = await newProduct.save();
        // res.redirect('/');

        // const newProduct = new Product({ 
        //     name: req.body.name, 
        //     price: req.body.price, 
        //     image: req.file.filename, 

        //     description: req.body.description 
        // });
        // const savedProduct = await newProduct.save();
        // res.redirect('/');