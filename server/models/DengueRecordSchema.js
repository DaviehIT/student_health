const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  onsetDate: {
    type: Date,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  admissionHospital: {
    type: String,
    required: true,
  },
  dischargeDate: {
    type: Date,
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
  class_id: {
    type: String,
    required: true,
  },
  faculty_id: {
    type: String,
    required: true,
  },
  // Add any additional fields you need for your events
}, { timestamps: true });

// Create a model for calendar events using the schema
const DengueRecordSchema = mongoose.model("dengue-record", schema);

module.exports = DengueRecordSchema;
