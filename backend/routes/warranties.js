const express = require('express');
const Warranty = require('../models/Warranty');
const router = express.Router();

// Get all warranties
router.get('/', async (req, res) => {
  try {
    const warranties = await Warranty.find();
    res.json(warranties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new warranty
router.post('/', async (req, res) => {
  try {
    const warranty = new Warranty(req.body);
    await warranty.save();
    res.status(201).json(warranty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single warranty
router.get('/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json(warranty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update warranty
router.put('/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json(warranty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete warranty
router.delete('/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findByIdAndDelete(req.params.id);
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json({ message: 'Warranty deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;