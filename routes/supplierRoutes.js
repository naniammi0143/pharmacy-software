const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");
const verifyToken = require("../middleware/authMiddleware");


// CREATE SUPPLIER
router.post("/add", verifyToken, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({ message: "Supplier Added Successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});


// GET SUPPLIERS
router.get("/", verifyToken, async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;