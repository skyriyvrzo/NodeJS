const mongoose = require('mongoose')

let valentineSchema = mongoose.Schema({
    nameOne: String,
    nameTwo: String,
    duration: String,
    firstmet: String,
    placestogo: String,
    image: String
})

let Valentine = mongoose.model('valentinesday', valentineSchema)

module.exports = Valentine
module.exports.saveValentine = (model, data) => {
    model.save(data)
}