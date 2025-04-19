const express = require('express');
const Repair = require('../models/Repair');
const router = express.Router();

// Get all repairs
router.get('/', async (req, res) => {
  try {
    const repairs = await Repair.find();
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create repair
router.post('/', async (req, res) => {
  try {
    const repair = new Repair(req.body);
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single repair
router.get('/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update repair
router.put('/:id', async (req, res) => {
  try {
    const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete repair
router.delete('/:id', async (req, res) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json({ message: 'Repair deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;