const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  employeeName: {
    type: String,
    required: true
  },
  phoneNo:{
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  joinedDate: {
    type: Date,
    required: true
  }
  },{collection: 'Employee'});

module.exports = mongoose.model('Employee', EmployeeSchema);