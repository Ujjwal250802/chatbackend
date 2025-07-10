import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import chatbotRoutes from "./routes/chatbot.route.js"; 
import paymentRoutes from "./routes/payment.route.js"; // Add this import

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001; // Change to 5001 to match frontend

const __dirname = path.resolve();

// Connect to MongoDB first
connectDB();

console.log("🚀 Starting server...");
console.log("🔧 Environment:", process.env.NODE_ENV || "development");
console.log("🌐 Port:", PORT);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes); // Add this line
app.use("/api", chatbotRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Add a root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Language Learning App API", 
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users", 
      chat: "/api/chat",
      payment: "/api/payment",
      chatbot: "/api/chatbot",
      health: "/api/health"
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/users",
      "POST /api/chatbot"
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log("📋 Available routes:");
  console.log("   GET  / - API info");
  console.log("   GET  /api/health - Health check");
  console.log("   POST /api/auth/signup - User registration");
  console.log("   POST /api/auth/login - User login");
  console.log("   GET  /api/users - Get users");
  console.log("   POST /api/chatbot - Chat with AI");
});