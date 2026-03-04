const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.get('/', projectController.getAllProjects);
router.get('/:key', projectController.getProjectDetail);

module.exports = router;