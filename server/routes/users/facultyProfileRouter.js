const express = require("express");
const Schema = require("../../models/FacultyProfileSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/class-profile", async (req, res) => {
  try {
    const { employeeId, lastName, firstName, middleName, nameExtension, gender, birthDate, contact, role, address, status} =
      req.body;

    // Data Confirmation
    if (!employeeId || !lastName || !firstName || !middleName || !gender || !birthDate || !contact || !role || !address || !status) {
      console.log("All fields are required");
      return res.status(400).json({
        error:
          "Missing required fields: employeeId, lastName, firstName, middleName, nameExtension, gender, birthDate, contact, role, address, status",
      });
    }

    // Explicitly creating Date objects
    birthDate = new Date(birthDate);

    // Create a new document
    const newData = new Schema({ employeeId, lastName, firstName, middleName, nameExtension, gender, birthDate, contact, role, address, status, });

    // Save the document to the database
    await newData.save();
    res.status(201).json(newData);

  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All
router.get("/class-profile", async (req, res) => {
  try {
    const existingData = await Schema.find();
    
    // Data Confirmation
    if (!existingData) {
        return res.status(404).json({ error: "Faculty profile/s not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/faculty-profile/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.status(404).json({ error: "Faculty profile not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/faculty-profile/:id", async (req, res) => {
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
      return res.status(404).json({ error: "Faculty profile not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE/ PATCH
router.patch("/faculty-profile/:id", async (req, res) => {
  try {
    const { status } = req.body;

    status = "DELETED";
    const deleteData = await Schema.findByIdAndUpdate(
        req.params.id,
        status,
        { new: true });

    // Data Confirmation
    if (!deleteData) {
      return res.status(404).json({ error: "Faculty Profile not found" });
    }
    res.json({ message: "Faculty profile deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
