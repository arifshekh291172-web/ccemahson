function login() {
  localStorage.setItem("auth", "true");
  window.location.href = "courses.html";
}

function register() {
  alert("Registration successful");
  window.location.href = "login.html";
}

function applyCourse(course) {
  localStorage.setItem("course", course);
  if (!localStorage.getItem("auth")) {
    window.location.href = "login.html";
  } else {
    window.location.href = "apply.html";
  }
}

function protectPage() {
  if (!localStorage.getItem("auth")) {
    window.location.href = "login.html";
  }
  document.getElementById("course").value =
    localStorage.getItem("course");
}
