const jwt = require('jsonwebtoken');
const User = require('../model/users.model')

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return res.status(401).json({message: '401 Unauthorized'})

    const token = authorizationHeader.split(' ')[1]
    if (!token) return res.status(401).json({message: '401 Unauthorized'})

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) return res.status(403).json({message: '403 Forbidden'})
        const user = await User.findById(data.userId)
        req.user = {userId: data.userId, role: user?.role || 0}
        next()
    })
}

const authorization = (permissions) => {
    return (req, res, next) => {
        const { role } = req.user
        if (!permissions.includes(role)) return res.status(403).json({message: '403 Forbidden'})
        next()
    }
}

const verifyUser = (req, res, next) => {
    try {
        const id = req.params.userId || req.query.userId
        const { role, userId } = req.user
        if (role > 0 || id === userId) {
            next()
        } else {
            return res.json({message: '403 Forbidden'})
        }
    } catch (error) {
        return res.json({message: '403 Forbidden'})
    }
}

const isAdmin = (req, res, next) => {
    const { role } = req.user
    if (role > 0) {
        next()
    } else {
        return res.status(403).json({message: '403 Forbidden'})
    }
}


module.exports = { verifyToken, authorization, verifyUser, isAdmin }