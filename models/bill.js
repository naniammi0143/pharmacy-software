const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine"
      },
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  grandTotal: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bill", billSchema);