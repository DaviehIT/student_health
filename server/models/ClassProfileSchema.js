const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  syFrom: {
    type: String,
    required: true,
  },
  syTo: {
    type: String,
    required: true,
  },
  status: {
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
const ClassProfileSchema = mongoose.model("class-profile", schema);

module.exports = ClassProfileSchema;
