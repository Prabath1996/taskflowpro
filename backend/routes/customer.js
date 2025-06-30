const express = require("express");
const Customer = require("../models/Customer");
const router = express.Router();

// Get all customers
router.get("/getCustomers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new customer
router.post("/addCustomers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    // Validate required fields
    if (!customer.customerName) {
      return res.json({
        error: "Customer Name is required",
      });
    }
    if (!customer.address) {
      return res.json({
        error: "Address is required",
      });
    }
    // Validate phone number
    if (!customer.phoneNo) {
      return res.json({
        error: "Phone number is required",
      });
    }
   // Phone number format validation
      const phoneRegex = /^(07|09)\d{8}$/;
      if (!phoneRegex.test(customer.phoneNo)) {
        return res.json({
          error:
            "Invalid phone number format. Must be 10 digits and start with 07 or 09",
        });
      }
      // Duplicate phone number check
      const existingCustomerPhoneNo = await Customer.findOne({
        phoneNo: customer.phoneNo,
      });
      if (existingCustomerPhoneNo) {
        return res.json({
          error: "Phone number already exists.",
        });
      }
    //Validate Email
    if (!customer.email) {
      return res.json({
        error: "Email is required",
      });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.json({
        error: "Invalid email format",
      });
    }
    // Check for duplicate email
    const existingCustomerEmail = await Customer.findOne({ email: customer.email });
    if (existingCustomerEmail) {
      return res.json({
        error: "Email already exists",
      });
    }

    // Save the customer
    await customer.save();
    // Return the created customer
    res.json(customer);
  } catch (error) {
    console.log(error);
  }
});

// Get single customer
router.get("/getCustomers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer
router.put("/updateCustomers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete customer
router.delete("/deleteCustomers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id, req.body);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
