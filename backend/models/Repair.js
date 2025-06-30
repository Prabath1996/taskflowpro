const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepairSchema = new Schema(
  {
     invNo: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    modelNo: {
      type: String,
      required: true,
    },
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },
    fault: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    receivedBy: {
      type: String,
      required: true,
    },
    itemInDate: {
        type: Date,
    },
    itemOutDate: {
        type: Date,
    },
    status: {
        type: String,
    }
  },
  { collection: "Repair" }
);

module.exports = mongoose.model("Repair", RepairSchema);
