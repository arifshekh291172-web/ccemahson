const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "ADMIN"
  },

  status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED"],
    default: "ACTIVE"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admin", adminSchema);
