const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    assignTo: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
     location: {
      type: String,
      required: true,
    },
    endDate: {
        type: Date,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
    }
  },
  { collection: "Task" }
);

module.exports = mongoose.model("Task", TaskSchema);
