const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.listBooks);
router.get('/create', bookController.showCreateForm);
router.post('/create', bookController.createBook);
router.get('/:id', bookController.getBook);
router.get('/:id/edit', bookController.showEditForm);
router.post('/:id/edit', bookController.updateBook);
router.post('/:id/delete', bookController.deleteBook);

module.exports = router;
