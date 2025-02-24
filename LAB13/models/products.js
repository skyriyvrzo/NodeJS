const mongoose = require('mongoose')

// ออกแบบ Schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

// สร้างและส่งออก Model
module.exports = mongoose.model("Product", productSchema);

// สร้างฟังก์ชันบันทึกข้อมูล
module.exports.saveProduct = function(model, data){
    model.save(data);
}






