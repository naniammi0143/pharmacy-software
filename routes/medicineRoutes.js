const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

const verifyToken = require("../middleware/authMiddleware");

console.log("Medicine Routes Loaded");


// ================== CREATE ==================
router.post("/add", verifyToken, async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    await newMedicine.save();
    res.json("Medicine Added Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== LOW STOCK ==================
router.get("/low-stock", verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find({ quantity: { $lt: 10 } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== EXPIRED ==================
router.get("/expired", verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find({ expiryDate: { $lt: new Date() } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== SEARCH ==================
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { name } = req.query;

    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" }
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== PAGINATION ==================
router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const medicines = await Medicine.find()
      .skip(skip)
      .limit(limit);

    const total = await Medicine.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: medicines
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== ADD STOCK ==================
router.put("/add-stock/:id", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: quantity } },
      { new: true }
    );

    res.json(updatedMedicine);

  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== UPDATE ==================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMedicine);

  } catch (error) {
    res.status(500).json(error);
  }
});


// ================== DELETE ==================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json("Medicine Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;