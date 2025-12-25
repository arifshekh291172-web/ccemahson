const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  name: String,
  email: String,
  status: {
    type: String,
    enum: ["AI", "ADMIN", "CLOSED"],
    default: "AI"
  }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
