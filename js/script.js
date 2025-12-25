function login() {
  localStorage.setItem("login", "true");
  alert("Login successful");
  window.location.href = "courses.html";
}

function register() {
  alert("Account created");
  window.location.href = "login.html";
}

function apply(course) {
  localStorage.setItem("course", course);
  if (!localStorage.getItem("login")) {
    alert("Please login first");
    window.location.href = "login.html";
  } else {
    window.location.href = "apply.html";
  }
}

function checkLogin() {
  if (!localStorage.getItem("login")) {
    window.location.href = "login.html";
  }
  document.getElementById("course").value =
    localStorage.getItem("course");
}
