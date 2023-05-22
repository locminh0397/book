const User = require('../model/users.model')
const VerifyEmail = require('../model/verifyEmail.model')
const mongoose = require("mongoose");

const userService = {
    getAll: async({}) => {
        try {
            const data = await User.find({})
            const count = await User.countDocuments({})
            return { data, count } 
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    create: async(body) => {
        try {
            const { email, fullName, avatar, service, serviceId } = body
            const newUser = new User({
                email, fullName, avatar, service, serviceId
            })
            const result = await newUser.save()
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getById: async(id) => {
        try {
            const data = await User.findById(id)
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getByEmailRegister: async(email) => {
        try {
            const data = await User.findOne({email: email, "serviceId": {$exists: false}})
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getByEmail: async(email) => {
        try {
            const data = await User.findOne({email})
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getByServiceId: async(serviceId) => {
        try {
            const data = await User.findOne({serviceId: serviceId})
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    getAddressByUserId: async(userId) => {
        try {
            const data = await User.findById(userId).select({"address": 1})
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    createAddressByUserId: async(userId, body) => {
        try {
            const { address } = body
            const addressId = mongoose.Types.ObjectId()
        
            const result = await User.updateOne({_id: userId}, {
               $push: {
                   address: {address: address, _id: addressId}
               }
            })
            return { data: result, addressId }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    createCodeVerifyEmail: async(email, code) => {
        try {
            const newVerifyEmail = new VerifyEmail({email, codeVerifyEmail: code,})
            const result = await newVerifyEmail.save()
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    verifyCodeEmail: async(body) => {
        try {
            const { email, code } = body
            const verifyResult = await VerifyEmail.findOne({email, codeVerifyEmail: code})
            return { data: verifyResult }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    deleteVerifyEmail: async(email) => {
        try {
            const result = await VerifyEmail.deleteOne({email})
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    register: async(body) => {
        try {
            const { email, fullName, password } = body
            const newUser = new User({email, password, fullName})
            const result = await newUser.save()
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    createCodeResetPassword: async(email, code) => {
        try {
            const result = await User.updateOne({email}, {
                codeToResetPassword: code
            })
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    verifyCodeResetPassword: async(code) => {
        try {
            const data = await User.findOne({codeToResetPassword: code})
            return { data }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    handleResetPassword: async(body) => {
        try {
            const { code, password } = body
            const result = await User.findOneAndUpdate({codeToResetPassword: code}, {
                password: password,
                codeToResetPassword: ""
            })
              
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateProfileById: async(userId, body) => {
        try {
            const { fullName, gender, birthday, phoneNumber } = body
            const result = await User.findByIdAndUpdate(userId, {
                fullName, gender, birthday, phoneNumber
            }, {new: true})
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateAddressById: async(userId, addressId, body) => {
        try {
            const { address } = body
            const result = await User.updateOne({_id: userId, "address._id": addressId}, {
                $set: {
                    "address.$.address": address
                }
            })
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    updateDefaultAddressById: async(userId, addressId) => {
        try {
            // Trước khi update address mặc định mới, => tìm address có isDefault = true,
            // set lại bằng false
            const reset = await User.updateOne({_id: userId, "address.isDefault": true}, {
                $set: {
                    "address.$.isDefault": false
                }
            }) 
            const result = await User.updateOne({_id: userId, "address._id": addressId}, {
                $set: {
                    "address.$.isDefault": true
                }
            })
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    deleteAddressById: async(userId, addressId) => {
        try {
            const result = await User.updateOne({_id: userId}, {
                $pull: { address: {_id: addressId} }
            })
            return { data: result }
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    },
    deleteById: async(userId) => {
        try {
            const result = await User.findByIdAndDelete(userId)
            return { data: result }
            
        } catch (error) {
            return {
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            }
        }
    }
}

module.exports = userService
