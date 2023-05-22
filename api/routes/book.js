const express = require('express')
const router = express.Router()

const bookController = require('../controller/books.controller')
const { verifyToken, isAdmin } = require('../middleware/auth')

router.get('/', bookController.getAll)
router.get('/is-ordered/:bookId', bookController.checkIsOrdered)
router.get('/search', bookController.searchBook)
router.get('/bookId/:bookId', bookController.getByBookId)
router.get('/slug/:slug', bookController.getBySlug)
router.get('/:id', bookController.getById)
router.post('/', verifyToken, isAdmin, bookController.create)
router.put('/:id', verifyToken, isAdmin, bookController.updateById)
router.delete('/:id', verifyToken, isAdmin, bookController.deleteById)


module.exports = router;
