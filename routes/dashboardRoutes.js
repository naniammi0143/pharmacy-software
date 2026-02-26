const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const Bill = require("../models/Bill");
const verifyToken = require("../middleware/authMiddleware");


// ================= DASHBOARD SUMMARY =================
router.get("/", verifyToken, async (req, res) => {
  try {

    const totalMedicines = await Medicine.countDocuments();

    const lowStock = await Medicine.countDocuments({
      quantity: { $lt: 10 }
    });

    const expired = await Medicine.countDocuments({
      expiryDate: { $lt: new Date() }
    });

    const bills = await Bill.find();

    const totalSales = bills.reduce((sum, bill) => {
      return sum + bill.totalAmount;
    }, 0);

    const today = new Date();
    today.setHours(0,0,0,0);

    const todaySalesData = await Bill.find({
      createdAt: { $gte: today }
    });

    const todaySales = todaySalesData.reduce((sum, bill) => {
      return sum + bill.totalAmount;
    }, 0);

    const medicines = await Medicine.find();

    const totalStockValue = medicines.reduce((sum, med) => {
      return sum + (med.price * med.quantity);
    }, 0);

    res.json({
      totalMedicines,
      lowStock,
      expired,
      totalSales,
      todaySales,
      totalStockValue
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


// ================= MONTHLY SALES CHART =================
router.get("/monthly-sales", verifyToken, async (req, res) => {
  try {

    const result = await Bill.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(result);

  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;