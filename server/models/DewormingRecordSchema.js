const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  male4p: {
    type: Number,
    required: true,
  },
  female4p: {
    type: Number,
    required: true,
  },
  maleNon4p: {
    type: Number,
    required: true,
  },
  femaleNon4p: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  class_id: {
    type: String,
    required: true,
  },
  // Add any additional fields you need for your events
}, { timestamps: true });

// Create a model for calendar events using the schema
const DewormingRecordSchema = mongoose.model("deworming-record", schema);

module.exports = DewormingRecordSchema;
