const express = require('express');
const router = express.Router();
const { createProject,getProjects,simulateDeploy } = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/projects', verifyToken, createProject);
// Get all projects (for current user)
router.get('/projects', verifyToken, getProjects);

router.post('/deploy/:id', verifyToken, simulateDeploy);


module.exports = router;
