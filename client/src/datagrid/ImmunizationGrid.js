import React from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const ImmunizationGrid = ({ immunizationData }) => {
  // Function to handle Generate Report
  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/immunization/generateReport", {
        responseType: "blob", // Important for downloading files
      });

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "immunization_report.csv"); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={handleGenerateReport}>
          Generate Report
        </Button>
        <Button variant="contained" color="secondary">
          Add Patients
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stud_ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Grade Level</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>4P's Member</TableCell>
              <TableCell>Tetanus</TableCell>
              <TableCell>MMR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {immunizationData.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.studId}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.age}</TableCell>
                <TableCell>{record.gender}</TableCell>
                <TableCell>{record.gradeLevel}</TableCell>
                <TableCell>{record.section}</TableCell>
                <TableCell>{record.fourPsMember ? "Yes" : "No"}</TableCell>
                <TableCell>{record.tetanus ? "Yes" : "No"}</TableCell>
                <TableCell>{record.mmr ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ImmunizationGrid;