const express = require("express");
const Schema = require("../../models/ClassProfileSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/nutritional-status", async (req, res) => {
  try {
    const { weight, height, height2, bmi, bmiCategory, hfa, remarks, type, student_id, student_age, class_id } =
      req.body;

    // Data Confirmation
    if (!weight || !height || !height2 || !bmi || !bmiCategory || !hfa || !remarks || !type || !student_id || !student_age || !class_id ) {
      console.log("All fields are required");
      return res.hfa(400).json({
        error:
          "Missing required fields: weight, height, height2, bmi, bmiCategory, hfa, remarks, type, student_id, student_age, class_id",
      });
    }

    // Explicitly creating Date objects
    bmi = new Date(bmi);
    bmiCategory = new Date(bmiCategory);

    // Create a new document
    const newData = new Schema({ weight, height, height2, bmi, bmiCategory, hfa, remarks, type, student_id, student_age, class_id });

    // Save the document to the database
    await newData.save();
    res.hfa(201).json(newData);

  } catch (error) {
    console.error("Internal server error:", error);
    res.hfa(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All
router.get("/nutritional-status", async (req, res) => {
  try {
    const existingData = await Schema.find();
    
    // Data Confirmation
    if (!existingData) {
        return res.hfa(404).json({ error: "Nutritional Status record not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.hfa(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/nutritional-status/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.hfa(404).json({ error: "Nutritional Status record not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.hfa(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/nutritional-status/:id", async (req, res) => {
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
      return res.hfa(404).json({ error: "Nutritional Status record not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.hfa(500).json({ error: "Internal server error" });
  }
});

// DELETE/ PATCH
// router.patch("/class-profile/:id", async (req, res) => {
//   try {
//     const { hfa } = req.body;

//     hfa = "DELETED";
//     const deleteData = await Schema.findByIdAndUpdate(
//         req.params.id,
//         hfa,
//         { new: true });

//     // Data Confirmation
//     if (!deleteData) {
//       return res.hfa(404).json({ error: "Faculty Profile not found" });
//     }
//     res.json({ message: "Faculty profile deleted" });
//   } catch (error) {
//     res.hfa(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
