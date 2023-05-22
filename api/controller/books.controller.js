const bookService = require('../services/books.service')
const { cloudinary, deleteCloudinary } = require('../config/cloudinary')

const bookController = {
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const sortByPrice = req.query.sortByPrice 
            const sortByDate = req.query.sortByDate
            const { genre, key } = req.query

            const query = {}
            const sort = {}

            if (genre) query.genre = { $in : genre}
            if (key) query.name = { $regex: key, $options:"$i" }

            if (sortByPrice) sort.price = sortByPrice === "asc" ? 1 : -1
            if (sortByDate) sort.createdAt = sortByDate === "asc" ? 1 : -1

            const { data, count, totalPage } = await bookService.getAll({query, page, limit, sort})
            
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
    getByBookId: async(req, res) => {
        try {
            const { bookId } = req.params
            const { data } = await bookService.getByBookId(bookId) 

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy sách!',
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
    getById: async(req, res) => {
        try {
            const { id } = req.params
           const { data } = await bookService.getById(id)

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy sách!',
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
    getBySlug: async(req, res) => {
        try {
            const { slug } = req.params
            const { data } = await bookService.getBySlug(slug)

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy sách!',
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
    checkIsOrdered: async(req, res) => {
        try {
            const { bookId } = req.params
            const { data } = await bookService.checkIsOrdered(bookId)

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy!',
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
    searchBook: async(req, res) => {
        try {
            const { key } = req.query
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 0
            const { data } = await bookService.search({key, page, limit})

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy sách!',
                    error: 1,
                    data: []
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
            const { bookId } = req.body
            const { data: isExist } = await bookService.getByBookId(bookId)
            if (isExist) return res.json({message: "bookId đã tồn tại!", error: 1}) 
            const { data } = await bookService.create(req.body)
            return res.status(200).json({
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
    updateById: async(req, res) => {
        try {
            const { id } = req.params
            const { imageUrl, publicId } = req.body
            let data = {}
            if (imageUrl && publicId) {
                const { data: bookUpdate } = await bookService.getById(id)
                const publicIdDelete = bookUpdate.publicId
                if (publicIdDelete) {
                    const resultCloudinary = await deleteCloudinary(cloudinary, publicIdDelete)
                    console.log(resultCloudinary)
                }
                const result = await bookService.updateById(id, req.body)
                data = result.data
            } else {
                const result = await bookService.updateById(id, req.body)
                data = result.data
            }
         
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(400).json({
                    message: `Không tìm thấy sách có id:${id}`,
                    error: 1,
                    data
                })
            }
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    deleteById: async(req, res) => {
        try {
            const { id } = req.params
            const { data: isOrdered } = await bookService.checkIsOrdered(id)
            if (isOrdered) return res.json({message: 'Sản phẩm đã được mua!',error: 1})
            const { data } = await bookService.deleteById(id)
            if (data) {
                const publicIdDelete = data.publicId
                const resultCloudinary = await deleteCloudinary(cloudinary, publicIdDelete)
                console.log(resultCloudinary)

                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(400).json({
                    message: `Không tìm thấy sách có id:${id}`,
                    error: 1,
                    data
                })
            }
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    }
}

module.exports = bookController
