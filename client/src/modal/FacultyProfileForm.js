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

const FacultyProfileForm = (props) => {
  const { open = false, onClose, addNewFaculty, selectedFaculty } = props;
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object().shape({
    employeeId: yup.string().required("Employee ID is required"),
    lastName: yup.string().required("Last name is required"),
    firstName: yup.string().required("First name is required"),
    middleName: yup.string().required("Middle name is required"),
    nameExtension: yup.string().nullable(),
    gender: yup.string().required("Gender is required"),
    birthDate: yup.date().nullable().required("Birthdate is required"),
    contact: yup.string().required("Contact number is required"),
    role: yup.string().required("Role is required"),
    address: yup.string().required("Address is required"),
    status: yup.string().required("Status is required"),
  });

  const handleDateChange = (date) => {
    setSelectedBirthDate(date);
    setValue("birthDate", date, { shouldValidate: true });
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
  });

  const handleCreate = async (data) => {
    try {
      const response = await axiosInstance.post("faculty-profile", data);
      if (response.data.employeeId) {
        if (typeof addNewFaculty === "function") {
          addNewFaculty(response.data);
        }
        showSnackbar("Successfully added faculty profile", "success");
        handleClose();
      } else {
        showSnackbar("Operation failed", "error");
      }
    } catch (error) {
      console.error("An error occurred while adding faculty:", error);
      showSnackbar("An error occurred while adding faculty", "error");
    }
  };

  const handleUpdate = async (data) => {
    if (selectedFaculty && selectedFaculty._id) {
      try {
        const response = await axiosInstance.put(
          `faculty-profile/${selectedFaculty._id}`,
          data
        );
        if (response.data.employeeId) {
          if (typeof props.onFacultyUpdated === "function") {
            props.onFacultyUpdated(response.data);
          }
          showSnackbar("Successfully updated faculty profile", "success");
          handleClose();
        } else {
          showSnackbar("Operation failed", "error");
        }
      } catch (error) {
        console.error("An error occurred while updating faculty:", error);
        showSnackbar("An error occurred while updating", "error");
      }
    } else {
      console.error("selectedFaculty._id is undefined");
      showSnackbar("An error occurred, selectedFaculty._id is undefined", "error");
    }
  };

  const handleSaveOrUpdate = (data) => {
    if (selectedFaculty && selectedFaculty._id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
    setSelectedBirthDate(null);
  };

  useEffect(() => {
    if (selectedFaculty) {
      setValue("employeeId", selectedFaculty.employeeId || "");
      setValue("lastName", selectedFaculty.lastName || "");
      setValue("firstName", selectedFaculty.firstName || "");
      setValue("middleName", selectedFaculty.middleName || "");
      setValue("nameExtension", selectedFaculty.nameExtension || "");
      setValue("gender", selectedFaculty.gender || "");
      setValue("birthDate", selectedFaculty.birthDate || "");
      setValue("contact", selectedFaculty.contact || "");
      setValue("role", selectedFaculty.role || "");
      setValue("address", selectedFaculty.address || "");
      setValue("status", selectedFaculty.status || "");

      setSelectedBirthDate(new Date(selectedFaculty.birthDate));
    }
  }, [selectedFaculty, setValue]);

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedFaculty ? "Edit Faculty Profile" : "Add Faculty Profile"}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>Enter faculty details:</DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              label="Employee ID"
              {...register("employeeId")}
              fullWidth
              required
              error={!!errors.employeeId}
              helperText={errors.employeeId?.message}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  label="Last Name"
                  {...register("lastName")}
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  label="First Name"
                  {...register("firstName")}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="gender-label">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.gender}>
                {errors.gender?.message}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <DatePicker
                label="Birth Date"
                value={selectedBirthDate}
                onChange={handleDateChange}
              />
              <FormHelperText>{errors.birthDate?.message}</FormHelperText>
            </FormControl>
            <TextField
              margin="normal"
              label="Contact"
              {...register("contact")}
              fullWidth
              required
              error={!!errors.contact}
              helperText={errors.contact?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {selectedFaculty ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FacultyProfileForm;
