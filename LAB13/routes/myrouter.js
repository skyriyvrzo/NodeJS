const express = require('express');
const router = express.Router();

const connectDB = require("../config/db"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล


//เรียกใช้งาน Multer และกำหนด options
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products') //file part
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg") //auto filename
    }
})

const upload = multer({
    storage: storage
})

//เรียกใช้งาน Model
const Product = require('../models/products');
const Member = require('../models/members');
const Sale = require('../models/sales');

const title = "ITMI Shop";

router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // ดึงข้อมูลทั้งหมดจาก DB
        res.render("index", {products: products, title: title}); // ส่งไปที่ index.ejs
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
});

router.get('/addForm', (req, res) => {
    const title = "Add New Product";
    res.render('form', {title: title});
})

router.get('/manage', async (req, res) => {
    const title = "Manage Product";
    // console.log('Session ID: ', req.sessionID)
    // console.log('Session Data: ', req.session)

    if (req.session.login) {
        try {
            const products = await Product.find();
            res.render("manage", {products: products, title: title});
        } catch (error) {
            res.status(500).json({message: "Server Error", error: error.message});
        }
    } else {
        res.redirect('/login')
    }

})

router.post('/insert', upload.single("image"), async (req, res) => {
    // console.log(req.body);
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
        res.status(500).json({message: "Server Error", error: error.message});
    }
});

router.get('/delete/:id', async (req, res) => {
    //console.log("Deltete ID: ", req.params.id);
    try {
        Product.findByIdAndDelete(req.params.id, {useFindAndModify: false}).exec();
        res.redirect('/manage');
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
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
            query.name = {$eq: req.query.name}; // ค้นหาสินค้าชื่อที่ตรงกับค่าที่ป้อน
        }
        if (req.query.minPrice) {
            query.price = {...query.price, $gte: parseInt(req.query.minPrice)}; // ค้นหาราคามากกว่าหรือเท่ากับ
        }
        if (req.query.maxPrice) {
            query.price = {...query.price, $lte: parseInt(req.query.maxPrice)}; // ค้นหาราคาน้อยกว่าหรือเท่ากับ
        }
        if (req.query.exclude) {
            query.name = {$ne: req.query.exclude}; // ค้นหาสินค้าที่ไม่ใช่ชื่อที่กำหนด
        }
        if (req.query.highPriceOnly) {
            query.price = {$gt: 5000}; // แสดงเฉพาะสินค้าที่ราคาเกิน 5000
        }
        if (req.query.lowPriceOnly) {
            query.price = {$lt: 2000}; // แสดงเฉพาะสินค้าที่ราคาต่ำกว่า 2000
        }

        const products = await Product.find(query);
        res.render("findResults", {products, title: "ผลการค้นหา"});

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
            price: {$gte: minPrice, $lte: maxPrice}
        });
        //console.log(products);
        res.render("index", {products: products, title: title});

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }

});

router.post('/edit', async (req, res) => {
    const title = "Edit Product";
    try {
        const edit_id = req.body.id;
        //console.log(edit_id);
        product = await Product.findOne({_id: edit_id}).exec();
        //console.log(product);
        res.render('formedit', {product: product, title: title});

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
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
        res.status(500).json({message: "Server Error", error: error.message});
    }
});

// 📌 แสดงรายการขายทั้งหมด
router.get("/sales/all", async (req, res) => {
    if (req.session.login) {
        const sales = await Sale.find().populate("product").populate("member");
        res.render("sales/showsale", {sales});
    } else {
        res.redirect('/login')
    }
});

// 📌 ฟอร์มเพิ่มการขาย
router.get("/sales/new", async (req, res) => {
    if (req.session.login) {
        const products = await Product.find();
        const members = await Member.find();
        res.render("sales/newsale", {products, members});
    } else {
        res.redirect('/login')
    }
});

router.get('/indexapi', (req, res) => {
    res.render('indexapi', {title: "เพิ่มสินค้า (API)", products: []});
})

router.get('/api/products', async (req, res) => {
    try {
        let filter = {}
        const {min, max} = req.body

        if (min && max) {
            filter.price = {$gte: parseInt(min), $lte: parseInt(max)}
        }

        const products = await Product.find(filter)
        res.json(products)
    } catch (e) {
        res.status(500).json({message: "Server Error", error: e.message})
    }
})

router.get('/regisapi', (req, res) => {
    res.render('register/regisapi')
})

router.get('/productapi', (req, res) => {
    res.render('product/addproductapi', {title: "เพิ่มสินค้า"})
})

router.post('/api/register', async (req, res) => {
    try {
        const {name, email, phone, password, confirmPassword} = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({message: "Password do not match"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Member({name, email, phone, password: hashedPassword})

        await newUser.save()
        res.status(201).json({message: "Register Success"})
    } catch (err) {
        res.status(500).json({message: "Server Error", error: err.message})
    }
})

router.post('/api/product', upload.single("image"), async (req, res) => {
    console.log(req.body)
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.filename,

            description: req.body.description
        });
        await newProduct.save();
        res.status(201).json({message: "Product added"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
})

// 📌 เพิ่มข้อมูลการขาย
router.post("/sales/insert", async (req, res) => {
    const {product, member, quantity} = req.body;

    const productData = await Product.findById(product);
    const totalPrice = productData.price * quantity;

    const newSale = new Sale({
        product,
        member,
        quantity,
        totalPrice
    });

    await newSale.save();
    res.redirect("/sales/all");
});

// 📌 รายงานการขาย
const moment = require('moment');

router.get("/sales/report", async (req, res) => {
    // ดึงข้อมูล startDate และ endDate จาก query parameters
    const {startDate, endDate} = req.query;

    // กรองข้อมูลการขายตามช่วงเวลา ถ้ามีการเลือก
    let filter = {};
    if (startDate && endDate) {
        // กำหนดเวลาเริ่มต้นและสิ้นสุดของวันที่
        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        filter.date = {$gte: start, $lte: end};
    }

    // ดึงข้อมูลการขายทั้งหมดที่กรองตามช่วงเวลา (ถ้ามี)
    const sales = await Sale.find(filter).populate("product").populate("member");

    // คำนวณยอดรวมตามสินค้า
    let totalSales = 0;
    sales.forEach(sale => {
        totalSales += sale.totalPrice;
    });

    // ส่งข้อมูลไปยังหน้ารายงาน
    res.render("sales/report", {sales, totalSales, startDate, endDate});
});

const bcrypt = require("bcryptjs");

// 📌 แสดงฟอร์มสมัครสมาชิก
router.get("/register", (req, res) => {
    res.render("register/regisindex");
});

// 📌 สมัครสมาชิก (POST)
router.post("/register", async (req, res) => {
    const {name, email, phone, password, confirmPassword} = req.body;

    // ✅ เช็ครหัสผ่านว่าตรงกันหรือไม่
    if (password !== confirmPassword) {
        return res.render("register/regisindex", {error: "Passwords do not match"});
    }

    try {
        // ✅ เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ สร้างสมาชิกใหม่
        const newMember = new Member({
            name,
            email,
            phone,
            password: hashedPassword, // บันทึกรหัสผ่านที่เข้ารหัสแล้ว
        });

        await newMember.save();
        res.redirect("/"); // ไปหน้าเข้าสู่ระบบ
    } catch (error) {
        console.error(error);
        res.render("register/regisindex", {error: "Error registering user"});
    }
});

// 📌 Route แสดงหน้า Login
router.get("/login", (req, res) => {
    res.render("login", {message: req.session.message});
});

// 📌 Route จัดการ Login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await Member.findOne({email});

    if (!user || !(await user.comparePassword(password))) {
        req.session.message = "Invalid email or password!";
        return res.redirect("/login");
    }

    req.session.user = user;
    req.session.login = true;
    req.session.cookie.maxAge = 60000 * 5;
    res.redirect("/dashboard");
});

// 📌 Route แสดงหน้า Dashboard (หลัง Login สำเร็จ)
router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("dashboard", {user: req.session.user});
});

// 📌 Route Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});


router.get('/:id', async (req, res) => {
    const title = "Product Detail";
    try {
        const product_id = req.params.id;
        product = await Product.findOne({_id: product_id}).exec();

        //console.log(product);
        res.render("product", {product: product, title: title});

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
})


module.exports = router;


