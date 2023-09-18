const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  nameExtension: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  // Add any additional fields you need for your events
}, { timestamps: true });

// Create a model for calendar events using the schema
const FacultyProfileSchema = mongoose.model("faculty-profile", schema);

module.exports = FacultyProfileSchema;
