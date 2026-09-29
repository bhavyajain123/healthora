const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const articleRoutes = require("./Routes/articleRoutes");
const podcastRoutes = require("./Routes/podcastRoutes");

const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");

const aiRoutes = require("./Routes/aiRoutes");

const app = express();


const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(
    "/videos",
    express.static(
        path.join(__dirname, "public", "videos")
    )
);



app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

// Basic routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthora Backend is running successfully!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Healthora API is working!",
  });
});

app.get("/api/users/test", (req, res) => {
    res.json({
        success: true,
        message: "User route is working!"
    });
});

// API Routes
app.use("/api/articles", articleRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/users", userRoutes);

console.log("✅ User routes mounted");

app.use("/api/admin", adminRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Healthora Backend running on port ${PORT}`);
});