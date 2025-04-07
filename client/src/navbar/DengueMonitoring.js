import React, { useState, useEffect } from "react";
import DengueMonitoringGrid from "../datagrid/DengueMonitoringGrid";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const DengueMonitoring = () => {
  const [patients, setPatients] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false); // State to control the Add Patient modal
  const [newPatient, setNewPatient] = useState({
    studId: "",
    name: "",
    age: "",
    gender: "",
    gradeLevel: "",
    section: "",
    address: "",
    dateOfOnset: "",
  });

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dengueMonitoring/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleAddPatient = async () => {
    try {
      const response = await axios.post("http://localhost:5000/dengueMonitoring/addPatient", newPatient);
      alert(response.data.message);
      setOpenAddModal(false); // Close the modal
      fetchPatients(); // Refresh the patient list
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleEditPatient = (patientId) => {
    alert(`Edit Patient ID: ${patientId}`);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/dengueMonitoring/deletePatient/${patientId}`);
      alert(response.data.message);
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dengueMonitoring/generateReport");
      alert(response.data.message);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <DengueMonitoringGrid
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onGenerateReport={handleGenerateReport}
        onAddPatient={() => setOpenAddModal(true)} // Open the Add Patient modal
      />

      {/* Add Patient Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Patient
          </Typography>
          <TextField
            fullWidth
            label="Student ID"
            name="studId"
            value={newPatient.studId}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newPatient.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            value={newPatient.age}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={newPatient.gender}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Grade Level"
            name="gradeLevel"
            value={newPatient.gradeLevel}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Section"
            name="section"
            value={newPatient.section}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={newPatient.address}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date of Onset"
            name="dateOfOnset"
            value={newPatient.dateOfOnset}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPatient}
            sx={{ mt: 2 }}
          >
            Add Patient
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DengueMonitoring;