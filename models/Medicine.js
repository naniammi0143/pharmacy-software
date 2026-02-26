const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNo: String,
  expiryDate: Date,
  price: Number,
  purchasePrice: { type: Number, default: 0 },
  quantity: Number,
  company: String
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);