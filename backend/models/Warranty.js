const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarrantySchema = new Schema({
  warrantyInDate: {
    type: Date,
  },
  itemName: {
    type: String,
    required: true
  },
  modelNo: {
    type: String,
    required: true
  },
  serialNo: {
    type: String,
    required: true,
    unique: true
  },
  issueDetails: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  recievedBy: {
    type: String,
    required: true
  },
  warrantyOutDate: {
    type: Date
  },
  description: {
    type: String
  },
  status: {
    type: String,
  }
});

module.exports = mongoose.model('Warranty', WarrantySchema);