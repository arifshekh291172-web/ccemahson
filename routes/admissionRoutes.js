const express = require("express");
const Admission = require("../models/Admission");
const Student = require("../models/Student");
const Course = require("../models/Course");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* =====================================================
   1️⃣ APPLY FOR ADMISSION (STUDENT)
===================================================== */
router.post("/apply", async (req, res) => {
  try {
    const { studentId, courseId, paymentMode } = req.body;

    if (!studentId || !courseId || !paymentMode) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ msg: "Student or Course not found" });
    }

    // prevent duplicate admission
    const already = await Admission.findOne({
      student: studentId,
      course: courseId
    });

    if (already) {
      return res.status(400).json({ msg: "Already applied for this course" });
    }

    const admission = await Admission.create({
      student: studentId,
      course: courseId,
      paymentMode,
      status: paymentMode === "ONLINE" ? "APPROVED" : "PENDING"
    });

    // link course to student
    await Student.findByIdAndUpdate(studentId, {
      $push: {
        enrolledCourses: {
          course: courseId,
          admission: admission._id,
          completionStatus: "ONGOING"
        }
      }
    });

    // 📧 email notification
    await sendEmail(
      student.email,
      "Admission Application Submitted",
      `
        <h3>Hello ${student.name}</h3>
        <p>Your admission request for <b>${course.title}</b> has been submitted.</p>
        <p>Status: <b>${admission.status}</b></p>
      `
    );

    res.json({
      msg: "Admission applied successfully",
      admission
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   2️⃣ GET ALL ADMISSIONS (ADMIN)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const admissions = await Admission.find()
      .populate("student")
      .populate("course")
      .populate("approvedBy");

    res.json(admissions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   3️⃣ GET STUDENT ADMISSIONS
===================================================== */
router.get("/student/:id", async (req, res) => {
  try {
    const admissions = await Admission.find({
      student: req.params.id
    }).populate("course");

    res.json(admissions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   4️⃣ ADMIN APPROVE ADMISSION (COD)
===================================================== */
router.put("/approve/:id", async (req, res) => {
  try {
    const { adminId } = req.body;

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        status: "APPROVED",
        approvedBy: adminId
      },
      { new: true }
    ).populate("student").populate("course");

    if (!admission) {
      return res.status(404).json({ msg: "Admission not found" });
    }

    // 📧 email confirmation
    await sendEmail(
      admission.student.email,
      "Admission Approved 🎉",
      `
        <h3>Congratulations ${admission.student.name}</h3>
        <p>Your admission for <b>${admission.course.title}</b> has been approved.</p>
      `
    );

    res.json({
      msg: "Admission approved",
      admission
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   5️⃣ ADMIN REJECT ADMISSION
===================================================== */
router.put("/reject/:id", async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ msg: "Admission not found" });
    }

    res.json({ msg: "Admission rejected", admission });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   6️⃣ MARK COURSE COMPLETED (ADMIN)
===================================================== */
router.put("/complete/:id", async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission)
      return res.status(404).json({ msg: "Admission not found" });

    await Student.updateOne(
      {
        _id: admission.student,
        "enrolledCourses.admission": admission._id
      },
      {
        $set: {
          "enrolledCourses.$.completionStatus": "COMPLETED"
        }
      }
    );

    res.json({ msg: "Course marked as completed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
