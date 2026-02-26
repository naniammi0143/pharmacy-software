const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const Medicine = require("../models/Medicine");

// CREATE BILL
router.post("/create", async (req, res) => {
  try {
    const { customerName, items } = req.body;

    let grandTotal = 0;

    for (let item of items) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res.status(404).json("Medicine Not Found");
      }

      if (medicine.quantity < item.quantity) {
        return res.status(400).json("Not enough stock");
      }

      const itemTotal = medicine.price * item.quantity;

      item.price = medicine.price;
      item.name = medicine.name;
      item.total = itemTotal;

      grandTotal += itemTotal;

      // Reduce stock
      medicine.quantity -= item.quantity;
      await medicine.save();
    }

    const newBill = new Bill({
      customerName,
      items,
      grandTotal
    });

    await newBill.save();

    res.json(newBill);

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;