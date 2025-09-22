const express = require('express');
const Task = require('../models/Tasks');
const router = express.Router();

// Get all tasks
router.get('/getTasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post('/addTasks', async (req, res) => {
  try {
    const task = new Task(req.body);
      // Validate required fields
      if (!task.taskName) {
        return res.status(400).json({
          error: 'Task Name is required'
        });
      }
      if (!task.customerName) {
        return res.status(400).json({
          error: 'Customer Name is required'
        });
      }
      if (!task.location) {
        return res.status(400).json({
          error: 'Location is required'
        });
      }     
    // Save the task record
    await task.save();
    // Return the created task record
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single task
router.get('/getTasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put('/updateTasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete('/deleteTasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;