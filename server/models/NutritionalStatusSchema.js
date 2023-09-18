const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  height2: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  bmiCategory: {
    type: String,
    required: true,
  },
  hfa: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  student_age: {
    type: Number,
    required: true,
  },
  student_gender: {
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
const DengueRecordSchema = mongoose.model("dengue-record", schema);

module.exports = DengueRecordSchema;
