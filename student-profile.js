const API = "http://localhost:5000/api";
const studentId = localStorage.getItem("studentId");

if(!studentId){
  window.location.href = "student-login.html";
}

function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("open");
}

function logout(){
  localStorage.clear();
  window.location.href = "student-login.html";
}

/* LOAD PROFILE */
async function loadProfile(){
  const res = await fetch(`${API}/students/${studentId}`);
  const s = await res.json();

  document.getElementById("name").value = s.name;
  document.getElementById("username").value = s.username;
  document.getElementById("email").value = s.email;
}

loadProfile();

/* SEND OTP FOR EMAIL VERIFY */
async function sendOtp(){
  const email = document.getElementById("email").value;

  document.getElementById("loader").style.display = "block";

  await fetch(`${API}/students/send-otp`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email })
  });

  document.getElementById("loader").style.display = "none";
  document.getElementById("otpBox").style.display = "block";
  alert("OTP sent to new email");
}

/* VERIFY OTP */
async function verifyOtp(){
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch(`${API}/students/verify-email`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, otp, studentId })
  });

  const data = await res.json();

  if(res.ok){
    alert("Email verified");
    document.getElementById("otpBox").style.display = "none";
  }else{
    alert(data.msg);
  }
}

/* SAVE PROFILE */
async function saveProfile(){
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/students/update/${studentId}`,{
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ name, email })
  });

  const data = await res.json();

  if(res.ok){
    alert("Profile updated");
  }else{
    alert(data.msg);
  }
}
