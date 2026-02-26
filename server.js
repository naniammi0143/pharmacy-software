const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================== DATABASE ==================
mongoose.connect("mongodb://127.0.0.1:27017/pharmacyDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ================== ROUTES ==================
const medicineRoutes = require("./routes/medicineRoutes");
app.use("/medicines", medicineRoutes);

const billRoutes = require("./routes/billRoutes");
app.use("/bills", billRoutes);

// 🔐 AUTH ROUTES (VERY IMPORTANT)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Pharmacy Server Running 🚀");
});

// ================== SERVER START ==================
const PORT = 5000;

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const purchaseRoutes = require("./routes/purchaseRoutes");
app.use("/purchase", purchaseRoutes);

const supplierRoutes = require("./routes/supplierRoutes");
app.use("/suppliers", supplierRoutes);

