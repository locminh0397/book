const feedbackService = require('../services/feedbacks.service')

const feedbackController = {
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 5
            const sortByDate = req.query.sortByDate

            let sort = {}
            if (sortByDate) sort.createdAt = sortByDate === "asc" ? 1 : -1

            const { data, count, totalPage } = await feedbackService.getAll({page, limit, sort})
            res.status(200).json({
                message: 'success',
                error: 0,
                count,
                data,
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
    create: async(req, res) => {
        try {
            const { data } = await feedbackService.create(req.body)
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
}

module.exports = feedbackController
