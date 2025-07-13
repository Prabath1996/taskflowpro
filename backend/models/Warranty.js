const mongoose = require('mongoose');
const Supplier = require('./Supplier');
const Schema = mongoose.Schema;

const WarrantySchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  warrantyInDate: {
    type: Date,
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
   newSerialNo: {
    type: String,
    unique: true,
    default: ""
  },
  fault: {
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
  supplier: {
  type: String,
  required: true
},
  warrantyOutDate: {
    type: Date
  },
   warrantyBackInDate: {
    type: Date
  },
   deliveredToCustomerDate: {
    type: Date
  },
  description: {
    type: String
  },
  repairNotes: {
    type: String,
  },
  status: {
    type: String,
    default: "Received from Customer"
  }
},{collection: 'Warranty'});

module.exports = mongoose.model('Warranty', WarrantySchema);