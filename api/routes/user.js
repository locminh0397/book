const express = require('express')
const router = express.Router()

const userController = require('../controller/users.controller')
const { verifyToken, verifyUser, isAdmin } = require('../middleware/auth')


router.get('/', userController.getAll)
router.get('/:userId', verifyToken, verifyUser, userController.getById)
router.get('/:userId/address', verifyToken, verifyUser, userController.getAddressById)

router.post('/:userId/address', verifyToken, verifyUser, userController.createAddressById)
router.patch('/:userId/address/status/:addressId', verifyToken, verifyUser, userController.updateDefaultAddressById)
router.patch('/:userId/address/:addressId', verifyToken, verifyUser, userController.updateAddressById)

router.put('/:userId', verifyToken, verifyUser, userController.updateProfileById)


router.delete('/:userId', verifyToken, verifyUser, userController.deleteById)
router.delete('/:userId/address/:addressId', verifyToken, isAdmin, userController.deleteAddressById)


module.exports = router;
