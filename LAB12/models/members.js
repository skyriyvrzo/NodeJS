const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true}
})

MemberSchema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('Member', MemberSchema)

module.exports.saveMember = (model, data) => {
    model.save(data)
}
