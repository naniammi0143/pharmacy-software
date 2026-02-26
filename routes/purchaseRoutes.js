const express = require("express");
const router = express.Router();

const Purchase = require("../models/Purchase");
const Medicine = require("../models/Medicine");
const Supplier = require("../models/Supplier");
const verifyToken = require("../middleware/authMiddleware");


// ================= CREATE PURCHASE =================
router.post("/create", verifyToken, async (req, res) => {
  try {

    const { supplierId, medicineId, quantity, purchasePrice } = req.body;

    const totalAmount = quantity * purchasePrice;

    // Save purchase
    const purchase = new Purchase({
      supplier: supplierId,
      medicine: medicineId,
      quantity,
      purchasePrice,
      totalAmount
    });

    await purchase.save();

    // Update medicine stock + purchase price
    await Medicine.findByIdAndUpdate(
      medicineId,
      {
        $inc: { quantity: quantity },
        purchasePrice: purchasePrice
      }
    );

    res.json({ message: "Purchase Added Successfully" });

  } catch (error) {
    res.status(500).json(error);
  }
});


// ================= GET ALL PURCHASES =================
router.get("/", verifyToken, async (req, res) => {
  try {

    const purchases = await Purchase.find()
      .populate("supplier")
      .populate("medicine")
      .sort({ createdAt: -1 });

    res.json(purchases);

  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;