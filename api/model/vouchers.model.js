const mongoose = require('mongoose')

const Schema = mongoose.Schema

const voucherSchema = new Schema({
    price_request: {
        type: Number,
        default: 0
    },
    code: { type: String, required: true, unique: true },
    discount: { type: Number },
    quantity: { type: Number },
    used_quantity: { type: Number, default: 0 },
  
}, {
    timestamps: true
})


module.exports = mongoose.model('Voucher', voucherSchema)
