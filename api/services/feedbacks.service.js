const Feedback = require('../model/feedbacks.model')

const feedbackService = {
    getAll: async({page, limit, sort}) => {
        try {
            const skip = (page - 1) * limit
            const data = await Feedback.find({})
            .skip(skip).limit(limit).sort(sort)

            const count = await Feedback.countDocuments({})
            const totalPage = Math.ceil(count / limit)
            return { data, count, totalPage }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    create: async(body) => {
        try {
            const { name, email, content } = body
            const newFeedback = new Feedback({ name, email, content})
            const result = await newFeedback.save()
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
}

module.exports = feedbackService
