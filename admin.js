/* =========================================
   ADMIN MASTER JS
   Live Course + Admission System
   localStorage based (Backend-ready)
========================================= */

/* =========================================
   COURSES STORAGE HELPERS
========================================= */
function getCourses() {
    return JSON.parse(localStorage.getItem("courses")) || [];
}

function saveCourses(courses) {
    localStorage.setItem("courses", JSON.stringify(courses));
}

/* =========================================
   ADD COURSE
   (admin-add-course.html)
========================================= */
function addCourse() {
    const title = document.getElementById("cname").value.trim();
    const duration = document.getElementById("cduration").value.trim();
    const fees = document.getElementById("cfees").value.trim();
    const description = document.getElementById("cdesc").value.trim();

    if (!title || !duration || !fees || !description) {
        alert("Please fill all fields");
        return;
    }

    const courses = getCourses();

    courses.push({
        id: Date.now(),                 // unique course id
        title,
        duration,
        fees,
        description,
        createdAt: new Date().toISOString()
    });

    saveCourses(courses);

    alert("Course added successfully");
    window.location.href = "admin-courses.html";
}

/* =========================================
   LOAD COURSES IN ADMIN TABLE
   (admin-courses.html)
========================================= */
function loadCoursesTable() {
    const table = document.getElementById("courseTable");
    if (!table) return;

    const courses = getCourses();
    table.innerHTML = "";

    if (courses.length === 0) {
        table.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;color:#64748b">
          No courses added yet
        </td>
      </tr>`;
        return;
    }

    courses.forEach(course => {
        table.innerHTML += `
      <tr>
        <td>${course.title}</td>
        <td>${course.duration}</td>
        <td>₹${course.fees}</td>
      </tr>`;
    });
}

/* =========================================
   LOAD COURSES ON WEBSITE
   (courses.html)
========================================= */
function loadWebsiteCourses() {
    const box = document.getElementById("courseList");
    if (!box) return;

    const courses = getCourses();
    box.innerHTML = "";

    courses.forEach(course => {
        box.innerHTML += `
      <div class="course-card"
        onclick="location.href='course-details.html?id=${course.id}'">
        <h3>${course.title}</h3>
        <p><b>Duration:</b> ${course.duration}</p>
        <p><b>Fees:</b> ₹${course.fees}</p>
        <p style="font-size:14px;color:#64748b">
          ${course.description.substring(0, 90)}...
        </p>
      </div>`;
    });
}

/* =========================================
   LOAD COURSE DETAILS
   (course-details.html)
========================================= */
function loadCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const courses = getCourses();
    const course = courses.find(c => c.id == id);
    if (!course) return;

    document.getElementById("title").innerText = course.title;
    document.getElementById("duration").innerText =
        "Duration: " + course.duration;
    document.getElementById("fees").innerText =
        "Fees: ₹" + course.fees;
    document.getElementById("desc").innerText =
        course.description;

    const applyBtn = document.getElementById("applyBtn");
    if (applyBtn) {
        applyBtn.href =
            "admission.html?course=" + encodeURIComponent(course.title);
    }
}

/* =========================================
   LOAD COURSES IN ADMISSION FORM
   (admission.html)
========================================= */
function loadAdmissionCourses() {
    const select = document.getElementById("course");
    if (!select) return;

    const courses = getCourses();
    select.innerHTML = `<option value="">Select Course</option>`;

    courses.forEach(course => {
        select.innerHTML += `
      <option value="${course.title}">
        ${course.title}
      </option>`;
    });

    const params = new URLSearchParams(window.location.search);
    const selected = params.get("course");
    if (selected) {
        select.value = selected;
    }
}

/* =========================================
   LOAD ADMISSIONS (ADMIN)
   (admin-admissions.html)
========================================= */
function loadAdmissions() {
    const table = document.getElementById("admissionTable");
    if (!table) return;

    const admissions =
        JSON.parse(localStorage.getItem("admissions")) || [];

    table.innerHTML = "";

    admissions.forEach((a, index) => {
        table.innerHTML += `
      <tr>
        <td>${a.name}</td>
        <td>${a.course}</td>
        <td>${a.payment}</td>
        <td>${a.status}</td>
        <td>
          ${a.payment === "COD" && a.status === "PENDING"
                ? `<button
                   onclick="approveAdmission(${index})"
                   style="padding:6px 12px;
                          background:#2563eb;
                          color:#fff;
                          border:none;
                          border-radius:6px">
                   Approve
                 </button>`
                : `<span style="color:green;font-weight:600">
                   SUCCESS
                 </span>`
            }
        </td>
      </tr>`;
    });
}

/* =========================================
   APPROVE COD ADMISSION
   (Admin Action)
========================================= */
function approveAdmission(index) {
    const admissions =
        JSON.parse(localStorage.getItem("admissions")) || [];

    admissions[index].status = "SUCCESS";

    localStorage.setItem("admissions", JSON.stringify(admissions));

    // 📧 EMAIL SIMULATION (Backend later)
    alert(
        "Admission Approved!\n\n" +
        "Status: SUCCESS\n" +
        "Confirmation email sent to student."
    );

    console.log(
        "EMAIL SENT →",
        admissions[index].name,
        admissions[index].course
    );

    loadAdmissions();
}

/* =========================================
   LOAD STUDENTS (ONLY SUCCESS ADMISSIONS)
   (admin-students.html)
========================================= */
function loadStudents() {
    const table = document.getElementById("studentTable");
    if (!table) return;

    const admissions =
        JSON.parse(localStorage.getItem("admissions")) || [];

    const students = admissions.filter(a => a.status === "SUCCESS");
    table.innerHTML = "";

    if (students.length === 0) {
        table.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:#64748b">
          No students found
        </td>
      </tr>`;
        return;
    }

    students.forEach(s => {
        table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.mobile}</td>
        <td>${s.course}</td>
        <td>${s.payment}</td>
        <td style="color:green;font-weight:600">SUCCESS</td>
        <td>${new Date(s.id).toLocaleDateString()}</td>
      </tr>`;
    });
}

/* =========================================
   DASHBOARD STATS
   (admin-dashboard.html)
========================================= */
function loadDashboardStats() {
    const courses = getCourses();
    const admissions =
        JSON.parse(localStorage.getItem("admissions")) || [];

    const totalCourses = document.getElementById("totalCourses");
    const totalAdmissions = document.getElementById("totalAdmissions");
    const pendingAdmissions = document.getElementById("pendingAdmissions");
    const successAdmissions = document.getElementById("successAdmissions");

    if (totalCourses) totalCourses.innerText = courses.length;
    if (totalAdmissions) totalAdmissions.innerText = admissions.length;
    if (pendingAdmissions)
        pendingAdmissions.innerText =
            admissions.filter(a => a.status === "PENDING").length;
    if (successAdmissions)
        successAdmissions.innerText =
            admissions.filter(a => a.status === "SUCCESS").length;
}

/* =========================================
   AUTO INIT (SAFE)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadCoursesTable();
    loadWebsiteCourses();
    loadCourseDetails();
    loadAdmissionCourses();
    loadAdmissions();
    loadStudents();
    loadDashboardStats();
});
