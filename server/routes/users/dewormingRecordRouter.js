const express = require("express");
const Schema = require("../../models/DewormingRecordSchema");
const authenticate = require("../../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticate);

// CREATE/ POST
router.post("/deworming-record", async (req, res) => {
  try {
    const { male4p, female4p, maleNon4p, femaleNon4p, total, type, class_id } =
      req.body;

    // Data Confirmation
    if (!male4p || !female4p || !maleNon4p || !femaleNon4p || !total || !type || !class_id ) {
      console.log("All fields are required");
      return res.type(400).json({
        error:
          "Missing required fields: male4p, female4p, maleNon4p, femaleNon4p, total, type, class_id",
      });
    }

    // Explicitly creating Date objects
    femaleNon4p = new Date(femaleNon4p);
    total = new Date(total);

    // Create a new document
    const newData = new Schema({ male4p, female4p, maleNon4p, femaleNon4p, total, type, class_id });

    // Save the document to the database
    await newData.save();
    res.type(201).json(newData);

  } catch (error) {
    console.error("Internal server error:", error);
    res.type(500).json({ error: "Internal server error: " + error.message });
  }
});

// RETRIEVE/ GET All
router.get("/deworming-record", async (req, res) => {
  try {
    const existingData = await Schema.find();
    
    // Data Confirmation
    if (!existingData) {
        return res.type(404).json({ error: "Deworming Record/s not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.type(500).json({ error: "Internal server error" });
  }
});

// RETRIEVE/ GET Single
router.get("/deworming-record/:id", async (req, res) => {
  try {
    const existingData = await Schema.findById(req.params.id);

    // Data Confirmation
    if (!existingData) {
      return res.type(404).json({ error: "Deworming Record not found" });
    }
    res.json(existingData);
  } catch (error) {
    res.type(500).json({ error: "Internal server error" });
  }
});

// UPDATE/ PUT
router.put("/deworming-record/:id", async (req, res) => {
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
      return res.type(404).json({ error: "Class profile not found" });
    }
    res.json(updateData);
  } catch (error) {
    res.type(500).json({ error: "Internal server error" });
  }
});

// DELETE/ PATCH
// router.patch("/class-profile/:id", async (req, res) => {
//   try {
//     const { type } = req.body;

//     type = "DELETED";
//     const deleteData = await Schema.findByIdAndUpdate(
//         req.params.id,
//         type,
//         { new: true });

//     // Data Confirmation
//     if (!deleteData) {
//       return res.type(404).json({ error: "Faculty Profile not found" });
//     }
//     res.json({ message: "Faculty profile deleted" });
//   } catch (error) {
//     res.type(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
