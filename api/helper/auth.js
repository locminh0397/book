const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

const generateRefreshToken  = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const randomCode = (length) => {
    const data = '0123456789'
    let result = '';
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * (data.length - 1))
        result += data[index];
    }
    return result;
}

function randomString(length) {
    const data = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = '';
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * (data.length - 1))
        result += data[index];
    }
    return result;
}

module.exports = { generateAccessToken, generateRefreshToken, randomCode, randomString }