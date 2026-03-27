const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

router.get('/', genreController.listGenres);
router.get('/create', genreController.showCreateForm);
router.post('/create', genreController.createGenre);
router.get('/:id', genreController.getGenre);
router.get('/:id/edit', genreController.showEditForm);
router.post('/:id/edit', genreController.updateGenre);
router.post('/:id/delete', genreController.deleteGenre);

module.exports = router;
