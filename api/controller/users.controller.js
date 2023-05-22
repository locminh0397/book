const userService = require('../services/user.service')

const usersController = {
    getAll: async(req, res) => {
        try {
            // const page = req.query.page ? parseInt(req.query.page) : 1
            // const limit = req.query.limit ? parseInt(req.query.limit) : 2
            // const skip = (page - 1) * limit
            const { data, count } = await userService.getAll({})
            // const totalPage = Math.ceil(count / limit)
            res.status(200).json({
                message: 'success',
                error: 0,
                count,
                // totalPage,
                data,
                // pagination: {
                //     page,
                //     limit
                // }
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
            const { userId } = req.params
            const { data } = await userService.getById(userId)
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                    
                })
            } else {
                return res.status(200).json({
                    message: 'Không tìm thấy user!',
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
    getAddressById: async(req, res) => {
        try {
            const { userId } = req.params
            const { data } = await userService.getAddressByUserId(userId)
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                    
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy user!',
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
    createAddressById: async(req, res) => {
        try {
            const { userId } = req.params
            const { address } = req.body
            const { data: result, addressId } = await userService.createAddressByUserId(userId, req.body)

            return res.status(200).json({
                message: 'success',
                error: 0,
                data: {
                    result,
                    address: {address, _id: addressId}
                }
            })
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updateProfileById: async(req, res) => {
        try {
            const { userId } = req.params
            const { data: result } = await userService.updateProfileById(userId, req.body)
            if (result) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result
                })
            } else {
                return res.status(400).json({
                    message: `Không tìm thấy user có id:${userId}`,
                    error: 1,
                    data: result
                })
            }
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updateAddressById: async(req, res) => {
        try {
            const { userId, addressId } = req.params
            const { data: result } = await userService.updateAddressById(userId, addressId, req.body)
            if (result.modifiedCount === 1) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result
                })
            }
            res.status(400).json({
                message: `Không tìm thấy!`,
                error: 1,
            })
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updateDefaultAddressById: async(req, res) => {
        try {
            const { userId, addressId } = req.params
            const { data: result } = await userService.updateDefaultAddressById(userId, addressId)
            if (result.modifiedCount === 1) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result
                })
            }
            res.status(400).json({
                message: `Không tìm thấy!`,
                error: 1,
            })
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    deleteAddressById: async(req, res) => {
        try {
            const { userId, addressId } = req.params
            const { data: result } = await userService.deleteAddressById(userId, addressId)
            if (result.modifiedCount === 1) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result
                })
            }
            res.status(400).json({
                message: `Không tìm thấy!`,
                error: 1,
            })
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    deleteById: async(req, res) => {
        try {
            const { userId } = req.params
            const { data: result } = await userService.deleteById(userId)
            if (result) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result
                })
            } else {
                return res.status(400).json({
                    message: `Không tìm thấy user có id:${userId}`,
                    error: 1,
                    data: result
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

module.exports = usersController
