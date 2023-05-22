const Order = require('../model/orders.model')
const Voucher = require('../model/vouchers.model')

const orderService = {
    getAll: async({query, page, limit, sort}) => {
        try {
            const skip = (page - 1) * limit

            const data = await Order.find(query).skip(skip).limit(limit).sort(sort)

            const count = await Order.countDocuments(query)
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
            const data = await Order.findById(id).populate("user").populate("products.product")
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
            const { userId, email, address, fullName, phoneNumber, voucher, cost, products, method } = body
          
            const newOrder = new Order({
                user: userId, 
                email, fullName, address, phoneNumber, voucher, cost, products, method
            })
            const result = await newOrder.save()
            return { data: result }
        
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updatePaymentStatusById: async(id, body) => {
        try {
            const { paymentStatus } = body

            const result = await Order.findByIdAndUpdate(id,  {
                isPaid: paymentStatus
            }, {new: true})
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateStatusById: async(id, body) => {
        try {
            const { key, text, paymentStatus } = body
           
            const result = await Order.findByIdAndUpdate(id,  {
                status: { key, text },
                isPaid: paymentStatus
            }, {new: true})
           return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    // Thong ke
    getTotalRevenue: async() => {
        try {
            const data = await Order.aggregate([
                {
                    $group: {
                    _id: null,
                    revenue: { $sum: "$cost.total" },
                    },
                },
            ])
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getRevenueWeek: async(query) => {
        try {
            const { start, end } = query
            const data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                      },
                    },
                },
                {
                    $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$cost.total" },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getRevenueLifeTime: async() => {
        try {
            const data = await Order.aggregate([
                {
                    $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$cost.total" },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            return { data  }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getCountOrderLifeTime: async() => {
        try {
            const data = await Order.aggregate([
                {
                    $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getBestSeller: async() => {
        try {
            const data = await Order.aggregate([
                { $unwind: "$products" },
                {
                    $group: {
                        _id: "$products.product", 
                        count: { $sum: "$products.quantity" }
                    }
                },
                {
                    $lookup: {
                        from: "books", 
                        localField: "_id",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
               
            ])
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
}

module.exports = orderService
