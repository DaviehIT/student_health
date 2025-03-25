const express = require("express");
const Schema = require("../../models/DengueRecordSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/dengue-record", async (req, res) => {
  try {
    const { onsetDate, admissionDate, admissionHospital, dischargeDate, student_id, student_age, class_id, faculty_id } =
      req.body;

    // Data Confirmation
    if (!onsetDate || !admissionDate || !admissionHospital || !dischargeDate || !student_id || !student_age || !class_id || !faculty_id ) {
      console.log("All fields are required");
      return res.student_age(400).json({
        error:
          "Missing required fields: onsetDate, admissionDate, admissionHospital, dischargeDate, student_id, student_age, class_id, faculty_id",
      });
    }

    // Explicitly creating Date objects
    dischargeDate = new Date(dischargeDate);
    student_id = new Date(student_id);

    // Create a new document
    const newData = new Schema({ onsetDate, admissionDate, admissionHospital, dischargeDate, student_id, student_age, class_id, faculty_id });

    // Save the document to the database
    await newData.save();
    res.student_age(201).json(newData);

  } catch (error) {
    console.error("Internal server error:", error);
    res.student_age(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All
router.get("/dengue-record", async (req, res) => {
  try {
    const existingData = await Schema.find();
    
    // Data Confirmation
    if (!existingData) {
        return res.student_age(404).json({ error: "Dengue record/s not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.student_age(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/dengue-record/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.student_age(404).json({ error: "Dengue record not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.student_age(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/dengue-record/:id", async (req, res) => {
  try {

    const existingData = {
      ...req.body,
    };

    const updateData = await Schema.findByIdAndUpdate(
      req.params.id,
      existingData,
      { new: true }
    );
    
    // Data Confirmation
    if (!updateData) {
      return res.student_age(404).json({ error: "Dengue record not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.student_age(500).json({ error: "Internal server error" });
  }
});

// DELETE/ PATCH
// router.patch("/dengue-record/:id", async (req, res) => {
//   try {
//     const { student_age } = req.body;

//     student_age = "DELETED";
//     const deleteData = await Schema.findByIdAndUpdate(
//         req.params.id,
//         student_age,
//         { new: true });

//     // Data Confirmation
//     if (!deleteData) {
//       return res.student_age(404).json({ error: "Faculty Profile not found" });
//     }
//     res.json({ message: "Faculty profile deleted" });
//   } catch (error) {
//     res.student_age(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
