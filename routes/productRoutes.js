import express from "express";
import Product from "../models/Product.js";
import { upload } from "../middleware/upload.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// POST: Upload new product
router.post("/upload", upload.array("images", 4), async (req, res) => {
  try {
    const { productName, price, details, category } = req.body;
    const images = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );

    const newProduct = new Product({
      name: productName,
      price,
      description: details,
      category,
      images,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// GET: All products (for AdminPanel "All Product")
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// GET: Touch POS products
router.get("/touch-pos", async (req, res) => {
  try {
    const products = await Product.find({ category: "touch-pos" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// DELETE: Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from uploads folder
    product.images.forEach((imgUrl) => {
      const filename = path.basename(imgUrl);
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

export default router;
