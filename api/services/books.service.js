const Book = require('../model/books.model')
const Order = require('../model/orders.model')
const mongoose = require("mongoose");

const bookService = {
    getAll: async({query, page, limit, sort}) => {
        try {
            const skip = (page - 1) * limit

            const data = await Book.find(query)
            .populate('genre')
            .populate('author')
            .populate('publisher')
            .skip(skip).limit(limit).sort(sort)

            const count = await Book.countDocuments(query)
             
            const totalPage = Math.ceil(count / limit)

            return { data, count, totalPage }
          
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getByBookId: async(bookId) => {
        try {
            const data = await Book.findOne({bookId: bookId})
            .populate('author')
            .populate('publisher')
            .populate('genre')
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
            const data = await Book.findById(id)
            .populate('author')
            .populate('publisher')
            .populate('genre')
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
            const data = await Book.findOne({slug})
            .populate('author')
            .populate('publisher')
            .populate('genre')
            return { data }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    checkIsOrdered: async(id) => {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const data = await Order.aggregate([
                { $unwind: "$products" },
                {
                    $group: {
                        _id: "$products.product", 
                    }
                },
                { $match : { _id : ObjectId(id) } }
            ])
            return { data }

        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    search: async({key, page, limit}) => {
        try {
            const skip = (page - 1) * limit
            const data = await Book.aggregate([
                {
                    $lookup: {
                        from: "authors",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                { 
                    $match: {
                        $or: [
                            { name: { $regex: key, $options:"$i" } }, 
                            { "author.name": { $regex: key, $options:"$i" } } 
                        ]
                    }
                },
                { $skip : skip },
                { $limit: limit },
            ])
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
            const { bookId, name, year, genre, author, publisher, description,
                pages, size, price, discount, imageUrl, publicId } = body
            const newBook = new Book({bookId, name, year, genre, description,
                author, publisher, pages, size, price, discount, imageUrl, publicId})
            const result = await newBook.save()
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
            const { name, year, genre, author, publisher, description,
                pages, size, price, discount, imageUrl, publicId } = body
            let result = {}
            if (imageUrl && publicId) {
                result = await Book.findByIdAndUpdate(id, {
                    name, year, genre, author, publisher, description,
                    pages, size, price, discount, imageUrl, publicId
                }, {new: true})
            } else {
                result = await Book.findByIdAndUpdate(id, {
                    name, year, genre, author, publisher, description,
                    pages, size, price, discount
                }, {new: true})
            }
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
            const result = await Book.findByIdAndDelete(id)
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = bookService
