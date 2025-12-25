const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  certificateNumber: String,

  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Certificate", certificateSchema);
