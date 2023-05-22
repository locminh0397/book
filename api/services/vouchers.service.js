const Voucher = require('../model/vouchers.model')

const voucherService = {
    getAll: async({query, page, limit, sort}) => {
        try {
            const skip = (page - 1) * limit

            const data = await Voucher.find(query).skip(skip).limit(limit).sort(sort)
            const count = await Voucher.countDocuments(query)

            const totalPage = Math.ceil(count / limit)
            return { data, count, totalPage }

        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getById: async(id) => {
        try {
            const data = await Voucher.findById(id)
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getByCode: async(code) => {
        try {
            const data = await Voucher.findOne({code: code})
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    create: async(body) => {
        try {
            const { price_request, code, discount, quantity } = body
            const newVoucher = new Voucher({price_request, code, discount, quantity})
            const result = await newVoucher.save()
            return { data: result}
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateById: async(id, body) => {
        try {
            const { price_request, discount, quantity } = body
            const result = await Voucher.findByIdAndUpdate(id, {
                price_request, discount, quantity
            }, {new: true})
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateUsedQuantity: async(id, value) => {
        try {
            const result = await Voucher.findByIdAndUpdate(id,
                { $inc: { used_quantity: value } }
            )
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    deleteById: async(id) => {
        try {
            const result = await Voucher.findByIdAndDelete(id)
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = voucherService
