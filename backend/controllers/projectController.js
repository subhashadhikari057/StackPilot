const Project = require('../models/Project');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, repoUrl, branch, envVars } = req.body;

    if (!name || !repoUrl) {
      return res.status(400).json({ message: 'Project name and repo URL are required' });
    }

    const newProject = await Project.create({
      user: req.user.id, // from auth middleware
      name,
      repoUrl,
      branch: branch || 'main',
      envVars,
    });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.simulateDeploy = async (req, res) => {
  try {
    const projectId = req.params.id;

    // 1. Find the project
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // 2. Set status to deploying
    project.status = 'deploying';
    await project.save();

    // 3. Simulate build delay (5 seconds)
    setTimeout(async () => {
      // Random success/failure simulation (90% success)
      const isSuccess = Math.random() < 0.9;
      project.status = isSuccess ? 'success' : 'failed';
      await project.save();
    }, 5000);

    res.status(200).json({ message: 'Deployment started', projectId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
