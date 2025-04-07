import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ManageUsers = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/users/userFetch", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
        },
      });
      setUsers(response.data); // Set the fetched users to state
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  // Function to handle deleting a user
  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/users/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
        },
      });
      alert(response.data.message); // Show success message
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Function to handle updating a user
  const handleUpdate = (userId) => {
    // Redirect to an update form or modal (you can implement the update form separately)
    alert(`Redirecting to update form for user ID: ${userId}`);
    // Example: navigate(`/update-user/${userId}`);
  };

  // Function to handle viewing a user's details
  const handleView = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/viewUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
        },
      });
      alert(`User Details:\n${JSON.stringify(response.data, null, 2)}`); // Display user details
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Failed to fetch user details");
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="bg-black h-24 flex items-center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem", md: "2.25rem" },
              fontWeight: "bold",
              color: "white",
              py: { xs: 3, md: 6 },
              pl: 2,
            }}
          >
            Manage Users
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center h-full p-4">
          {loading ? (
            <Typography>Loading users...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleView(user._id)}
                          style={{ marginRight: "8px" }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleUpdate(user._id)}
                          style={{ marginRight: "8px" }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;