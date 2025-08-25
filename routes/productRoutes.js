import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js"; // ye Cloudinary wala hoga

const router = express.Router();

// ✅ POST: Upload new product (with Cloudinary)
router.post("/upload", upload.array("images", 4), async (req, res) => {
  try {
    const { productName, price, details, category } = req.body;

    // Cloudinary URLs save karne ke liye
    const images = req.files.map((file) => file.path || file.secure_url);

    const newProduct = new Product({
      name: productName,
      price,
      description: details,
      category,
      images,
    });

    await newProduct.save();
    res.status(201).json({ 
      message: "Product uploaded successfully!", 
      product: newProduct 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


// ✅ GET: All products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// ✅ GET: Touch POS products
router.get("/touch-pos", async (req, res) => {
  try {
    const products = await Product.find({ category: "touch-pos" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// ✅ DELETE: Delete a product by ID (only MongoDB delete, no local file delete)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // NOTE: Agar Cloudinary se image bhi delete karni ho to 
    // product.images array ke URLs se public_id nikal ke 
    // cloudinary.uploader.destroy() use karna padega.

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

export default router;
