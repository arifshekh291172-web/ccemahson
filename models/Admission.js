const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  paymentMode: {
    type: String,
    enum: ["ONLINE", "COD"]
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admission", admissionSchema);
