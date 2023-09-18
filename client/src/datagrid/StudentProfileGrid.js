import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Form from "../modal/StudentProfileForm.js";
import axiosInstance from "../config/axios-instance.js";

const Grid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [collectionData, setCollectionData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Function to format date string to YYYY-MM-DD
  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        "student-profile"
      );
      setCollectionData(response.data);
    } catch (error) {
      console.error("An error occurred while fetching student profile/s:", error);
    }
  };

  // Fetch medicines when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to update state after a medicine item is updated
  const onDocumentUpdate = (updatedDocument) => {
    const updatedDocuments = collectionData.map((document) =>
      document._id === updatedDocument._id ? updatedDocument : document
    );
    setCollectionData(updatedDocuments);
  };

  // Function to add a new medicine item
  const addDocument = (newDocument) => {
    setCollectionData([...collectionData, newDocument]);
  };

  const columns = [
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "middleName", headerName: "Middle Name", width: 150 },
    { field: "nameExtension", headerName: "Extension", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "birthDate",
      headerName: "Birth \nDate",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.expirationDate),
    },
    { field: 'is4p', headerName: '4P', width: 75, renderCell: (params) => (
      <div>
        {params.value ? 'Yes' : 'No'}
      </div>
    ), },
    { field: "parentName1", headerName: "Parent 1 Name", width: 100 },
    { field: "parentContact1", headerName: "Parent 1 Contact", width: 100 },
    { field: "parentName2", headerName: "Parent 2 Name", width: 100 },
    { field: "parentContact2", headerName: "Parent 2 Contact", width: 100 },
    { field: "address", headerName: "Address", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const assessment = params.value;
        let color = "";
        switch (assessment.toLowerCase()) {
          case "Active":
            color = "green";
            break;

          case "Inactive":
            color = "red";
            break;
          default:
            color = "black";
        }
        return <span style={{ color }}>{assessment}</span>;
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.expirationDate),
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      width: 150,
      valueGetter: (params) => formatYearFromDate(params.row.restockDate),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => handleEditDocument(params.row._id)}>
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleEditDocument = (id) => {
    const documentToEdit = collectionData.find((document) => document._id === id);
    setSelectedDocument(documentToEdit);
    setFormOpen(true); // Assuming this opens the form dialog
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const filteredDocument = collectionData.filter((document) => {
    const lowerSearchValue = searchValue.toLowerCase();

    // Explicitly convert numeric or date fields to string before using `toLowerCase()`.
    return (
      (document.lrn?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.lastName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.firstName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.middleName?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.nameExtension?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.gender?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.birthDate?.toString() || "").includes(searchValue) || // convert to string
      (document.is4p?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.parentName1?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.parentContact1?.toString() || "").includes(lowerSearchValue) ||
      (document.parentName2?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.parentContact2?.toString() || "").includes(lowerSearchValue) ||
      (document.address?.toLowerCase() || "").includes(lowerSearchValue) ||
      (document.status?.toLowerCase() || "").includes(lowerSearchValue) ||
      (
        new Date(document.createdAt).toLocaleDateString()?.toLowerCase() ||
        ""
      ).includes(lowerSearchValue) || // Convert date to a string
      (
        new Date(document.updatedAt).toLocaleDateString()?.toLowerCase() || ""
      ).includes(lowerSearchValue) // Convert date to a string
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Student
          </Button>
          <div className="ml-2">
            <TextField
              label="Search"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <DataGrid
          getRowId={(row) => row._id}
          rows={filteredDocument}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <Form
          open={formOpen}
          addNewMedicine={addDocument}
          onMedicineUpdated={onDocumentUpdate}
          selectedMedicine={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
        />
      </div>

    </div>
  );
};

export default Grid;
