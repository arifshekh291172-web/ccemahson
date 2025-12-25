require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");

/* =========================
   ROUTES IMPORT
========================= */
const studentRoutes = require("./routes/studentRoutes"); // MAIN AUTH
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const supportRoutes = require("./routes/supportRoutes"); // ✅ CUSTOMER SUPPORT

/* =========================
   APP INIT
========================= */
const app = express();
const server = http.createServer(app);

/* =========================
   DATABASE CONNECT
========================= */
connectDB();

/* =========================
   SOCKET.IO SETUP
========================= */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", // production me frontend URL daalna
    methods: ["GET", "POST"]
  }
});

// global access (routes ke liye)
global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // join specific ticket room
  socket.on("joinTicket", (ticketId) => {
    socket.join(ticketId);
    console.log("📩 Joined ticket:", ticketId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   API ROUTES
========================= */
app.use("/api/students", studentRoutes);       // OTP, Register, Login, Forgot
app.use("/api/admin", adminRoutes);             // Admin login
app.use("/api/courses", courseRoutes);          // Courses CRUD
app.use("/api/admissions", admissionRoutes);    // Admission flow
app.use("/api/payments", paymentRoutes);        // Payments
app.use("/api/certificates", certificateRoutes);
app.use("/api/support", supportRoutes);         // ✅ AI + Admin Chat

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("CCE Mahson Backend Running 🚀");
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running with Socket.io on port ${PORT}`);
});
