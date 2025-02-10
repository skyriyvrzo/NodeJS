
const statusCon = mongoose.connection.readyState;

console.log(`MongoDB Status: ${statusCon}`);


// ออกแบบ Schema

let productSchema = mongoose.Schema({

    name:String,

    price:Number,

    image:String,

    description:String
})


let Product = mongoose.model("products", productSchema)


module.exports = Product


const Product = require('../models/products');


module.exports.saveProduct = function(model, data){
    model.save(data);
}



const newProduct = new Product({ 
        name: req.body.name, 
        price: req.body.price, 
        image: req.file.filename,
        description: req.body.description 
    });


// ดึงข้อมูลทั้งหมด

const getUsers = async () => {

  const users = await User.find();

  console.log('✅ All users:', users);
};

// ดึงข้อมูลเฉพาะคนที่ email = 'alice@example.com'

const getUserByEmail = async () => {

  const user = await User.findOne({ email: 'alice@example.com' });

  console.log('✅ User found:', user);
};

// ดึงข้อมูลด้วย `_id`

const getUserById = async (id) => {

  const user = await User.findById(id);

  console.log('✅ User by ID:', user);
};


getUsers();
getUserByEmail();


router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); 

        res.render("index", {products:products, title: title}); 

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


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


app.post('/upload-multiple', upload.array('files', 5), (req, res) => {

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  res.send(`Uploaded ${req.files.length} files.`);
});


const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png/;

  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new Error('Only images (JPEG, PNG) are allowed.'));
  }
};

const uploadWithLimit = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB file limit
});

app.post('/upload-limited', uploadWithLimit.single('file'), (req, res) => {
    
  res.send('File uploaded within size limit.');
});


const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, 

  position: { type: String, required: true }, 

  salary: { type: Number, required: true, min: 0 }, 

  hireDate: { type: Date, default: Date.now }, 

  isActive: { type: Boolean, default: true }  
});


const saleSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, 

  product: { type: String, required: true }, 

  quantity: { type: Number, required: true, min: 1 }, 

  price: { type: Number, required: true, min: 0 }, 

  total: { type: Number, required: true }, 

  saleDate: { type: Date, default: Date.now } 
});



const createEmployee = async () => {
  const emp = new Employee({
    name: 'สมชาย ใจดี',
    position: 'พนักงานขาย',
    salary: 15000
  });

  await emp.save();

  console.log('✅ พนักงานถูกเพิ่ม:', emp);
};

// เพิ่มการขายใหม่ (โดยอ้างอิงถึงพนักงาน)

const createSale = async () => {
  const employee = await Employee.findOne({ name: 'สมชาย ใจดี' }); 

  if (!employee) return console.log('❌ ไม่พบพนักงาน');

  const sale = new Sale({
    employee: employee._id, 
    product: 'โทรศัพท์มือถือ',
    quantity: 2,
    price: 5000,
    total: 2 * 5000
  });

  await sale.save();

  console.log('✅ เพิ่มข้อมูลการขาย:', sale);
};


