const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

  /* =========================
     BASIC DETAILS
  ========================= */
  name: {
    type: String,
    required: true,
    trim: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  /* =========================
     VERIFICATION & STATUS
  ========================= */
  isVerified: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED"],
    default: "ACTIVE"
  },

  /* =========================
     COURSE & ADMISSION
  ========================= */
  enrolledCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission"
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      completionStatus: {
        type: String,
        enum: ["ONGOING", "COMPLETED"],
        default: "ONGOING"
      }
    }
  ],

  /* =========================
     CERTIFICATES
  ========================= */
  certificates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate"
    }
  ],

  /* =========================
     PAYMENT HISTORY
  ========================= */
  payments: [
    {
      admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission"
      },
      amount: Number,
      mode: {
        type: String,
        enum: ["ONLINE", "COD"]
      },
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
      },
      paidAt: Date
    }
  ],

  /* =========================
     LOGIN & SECURITY
  ========================= */
  lastLogin: {
    type: Date
  },

  loginHistory: [
    {
      ip: String,
      device: String,
      loggedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  /* =========================
     SYSTEM META
  ========================= */
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

/* =========================
   AUTO UPDATE updatedAt
========================= */
studentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Student", studentSchema);
