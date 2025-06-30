const express = require('express');
const Warranty = require('../models/Warranty');
const router = express.Router();

// Get all warranties
router.get('/getWarranty', async (req, res) => {
  try {
    const warranties = await Warranty.find();
    res.json({ warranties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new warranty
router.post('/addWarranty', async (req, res) => {
  try {
    const warranty = new Warranty(req.body);
    await warranty.save();
    res.status(201).json({ success: true, warranty });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single warranty
router.get('/getWarranty/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json(warranty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update warranty
router.put('/updateWarranty/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json({ success: true, warranty }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete warranty
router.delete('/deleteWarranty/:id', async (req, res) => {
  try {
    const warranty = await Warranty.findByIdAndDelete(req.params.id);
    if (!warranty) return res.status(404).json({ error: 'Warranty not found' });
    res.json({ success: true, message: 'Warranty deleted successfully' }); // <-- Add success: true
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;