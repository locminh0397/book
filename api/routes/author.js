const express = require('express')
const router = express.Router()

const authorController = require('../controller/authors.controller')
const { verifyToken, isAdmin } = require('../middleware/auth')


router.get('/', authorController.getAll)
router.get('/:id', authorController.getById)
router.post('/',  verifyToken, isAdmin, authorController.create)
router.put('/:id',  verifyToken, isAdmin, authorController.updateById)
router.delete('/:id',  verifyToken, isAdmin, authorController.deleteById)


module.exports = router;
