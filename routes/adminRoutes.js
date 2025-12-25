const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

/* =====================================================
   ADMIN LOGIN (DATABASE + JWT)
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password required" });

    const admin = await Admin.findOne({ email });

    if (!admin)
      return res.status(404).json({ msg: "Admin not found" });

    // 🔒 BLOCKED CHECK
    if (admin.status === "BLOCKED")
      return res.status(403).json({
        msg: "Your admin account has been blocked. Contact super admin."
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Invalid password" });

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
