let generatedOTP = "";
let emailVerified = false;
let otpTime = 120;
let resendCooldown = 30;
let timerInterval = null;
let resendInterval = null;

/* ===== SHOW / HIDE PASSWORD ===== */
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

/* ===== LOADER ===== */
function showLoader(show) {
    document.getElementById("loader").style.display =
        show ? "block" : "none";
}

/* ===== SEND OTP ===== */
function sendOTP() {
    const email = document.getElementById("email").value.trim();
    if (!email) { alert("Enter email"); return }

    showLoader(true);

    setTimeout(() => {
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP SENT:", generatedOTP);

        showLoader(false);
        document.getElementById("otpBox").style.display = "block";
        document.getElementById("otpStatus").innerText = "OTP sent to email";

        startOtpTimer();
        startResendCooldown();
    }, 1500);
}

/* ===== OTP TIMER ===== */
function startOtpTimer() {
    clearInterval(timerInterval);
    otpTime = 120;

    timerInterval = setInterval(() => {
        otpTime--;
        const m = String(Math.floor(otpTime / 60)).padStart(2, "0");
        const s = String(otpTime % 60).padStart(2, "0");
        document.getElementById("otpTimer").innerText =
            `OTP expires in ${m}:${s}`;

        if (otpTime <= 0) {
            clearInterval(timerInterval);
            generatedOTP = "";
            document.getElementById("otpStatus").innerText = "OTP expired";
        }
    }, 1000);
}

/* ===== VERIFY OTP ===== */
function verifyOTP() {
    const otp = document.getElementById("otpInput").value.trim();
    if (otp === generatedOTP) {
        emailVerified = true;
        clearInterval(timerInterval);

        document.getElementById("otpStatus").innerText = "Email verified ✔";
        document.getElementById("password").disabled = false;
        document.getElementById("confirmPassword").disabled = false;
        document.getElementById("registerBtn").disabled = false;
    } else {
        document.getElementById("otpStatus").innerText = "Invalid OTP";
    }
}

/* ===== RESEND OTP ===== */
function startResendCooldown() {
    const btn = document.getElementById("resendBtn");
    resendCooldown = 30;
    btn.classList.add("disabled");
    btn.innerText = `Resend in ${resendCooldown}s`;

    resendInterval = setInterval(() => {
        resendCooldown--;
        btn.innerText = `Resend in ${resendCooldown}s`;
        if (resendCooldown <= 0) {
            clearInterval(resendInterval);
            btn.innerText = "Resend OTP";
            btn.classList.remove("disabled");
        }
    }, 1000);
}

function resendOTP() {
    if (document.getElementById("resendBtn").classList.contains("disabled")) return;
    sendOTP();
}

/* ===== REGISTER ===== */
function registerStudent() {
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const cpass = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    if (!name || !username || !email || !pass || !cpass) {
        alert("Fill all fields"); return;
    }
    if (!emailVerified) { alert("Verify email"); return }
    if (pass !== cpass) { alert("Passwords mismatch"); return }
    if (!terms) { alert("Accept Terms"); return }

    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.push({ id: Date.now(), name, username, email, password: pass });
    localStorage.setItem("students", JSON.stringify(students));

    alert("Registration successful!");
    location.href = "student-login.html";
}
