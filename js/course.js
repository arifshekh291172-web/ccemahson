/* ======================================
   LOAD COURSES FROM ADMIN (localStorage)
====================================== */

const courseList = document.getElementById("courseList");
const courses = JSON.parse(localStorage.getItem("courses")) || [];

if (courses.length === 0) {
  courseList.innerHTML = `
    <p style="color:#64748b">
      No courses available right now.
    </p>
  `;
}

courses.forEach(course => {
  courseList.innerHTML += `
    <div class="course-card"
      onclick="window.location.href='course-details.html?id=${course.id}'">

      <h3>${course.title}</h3>

      <p><b>Duration:</b> ${course.duration}</p>
      <p><b>Fees:</b> ₹${course.fees}</p>

      <p class="course-desc">
        ${course.description.substring(0, 90)}...
      </p>

      <span class="course-btn">
        View Details →
      </span>
    </div>
  `;
});
