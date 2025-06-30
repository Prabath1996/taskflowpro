const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Get all suppliers
router.get('/getSuppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json({ suppliers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create supplier
router.post("/addSupplier", async (req, res) => {
  try {
     const supplier = new Supplier(req.body);
    // Validate required fields
    if (!supplier.supplierName) {
      return res.json({
        error: "Supplier Name is required",
      });
    }
    if (!supplier.address) {
      return res.json({
        error: "Address is required",
      });
    }
    // Validate phone number
    if (!supplier.phoneNo) {
      return res.json({
        error: "Phone number is required",
      });
    }
   // Phone number format validation
      const phoneRegex = /^(07|09)\d{8}$/;
      if (!phoneRegex.test(supplier.phoneNo)) {
        return res.json({
          error:
            "Invalid phone number format. Must be 10 digits and start with 07 or 09",
        });
      }
      // Duplicate phone number check
      const existingSupplierPhoneNo = await Supplier.findOne({
        phoneNo: supplier.phoneNo,
      });
      if (existingSupplierPhoneNo) {
        return res.json({
          error: "Phone number already exists.",
        });
      }
    //Validate Email
    if (!supplier.email) {
      return res.json({
        error: "Email is required",
      });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplier.email)) {
      return res.json({
        error: "Invalid email format",
      });
    }
    // Check for duplicate email
    const existingSupplierEmail = await Supplier.findOne({ email: supplier.email });
    if (existingSupplierEmail) {
      return res.json({
        error: "Email already exists",
      });
    }

    // Save the supplier
    await supplier.save();
    // Return the created supplier
    res.json(supplier);
  } catch (error) {
    console.log(error);
  }
});

// Get single supplier
router.get('/getSupplier/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ supplier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier
router.put('/updateSupplier/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, supplier });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete supplier
router.delete('/deleteSupplier/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;