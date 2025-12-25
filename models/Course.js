const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  fees: Number,

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", courseSchema);
