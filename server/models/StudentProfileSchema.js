const mongoose = require("mongoose");

// Define a schema for calendar events
const schema = new mongoose.Schema({
  lrn: {
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
  is4p: {
    type: Boolean,
    required: true,
  },
  parentName1: {
    type: String,
    required: true,
  },
  parentContact1: {
    type: Number,
    required: true,
  },
  parentName2: {
    type: String,
    default: "",
  },
  parentContact2: {
    type: Number,
    default: "",
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
const StudentProfileSchema = mongoose.model("student-profile", schema);

module.exports = StudentProfileSchema;
