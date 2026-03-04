const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.get('/:key', projectController.getProjectDetail);

// all products: localhost:8000/api/products
// detail products: localhost:8000/api/products/:key(gc)

module.exports = router;