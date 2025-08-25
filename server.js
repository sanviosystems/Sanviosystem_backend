import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";   
dotenv.config();  

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://www.sanviosystems.com",  // with www
    "https://sanviosystems.com"       // without www
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());



// Serve images from uploads folder (temporary fix)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contacts", contactRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
