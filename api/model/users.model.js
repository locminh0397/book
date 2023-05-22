const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true
    },
    service: { type: String }, // Google, Facebook
    serviceId: { type: String }, //userId Google || Facebook
    password: { type: String },
    fullName: {
        type: String,
        required: true
    },
    // Nam: 0, Nữ 1
    gender: { type: Number, default: 0 },
    birthday: { type: String },
    phoneNumber: { type: String },
    avatar: { type: String, default: 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg' },
    address: [{
        address: { type: String },
        isDefault: { type: Boolean, default: false}
    }],
    codeToResetPassword: { type: String },
    role: { type: Number, default: 0 }
  
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)
