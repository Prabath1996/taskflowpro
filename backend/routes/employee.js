const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Get all employees
router.get('/getEmployees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new employee
router.post('/addEmployees', async (req, res) => {
 try {
     const employee = new Employee(req.body);
     // Validate required fields
     if (!employee.employeeName) {
       return res.json({
         error: 'Employee Name is required'
       });
     }
      // Validate phone number
     if (!employee.phoneNo) {
       return res.json({ 
         error: 'Phone number is required' 
       });
     }
       // Validate designation
     if (!employee.designation) {
       return res.json({ 
         error: 'Designation is required' 
       });
     }
         // Validate joinedDate
     if (!employee.joinedDate) {
       return res.json({ 
         error: 'Joined Date is required' 
       });
     }
     // Save the employee
     await employee.save();
     // Return the created employee
     res.json(employee);
 
   } catch (error) {
     console.log(error)
   }
});

// Get single employee
router.get('/getEmployees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee
router.put('/updateEmployees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message:'Employee Updated successfully'});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete employee
router.delete('/deleteEmployees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;