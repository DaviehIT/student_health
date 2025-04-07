const express = require("express");
const Schema = require("../../models/StudentMedicalSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);


// Add a new patient (This route is removed as it duplicates the dengue record route)



// CREATE/ POST - Add a new dengue record
router.post("/dengue-record", async (req, res) => {
  try {
    const {
      onsetDate,
      admissionDate,
      admissionHospital,
      dischargeDate,
      student_id,
      student_age,
      class_id,
      faculty_id,
    } = req.body;

    // Data Validation
    if (
      !onsetDate ||
      !admissionDate ||
      !admissionHospital ||
      !dischargeDate ||
      !student_id ||
      !student_age ||
      !class_id ||
      !faculty_id
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: onsetDate, admissionDate, admissionHospital, dischargeDate, student_id, student_age, class_id, faculty_id",
      });
    }

    // Create a new document
    const newData = new Schema({
      onsetDate,
      admissionDate,
      admissionHospital,
      dischargeDate,
      student_id,
      student_age,
      class_id,
      faculty_id,
    });

    // Save the document to the database
    await newData.save();
    res.status(201).json({ message: "Dengue record added successfully", data: newData });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All - Get all dengue records
router.get("/dengue-record", async (req, res) => {
  try {
    const existingData = await Schema.find();

    if (!existingData || existingData.length === 0) {
      return res.status(404).json({ error: "No dengue records found" });
    }

    res.status(200).json(existingData);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single - Get a single dengue record by ID
router.get("/dengue-record/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    if (!existingData) {
      return res.status(404).json({ error: "Dengue record not found" });
    }

    res.status(200).json(existingData);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT - Update a dengue record by ID
router.put("/dengue-record/:id", async (req, res) => {
  try {
    const updateData = await Schema.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });

    if (!updateData) {
      return res.status(404).json({ error: "Dengue record not found" });
    }

    res.status(200).json({ message: "Dengue record updated successfully", data: updateData });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE/ DELETE - Delete a dengue record by ID
router.delete("/dengue-record/:id", async (req, res) => {
  try {
    const deleteData = await Schema.findByIdAndDelete(req.params.id);

    if (!deleteData) {
      return res.status(404).json({ error: "Dengue record not found" });
    }

    res.status(200).json({ message: "Dengue record deleted successfully" });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;