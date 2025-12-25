const express = require("express");
const Certificate = require("../models/Certificate");
const Student = require("../models/Student");

const router = express.Router();

/* ================= ISSUE CERTIFICATE ================= */
router.post("/issue", async (req, res) => {
  const cert = await Certificate.create(req.body);

  await Student.findByIdAndUpdate(req.body.student, {
    $push: { certificates: cert._id }
  });

  res.json({ msg: "Certificate issued", cert });
});

/* ================= STUDENT CERTIFICATES ================= */
router.get("/student/:id", async (req, res) => {
  const certs = await Certificate.find({ student: req.params.id })
    .populate("course");
  res.json(certs);
});

module.exports = router;
