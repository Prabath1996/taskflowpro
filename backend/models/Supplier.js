const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  supplierName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
},{collection: 'Supplier'});

module.exports = mongoose.model('Supplier', SupplierSchema);