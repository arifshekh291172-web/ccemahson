const API = "http://localhost:5000/api";

// AUTH CHECK
const studentId = localStorage.getItem("studentId");
if (!studentId) {
  window.location.href = "student-login.html";
}

// TOGGLE SIDEBAR
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("open");
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "student-login.html";
}

// LOAD STUDENT PROFILE
async function loadProfile() {
  const res = await fetch(`${API}/students/${studentId}`);
  const student = await res.json();

  document.getElementById("studentName").innerText = student.name;
  document.getElementById("dName").innerText = student.name;
  document.getElementById("dEmail").innerText = student.email;
}

// LOAD ADMISSION + COURSE
async function loadAdmission() {
  const res = await fetch(`${API}/admissions/student/${studentId}`);
  const data = await res.json();

  if (data.length === 0) {
    document.getElementById("courseName").innerText = "Not Enrolled";
    document.getElementById("paymentStatus").innerText = "-";
    document.getElementById("admissionStatus").innerText = "-";
    return;
  }

  const admission = data[0]; // latest admission

  document.getElementById("courseName").innerText =
    admission.course.title;

  document.getElementById("admissionStatus").innerText =
    admission.status;

  document.getElementById("dDate").innerText =
    new Date(admission.createdAt).toLocaleDateString();

  // PAYMENT STATUS
  const payRes = await fetch(`${API}/payments/student/${studentId}`);
  const payments = await payRes.json();

  if (payments.length > 0) {
    document.getElementById("paymentStatus").innerText =
      payments[0].status;
  } else {
    document.getElementById("paymentStatus").innerText = "PENDING";
  }
}

// INIT
loadProfile();
loadAdmission();
