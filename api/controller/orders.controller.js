const orderService = require('../services/orders.service')
const voucherService = require('../services/vouchers.service')

const orderController = {
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 2
            const sortByDate = req.query.sortByDate
            const userId = req.query.userId

            let query = {}
            if (userId) query.user = { $in : userId}

            let sort = {}
            if (sortByDate) sort.createdAt = sortByDate === "asc" ? 1 : -1
          
            const { data, count, totalPage } = await orderService.getAll({query, page, limit, sort})

            res.status(200).json({
                message: 'success',
                error: 0,
                data,
                count,
                pagination: {
                    page,
                    limit,
                    totalPage,
                }
            })
        } catch (error) {
            res.json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getById: async(req, res) => {
        try {
            const { id } = req.params
            const { data } = await orderService.getById(id)
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy đơn hàng!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            res.json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    create: async(req, res) => {
        try {
            const { userId, email, address, fullName, phoneNumber, voucher, cost, cart, method } = req.body
            let voucherId = ""
            if (voucher) {
                const { data: checkVoucher } = await voucherService.getByCode(voucher)
                if (!checkVoucher) {
                    return res.status(400).json({
                        message: `Voucher này không tồn tại!`,
                        error: 1,
                    })
                }
                if (checkVoucher.used_quantity >= checkVoucher.quantity) {
                    return res.status(400).json({
                        message: `Số lượng sử dụng voucher này đã hết!`,
                        error: 1,
                    })
                }
                voucherId = checkVoucher._id
            }
            const products = cart.map((product) => {
                return {
                    product: product._id,
                    quantity: product.quantity,
                    price: product.price,
                    totalItem: product.totalPriceItem
                }
            })
            const { data } = await orderService.create({
                userId, email, fullName, address, phoneNumber, voucher, cost, products, method
            })

            await voucherService.updateUsedQuantity(voucherId, 1)
          
            return res.status(200).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updatePaymentStatusById: async(req, res) => {
        try {
            const { id } = req.params
            const { data } = await orderService.updatePaymentStatusById(id, req.body)
            res.status(200).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updateStatusById: async(req, res) => {
        try {
            const { id } = req.params
            const { key, text } = req.body
           
            const { data: order } = await orderService.getById(id)
            let paymentStatus = order.isPaid

            if (order.method === 0) {
                paymentStatus = key === 3 ? true : false
            }

            const { data } = await orderService.updateStatusById(id, {
                key, text, paymentStatus
            })
            res.status(200).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    // deleteById: async(req, res) => {
    //     try {
    //         const { id } = req.params
    //         const result = await Order.findByIdAndDelete(id)
    //         if (result) {
    //             return res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data: result
    //             })
    //         } else {
    //             return res.status(400).json({
    //                 message: `Không tìm thấy đơn hàng có id: ${id}`,
    //                 error: 1,
    //                 data: result
    //             })
    //         }
            
    //     } catch (error) {
    //         res.status(400).json({
    //             message: `Có lỗi xảy ra! ${error.message}`,
    //             error: 1,
    //         })
    //     }
    // },
}

module.exports = orderController
