const express = require("express");
const Schema = require("../../models/StudentProfileSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/student-profile", async (req, res) => {
  try {
    const { lrn, lastName, firstName, middleName, nameExtension, gender, age, birthDate, is4p, parentName1, parentContact1, parentName2, parentContact2, address, status, class_id } =
      req.body;

    // Data Confirmation
    if (!lrn || !lastName || !firstName || !middleName || !gender || !age || !birthDate || !is4p || !parentName1 || !parentContact1 || !address || !status || !class_id) {
      console.log("All fields are required");
      return res.status(400).json({
        error:
          "Missing required fields: lrn, lastName, firstName, middleName, gender, age, birthDate, is4p, parentName1, parentContact1, address, status, class_id",
      });
    }

    // Explicitly creating Date objects
    birthDate = new Date(birthDate);

    status = "Active";

    // Create a new document
    const newData = new Schema({
        lrn, lastName, firstName, middleName, nameExtension, gender, age, birthDate, is4p, parentName1, parentContact1, parentName2, parentContact2, address, status, class_id 
    });

    // Save the document to the database
    await newData.save();
    res.status(201).json(newData);

  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All
router.get("/student-profile", async (req, res) => {
  try {
    const existingData = await Schema.find();
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/student-profile/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/student-profile/:id", async (req, res) => {
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
      return res.status(404).json({ error: "Student profile not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
// router.delete("/student-profile/:id", async (req, res) => {
//   try {
//     const deleteData = await Schema.findByIdAndRemove(req.params.id);

//     // Data Confirmation
//     if (!deleteData) {
//       return res.status(404).json({ error: "Student Profile not found" });
//     }
//     res.json({ message: "Student profile deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
