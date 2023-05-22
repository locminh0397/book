const express = require('express')
const router = express.Router()

const genreController = require('../controller/genres.controller')


router.get('/', genreController.getAll)
router.get('/:id', genreController.getById)
router.get('/slug/:slug', genreController.getBySlug)
router.post('/', genreController.create)
router.put('/:id', genreController.updateById)
router.delete('/:id', genreController.deleteById)


module.exports = router;
