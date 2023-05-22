const Genre = require('../model/genres.model')
const Book = require('../model/books.model')

const genreService = {
    getAll: async({page, limit}) => {
        try {
            const data = await Genre.find({})
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
            const data = await Genre.findById(id)
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getBySlug: async(slug) => {
        try {
            const data = await Genre.findOne({slug})
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
            const newGenre = new Genre({name})
            const result = await newGenre.save()
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
            const result = await Genre.findByIdAndUpdate(id, {
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
            // Khi xóa 1 thể loại => Cần xóa thông tin genre ra khỏi field genre của books
            await Book.updateMany({genre: id }, { genre: null})
            const result = await Genre.findByIdAndDelete(id)
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = genreService
