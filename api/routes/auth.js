const express = require('express')
const router = express.Router()

const authController = require('../controller/auth.controller')
const { verifyToken } = require('../middleware/auth')


router.post('/google', authController.loginWithGoogle)
router.post('/facebook', authController.loginWithFacebook)

router.post('/create-code', authController.createCodeVerifyEmail)
router.post('/verify-code', authController.verifyCodeEmail)


router.post('/register', authController.register)
router.post('/login-bookstore', authController.loginBookStore)
router.post('/forgot-password', authController.handleForgotPassword)
router.patch('/reset-password', authController.handleResetPassword)

router.post('/refresh-token', authController.handleRefreshToken)
router.get('/current-user', verifyToken, authController.getCurrentUser)
router.get('/logout', verifyToken, authController.handleLogout)


module.exports = router;
