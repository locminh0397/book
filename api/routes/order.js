const express = require('express')
const router = express.Router()

const orderController = require('../controller/orders.controller')
const { verifyToken, verifyUser, isAdmin } = require('../middleware/auth')

router.get('/', verifyToken, verifyUser, orderController.getAll)
router.get('/:id', verifyToken, verifyUser, orderController.getById)
router.post('/', orderController.create)
router.put('/:id/payment-status', orderController.updatePaymentStatusById)
router.put('/:id/status', verifyToken, isAdmin, orderController.updateStatusById)
// router.delete('/:id', orderController.deleteById)

module.exports = router;
