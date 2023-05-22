const Publisher = require('../model/publishers.model')
const Book = require('../model/books.model')

const publisherService = {
    getAll: async({page, limit}) => {
        try {
            const data = await Publisher.find({})
            return { data }
        } catch (error) {
             return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getById: async(id) => {
        try {
            const data = await Publisher.findById(id)
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
            const { name } = body
            const newPublisher = new Publisher({name})
            const result = await newPublisher.save()
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateById: async(id, body) => {
        try {
            const { name } = body
            const result = await Publisher.findByIdAndUpdate(id, {
                name: name
            }, {new: true})
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
            // Khi xóa 1 NXB=> Cần update lại các sách có NXB cần xóa = null
            await Book.updateMany({publisher: id }, { publisher: null})
            const result = await Publisher.findByIdAndDelete(id)
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = publisherService
