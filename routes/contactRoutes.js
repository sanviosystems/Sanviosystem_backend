// routes/contactRoutes.js
import express from "express";
import Contact from "../models/contactModel.js";

const router = express.Router();

// POST: Save contact form
router.post("/", async (req, res) => {
  try {
    const newMsg = new Contact(req.body);
    await newMsg.save();
    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Contact save failed:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// GET: All messages
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch messages failed:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// DELETE: Remove a contact message
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
});


export default router;
