const express = require("express");
const dotenv = require("dotenv");
const authenticateMiddleware = require("./auth/authenticateMiddleware.js");
const authRoutes = require("./auth/Routes.js");
const connectDB = require("./mongodb/Connect.js");
const userRoutes = require("./routes/users/manageUsers.js");
const eventRoutes = require("./routes/users/eventRouter.js");
const settingsRoutes = require("./routes/users/settingsRouter.js");
const medicineInventoryRoutes = require("./routes/users/medicineInventoryRouter.js");
const studentProfileRoutes = require("./routes/users/studentProfileRouter.js");
const facultyProfileRoutes = require("./routes/users/facultyProfileRouter.js");
const classProfileRoutes = require("./routes/users/classProfileRouter.js");
const dengueRecordRoutes = require("./routes/users/dengueRecordRouter.js");
const dewormingRecordRoutes = require("./routes/users/dewormingRecordRouter.js");
const nutritionalStatusRoutes = require("./routes/users/nutritionalStatusRouter.js");

const cors = require("cors");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(cors());

// Import and use the userRoutes with a prefix

app.use("/users", userRoutes);

app.use("/events", eventRoutes);

app.use("/settings", settingsRoutes);

app.use("/medicineInventory", medicineInventoryRoutes);

app.use("/student-profile", studentProfileRoutes);

app.use("/faculty-profile", facultyProfileRoutes);

app.use("/class-profile", classProfileRoutes);

app.use("/dengue-record", dengueRecordRoutes);

app.use("/deworming-record", dewormingRecordRoutes);

app.use("/nutritional-status", nutritionalStatusRoutes);

// Use the authentication routes with a prefix, for example: /auth/signup, /auth/login, etc.
app.use("/auth", authRoutes);

app.get("/protected", authenticateMiddleware, (req, res) => {
  // The middleware verifies the token and attaches user data to req.userData
  res
    .status(200)
    .json({ message: "Protected Route Access: GRANTED", user: req.userData });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(PORT, () => {
      console.log("Server Port: " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
