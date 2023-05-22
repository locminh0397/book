const mongoose = require('mongoose')

const Schema = mongoose.Schema

const verifyEmailSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    codeVerifyEmail: { type: String, unique: true, required: true },
  
}, {
    timestamps: true
})


module.exports = mongoose.model('VerifyEmail', verifyEmailSchema)
