const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

/* =========================
   ADD COURSE (ADMIN)
========================= */
router.post("/add", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json({ msg: "Course added", course });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET ALL COURSES
========================= */
router.get("/", async (req, res) => {
  const courses = await Course.find({ status: "ACTIVE" });
  res.json(courses);
});

/* =========================
   COURSE DETAILS
========================= */
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

/* =========================
   UPDATE COURSE
========================= */
router.put("/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(course);
});

/* =========================
   DELETE COURSE
========================= */
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ msg: "Course deleted" });
});

module.exports = router;
