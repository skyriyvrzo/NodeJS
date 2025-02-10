
// ใช้งาน Mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/productDB'

mongoose.connect(dbUrl,{
    //useNewUrlParser:true,
    //useUnifiedTopology:true     
}).catch(err=>console.error('❌ Connection Error:', err))

mongoose.connection.on('connected', () => console.log('✅ MongoDB Connected'));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 MongoDB connection closed');
  process.exit(0);
});


// ออกแบบ Schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

// สร้าง Model
let Product = mongoose.model("products", productSchema)

// ส่งออก Model
module.exports = Product

// สร้างฟังก์ชันบันทึกข้อมูล
module.exports.saveProduct = function(model, data){
    model.save(data);
}






