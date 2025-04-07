const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  studId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  section: { type: String, required: true },
  address: { type: String, required: true },
  dateOfOnset: { type: String, required: true },
});

module.exports = mongoose.model("Patient", PatientSchema);