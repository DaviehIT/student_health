const express = require("express");
const router = express.Router();
const User = require("../../models/User.js"); // Import your User model
const authenticateMiddleware = require("../../auth/authenticateMiddleware.js");

// Define the fields you want to select, including firstName and lastName
const selectedFields = [
  "_id",
  "firstName",
  "lastName",
  "phoneNumber",
  "email",
  "gender",
  "role",
  "createdAt",
  "status",
  "approved",
];

// Route to fetch all users
router.get("/userFetch", authenticateMiddleware, async (req, res) => {
  try {
    // Fetch users from MongoDB with selected fields
    const users = await User.find({}, selectedFields);

    // Map the users to include a full name field
    const usersWithFullName = users.map((user) => ({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
    }));

    // Send the modified user data as a JSON response
    res.status(200).json(usersWithFullName);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// Route to fetch a specific user by ID (View User)
router.get("/viewUser/:id", authenticateMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId, selectedFields);

    if (!user) {
      // User with the provided ID was not found
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data as a JSON response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// Route to update a user's details (Update User)
router.put("/updateUser/:id", authenticateMiddleware, async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      // User with the provided ID was not found
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user as a JSON response
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

// Route to delete a user by ID (Delete User)
router.delete("/deleteUser/:id", authenticateMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // User with the provided ID was not found
      return res.status(404).json({ error: "User not found" });
    }

    // Send a success message as a JSON response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred", details: error.message });
  }
});

module.exports = router;