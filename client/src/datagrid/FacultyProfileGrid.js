import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const FacultyProfileGrid = () => {
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    mobile: '',
    adviser: 'No',
    section: '',
    grade: '',
    gender: '',
    status: 'Active',
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewFaculty({
      name: '',
      mobile: '',
      adviser: 'No',
      section: '',
      grade: '',
      gender: '',
      status: 'Active',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewFaculty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFaculty = () => {
    console.log('New Faculty Data:', newFaculty);
    handleCloseModal();
  };

  const faculty = [
    {
      id: 201,
      name: 'John Johnson',
      mobile: '555-123-4567',
      adviser: 'Yes',
      section: 'Magalang',
      grade: '1',
      gender: 'Male',
      status: 'Active',
    },
    {
      id: 202,
      name: 'Sarah Davis',
      mobile: '777-888-9999',
      adviser: 'Yes',
      section: 'Masunurin',
      grade: '1',
      gender: 'Female',
      status: 'Active',
    },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile Number', width: 150 },
    { field: 'adviser', headerName: 'Adviser', width: 100 },
    { field: 'section', headerName: 'Section', width: 150 },
    { field: 'grade', headerName: 'Grade Level', width: 120 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: params.value === 'Active' ? 'green' : 'red',
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleAction(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  const filteredFaculty = faculty.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add Faculty
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
          rows={filteredFaculty}
          columns={columns}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>

      {/* Add Faculty Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add Faculty</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newFaculty.name}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={newFaculty.mobile}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Adviser"
            name="adviser"
            value={newFaculty.adviser}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Section"
            name="section"
            value={newFaculty.section}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Grade"
            name="grade"
            value={newFaculty.grade}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={newFaculty.gender}
            onChange={handleInputChange}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddFaculty} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FacultyProfileGrid;
