const express = require("express");
const router = express.Router();
const Immunization = require("../../models/Immunization"); // Replace with your Immunization model
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");
const { Parser } = require("json2csv"); // Library to generate CSV files

// Middleware to authenticate routes
router.use(authenticateMiddleware);

// Route to generate a report
router.get("/generateReport", async (req, res) => {
  try {
    // Fetch all immunization records
    const immunizationData = await Immunization.find();

    if (!immunizationData || immunizationData.length === 0) {
      return res.status(404).json({ error: "No immunization records found" });
    }

    // Define the fields for the CSV
    const fields = [
      { label: "Student ID", value: "studId" },
      { label: "Name", value: "name" },
      { label: "Age", value: "age" },
      { label: "Gender", value: "gender" },
      { label: "Grade Level", value: "gradeLevel" },
      { label: "Section", value: "section" },
      { label: "4P's Member", value: "fourPsMember" },
      { label: "Tetanus", value: "tetanus" },
      { label: "MMR", value: "mmr" },
    ];

    // Convert the data to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(immunizationData);

    // Set headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("immunization_report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;