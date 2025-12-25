const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const { protect, isStudent } = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   1️⃣ SEND OTP (REGISTER / FORGOT)
===================================================== */
router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email)
            return res.status(400).json({ msg: "Email required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000;

        await OTP.deleteMany({ email });
        await OTP.create({ email, otp, expiresAt });

        await sendEmail(
            email,
            "Student Verification OTP",
            `<h2>Your OTP is ${otp}</h2><p>Valid for 2 minutes</p>`
        );

        res.json({ msg: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================================================
   2️⃣ REGISTER STUDENT (OTP VERIFIED)
===================================================== */
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password, otp } = req.body;

        if (!name || !username || !email || !password || !otp)
            return res.status(400).json({ msg: "All fields required" });

        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < Date.now())
            return res.status(400).json({ msg: "Invalid or expired OTP" });

        const exists = await Student.findOne({
            $or: [{ email }, { username }]
        });
        if (exists)
            return res.status(400).json({ msg: "Student already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            username,
            email,
            password: hashedPassword,
            isVerified: true,
            role: "student"
        });

        await OTP.deleteMany({ email });

        res.json({
            msg: "Registration successful",
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================================================
   3️⃣ LOGIN (JWT)
===================================================== */
router.post("/login", async (req, res) => {
    try {
        const { loginId, password } = req.body;

        const student = await Student.findOne({
            $or: [{ email: loginId }, { username: loginId }]
        });

        if (!student)
            return res.status(400).json({ msg: "Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid password" });

        // 🔐 JWT TOKEN
        const token = generateToken({
            id: student._id,
            role: "student"
        });

        res.json({
            msg: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                username: student.username
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================================================
   4️⃣ FORGOT PASSWORD (VERIFY OTP)
===================================================== */
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < Date.now())
            return res.status(400).json({ msg: "Invalid or expired OTP" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Student.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        await OTP.deleteMany({ email });

        res.json({ msg: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================================================
   5️⃣ GET STUDENT PROFILE (JWT PROTECTED)
===================================================== */
router.get("/me", protect, isStudent, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select("-password");

        if (!student)
            return res.status(404).json({ msg: "Student not found" });

        res.json(student);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
