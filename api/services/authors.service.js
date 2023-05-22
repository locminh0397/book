const Author = require('../model/authors.model')
const Book = require('../model/books.model')

const authorService = {
    getAll: async({page, limit, sort}) => {
        try {
            const skip = (page - 1) * limit
            const data = await Author.find({})
            .skip(skip).limit(limit).sort(sort)

            const count = await Author.countDocuments({})
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
            const data = await Author.findById(id)
            const books = await Book.find({author: {$in: id}})
            return {
                data: {
                    author: data,
                    books,
                }
            }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    create: async(body) => {
        try {
            const { name, year } = body
            const newAuthor = new Author({name, year})
            const result = await newAuthor.save()
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
            const { name, year } = body
            const result = await Author.findByIdAndUpdate(id, {
                name: name, year: year
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
            // Khi xóa 1 tác giả => Cần update lại các sách có tác giả cần xóa = null
            await Book.updateMany({author: id }, { author: null})
            const result = await Author.findByIdAndDelete(id)

            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = authorService
