const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  amount: Number,

  method: {
    type: String,
    enum: ["ONLINE", "COD"]
  },

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },

  transactionId: String,

  paidAt: Date
});

module.exports = mongoose.model("Payment", paymentSchema);
