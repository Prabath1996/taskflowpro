const express = require('express');
const Repair = require('../models/Repair');
const router = express.Router();

// Get all repairs
router.get('/getRepairs', async (req, res) => {
  try {
    const repairs = await Repair.find();
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create repair
router.post('/addRepairs', async (req, res) => {
  try {
   const repair = new Repair(req.body);
       // Validate required fields
       if (!repair.itemName) {
         return res.json({
           error: 'Item Name is required'
         });
       }
        if (!repair.modelNo) {
         return res.json({
           error: 'Model No is required'
         });
       }
       if (!repair.serialNo) {
         return res.json({ 
           error: 'Serial No is required' 
         });
       }
       if (!repair.fault) {
         return res.json({ 
           error: 'Fault Description is required' 
         });
       }
       if (!repair.customerName) {
         return res.json({ 
           error: 'Customer field is required' 
         });
       }
       if (!repair.receivedBy) {
         return res.json({ 
           error: 'Recieved By field is required' 
         });
       }

    // Save the repair record
    await repair.save();
    // Return the created repair record
    res.json(repair);

  } catch (error) {
    console.log(error);
    
  }
});

// Get single repair
router.get('/getRepairs/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update repair
router.put('/updateRepairs/:id', async (req, res) => {
  try {
    const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete repair
router.delete('/deleteRepairs/:id', async (req, res) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json({ message: 'Repair deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;