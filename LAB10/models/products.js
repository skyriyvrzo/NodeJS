const mongoose = require('mongoose')
const {mongo} = require("mongoose");
const dbUrl = 'mongodb://localhost:27017/productDB'

mongoose.connect(dbUrl).catch(err => console.log('❌ Connection Error: ', err))
mongoose.connection.on('connected', () => console.log('✅ MongoDB Connected (Products)'))

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit('🔴 MongoDB Connection Closed')
    process.exit(0)
})


let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

let Product = mongoose.model('products', productSchema)

module.exports = Product
module.exports.saveProduct = (model, data) => {
    model.save(data)
}