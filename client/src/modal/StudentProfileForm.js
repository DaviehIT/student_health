import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import axiosInstance from "../config/axios-instance.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
// import axios from "axios";

const StudentProfileForm = (props) => {
  const { open = false, onClose, addNewDocument, selectedDocument } = props;
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    lrn: yup.string().required("LRN is required"),
    lastName: yup.string().required("Last name is required"),
    firstName: yup.string().required("First name is required"),
    middleName: yup.string().required("Middle name is required"),
    nameExtension: yup.string().nullable(),
    gender: yup.string().required("Gender is required"),
    birthDate: yup.date().required("BirthDate is required"),
    is4p: yup.string().required("4p is required"),
    parentName1: yup.string().required("Parent 1 Name is required"),
    parentContact1: yup.string().required('Parent 1 Mobile Number is required').min(10, "Your phone number must be 10 digits"),
    parentName2: yup.string().nullable(),
    parentContact2: yup.string().nullable(),
    address: yup.string().required("Address is required"),
    class_id: yup.string().required("Class is required"),
  });

  const handleDateChange = (date) => {
    setSelectedBirthDate(date);
    setValue("birthDate", date);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is4p: "false",
      gender: "Male",
    },
  });

  const handleCreate = async (data) => {
    if (!data.nameExtension) {
      data.nameExtension = "";
    }
    console.log("Sending data to API:", data);
    try {
      const response = await axiosInstance.post(
        "student-profile/student-profile",
        data
      );
      console.log("API Response:", response);
      if (response.data.product) {
        if (typeof addNewDocument === "function") {
          addNewDocument(response.data);
        }
        showSnackbar("Student Profile Added", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred during adding student profile:", error);
      if (error.response && error.response.data) {
        console.error("Server responded with:", error.response.data);
      }
      showSnackbar("An error occurred during adding", "error");
    }
  };

  const handleUpdate = async (data) => {
    if (!data.nameExtension) {
      data.nameExtension = "";
    }
    // Check if selectedDocument is not undefined or null
    if (selectedDocument) {
      // Check if selectedDocument._id is not undefined or null
      if (selectedDocument._id) {
        try {
          const response = await axiosInstance.put(
            `student-profile/student-profile/${selectedDocument._id}`,
            data
          );
          if (response.data.product) {
            if (typeof props.onMedicineUpdated === "function") {
              props.onMedicineUpdated(response.data);
            }
            showSnackbar("Student Profile Updated", "success");
            handleClose();
          } else {
            showSnackbar("Operation failed", "error");
          }
        } catch (error) {
          console.error("An error occurred during updating student profile:", error);
          showSnackbar("An error occurred during updating", "error");
        }
      } else {
        console.error("selectedDocument._id is undefined");
        showSnackbar(
          "An error occurred, selectedDocument._id is undefined",
          "error"
        );
      }
    } else {
      console.error("selectedDocument is undefined");
      showSnackbar("An error occurred, selectedDocument is undefined", "error");
    }
  };
  // Function to handle Save or Update operation
  const handleSaveOrUpdate = (data) => {
    if (selectedDocument && selectedDocument._id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  // Function to close the dialog and reset form values
  const handleClose = () => {
    reset();
    onClose();
    handleDateChange(null);
  };
  // useEffect to populate form fields when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      setValue("lrn", selectedDocument.lrn || "");
      setValue("lastName", selectedDocument.lastName || "");
      setValue("firstName", selectedDocument.firstName || "");
      setValue("middleName", selectedDocument.middleName || "");
      setValue("nameExtension", selectedDocument.nameExtension || "");
      setValue("gender", selectedDocument.gender || "");
      setValue("birthDate", selectedDocument.birthDate || "");
      setValue("is4p", selectedDocument.is4p || "");
      setValue("parentName1", selectedDocument.parentName1 || "");
      setValue("parentContact1", selectedDocument.parentContact1 || "");
      setValue("parentName2", selectedDocument.parentName2 || "");
      setValue("parentContact2", selectedDocument.parentContact2 || "");
      setValue("address", selectedDocument.address || "");
      setValue("status", selectedDocument.status || "");
      setValue("class_id", selectedDocument.class_id || "");
      const birthDate = new Date(selectedDocument.birthDate);
      setSelectedBirthDate(birthDate);
    }
  }, [selectedDocument, setValue]);

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top", // Position at the top
          horizontal: "center", // Position at the center horizontally
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedDocument ? "Edit Student Profile" : "Add Student Profile"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter student profile data:</DialogContentText>
            
            <TextField
              autoFocus
              margin="normal"
              label="LRN"
              {...register("lrn")}
              fullWidth
              required
              error={!!errors.lrn}
              helperText={errors.lrn?.message}
            /> 
            <TextField
              autoFocus
              margin="normal"
              label="Last Name"
              {...register("lastName")}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              autoFocus
              margin="normal"
              label="First Name"
              {...register("firstName")}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    
                    label="Middle Name"
                    {...register("middleName")}
                    fullWidth
                    required
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    
                    label="Name Extension"
                    {...register("nameExtension")}
                    fullWidth
                    error={!!errors.nameExtension}
                    helperText={errors.nameExtension?.message}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">Gender</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.gender : "Male"
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="gender"
                        label="Gender"
                        error={!!errors.gender}
                      >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.gender}>
                    {errors.gender?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl error={!!errors.birthDate}>
                  <DatePicker
                    label="BirthDate"
                    value={selectedBirthDate}
                    onChange={handleDateChange}
                  />
                  <FormHelperText>
                    {errors.birthDate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <InputLabel id="category-label">4P</InputLabel>
                  <Controller
                    name="is4p"
                    control={control}
                    defaultValue={
                      selectedDocument ? selectedDocument.is4p : "True"
                    }
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        id="is4p"
                        label="4P"
                        error={!!errors.is4p}
                      >
                        <MenuItem value={"true"}>Yes</MenuItem>
                        <MenuItem value={"false"}>No</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.is4p}>
                    {errors.is4p?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    required
                    label="Parent 1 Name"
                    {...register("parentName1")}
                    fullWidth
                    error={!!errors.parentName1}
                    helperText={errors.parentName1?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    required
                    label="Parent 1 Contact #"
                    {...register("parentContact1")}
                    fullWidth
                    error={!!errors.parentContact1}
                    helperText={errors.parentContact1?.message}
                  />
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    label="Parent 2 Name"
                    {...register("parentName2")}
                    fullWidth
                    error={!!errors.parentName2}
                    helperText={errors.parentName2?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <FormControl fullWidth required margin="normal">
                  <TextField
                    autoFocus
                    label="Parent 2 Contact #"
                    {...register("parentContact2")}
                    fullWidth
                    error={!!errors.parentContact2}
                    helperText={errors.parentContact2?.message}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              autoFocus
              margin="normal"
              label="Address"
              {...register("address")}
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address?.message}
            /> 
          
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedDocument ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default StudentProfileForm;
