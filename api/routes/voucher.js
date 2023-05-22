const express = require('express')
const router = express.Router()

const voucherController = require('../controller/vouchers.controller')
const { verifyToken, isAdmin } = require('../middleware/auth')

router.get('/', voucherController.getAll)
router.get('/:id', voucherController.getById)
router.get('/code/:code', voucherController.getByCode)
router.post('/', verifyToken, isAdmin, voucherController.create)
router.put('/:id', verifyToken, isAdmin, voucherController.updateById)
router.delete('/:id', verifyToken, isAdmin, voucherController.deleteById)


module.exports = router;
