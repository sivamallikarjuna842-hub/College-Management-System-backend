// Backend Server Entry Point
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const helmet = require("helmet");
const { PORT } = require("./config");
const { useMemory } = require("./services/memoryStore");

const app = express();
const port = PORT;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const feeRoutes = require("./routes/fees");
const chatbotRoutes = require("./routes/chatbot");
const { getStats } = require("./controllers/feeController");
const { requireAdminAuth } = require("./middleware/auth");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Stats route (mounted separately under /api)
app.get("/api/stats", requireAdminAuth, getStats);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: useMemory.value ? "In-memory mode (MongoDB down)" : "Mongo mode",
    time: new Date(),
    mongo: !useMemory.value,
  });
});

// Serve static files from React build (optional - adjust path as needed)
// When running from backend/, the frontend build is at ../frontend/build
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// Basic 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize MongoDB in background (doesn't block server start)
async function init() {
  try {
    const { connectDB } = require("./db");
    const { Student: StudentModel } = require("./models/student");
    const { Attendance: AttendanceModel } = require("./models/attendance");

    await connectDB();
    useMemory.value = false;
    console.log("* MongoDB connected. Using Mongo-backed API.");
  } catch (err) {
    useMemory.value = true;
    console.error("* MongoDB not available. Using in-memory API fallback.");
    console.error(String(err && err.message ? err.message : err));
  }
}

// Start server immediately (don't wait for MongoDB)
app.listen(port, () => {
  console.log(`\n* Server running on http://localhost:${port}`);
  console.log(`* API available at http://localhost:${port}/api`);
  console.log(`* Login endpoint: POST http://localhost:${port}/api/auth/login`);
  console.log("");
});

init().catch((err) => {
  console.error("* MongoDB initialization failed:", err?.message);
});