const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
})

module.exports = mongoose.model('Member', MemberSchema)

module.exports.saveMember = (model, data) => {
    model.save(data)
}
