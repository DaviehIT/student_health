import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ManageUserModal from "../modal/ManageUserPop.js";
import axiosInstance from "../config/axios-instance.js";

const UserGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Format date to YYYY-MM-DD
  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/users/userFetch"); // ✅ Fixed API Call
        const data = response.data;

        // Ensure DataGrid gets a proper ID field
        const formattedData = data.map((user) => ({
          ...user,
          id: user._id, // ✅ Correct ID mapping
        }));

        setUsers(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  // Table Columns
  const columns = [
    { field: "_id", headerName: "User ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "phoneNumber", headerName: "Mobile Number", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.createdAt),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: params.value === "Active" ? "green" : "red",
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleView(params.row._id)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Button Handlers
  const handleEdit = (id) => console.log(`Edit user: ${id}`);
  const handleDelete = (id) => console.log(`Delete user: ${id}`);
  const handleView = (id) => console.log(`View user: ${id}`);

  // Filter Users Based on Search Input
  const filteredUsers = users.filter((user) => {
    const searchText = searchValue.toLowerCase();
    return (
      user._id.includes(searchText) ||
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.phoneNumber.includes(searchText) ||
      user.role.toLowerCase().includes(searchText) ||
      user.status.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            New User
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row._id} // ✅ Fixed DataGrid ID
        />
        <ManageUserModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default UserGrid;
