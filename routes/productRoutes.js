const express = require("express");
const router = express.Router;
const Student = require("../models/products");

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id - Get a specific product
// POST products - Create a new product
router.post("/", async (req, res) => {
  const { Student } = req.body;
  try {
    const students = await Student({ Student });
    const saved = await students.save();
    res.status(281).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// PUT products/:id - Update a product
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// DELETE products/:id - Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status().json({ message: err.message });
  }
});

module.exports = router;
