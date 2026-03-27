const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

router.get('/', publisherController.listPublishers);
router.get('/create', publisherController.showCreateForm);
router.post('/create', publisherController.createPublisher);
router.get('/:id', publisherController.getPublisher);
router.get('/:id/edit', publisherController.showEditForm);
router.post('/:id/edit', publisherController.updatePublisher);
router.post('/:id/delete', publisherController.deletePublisher);

module.exports = router;
