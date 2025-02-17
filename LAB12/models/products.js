// ใช้งาน Mongoose
const mongoose = require('mongoose')

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
module.exports.saveProduct = function(model, data) {
    model.save(data);
}






