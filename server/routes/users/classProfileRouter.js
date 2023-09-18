const express = require("express");
const Schema = require("../../models/ClassProfileSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/class-profile", async (req, res) => {
  try {
    const { grade, section, room, syFrom, syTo, status, faculty_id } =
      req.body;

    // Data Confirmation
    if (!grade || !section || !room || !syFrom || !syTo || !status || !faculty_id ) {
      console.log("All fields are required");
      return res.status(400).json({
        error:
          "Missing required fields: grade, section, room, syFrom, syTo, status, faculty_id",
      });
    }

    // Explicitly creating Date objects
    syFrom = new Date(syFrom);
    syTo = new Date(syTo);

    // Create a new document
    const newData = new Schema({ grade, section, room, syFrom, syTo, status, faculty_id });

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
        return res.status(404).json({ error: "Class profile/s not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/class-profile/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.status(404).json({ error: "Class profile not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/class-profile/:id", async (req, res) => {
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
      return res.status(404).json({ error: "Class profile not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE/ PATCH
router.patch("/class-profile/:id", async (req, res) => {
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
