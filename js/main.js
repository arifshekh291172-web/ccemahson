function submitAdmission() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let course = document.getElementById("course").value;

  if (!name || !phone || !course) {
    alert("Please fill all fields");
    return false;
  }

  alert("Admission submitted successfully (Backend later)");
  return false;
}
function whatsappEnquiry() {
  const msg = encodeURIComponent(
    "Hello, I want information about computer courses at CCE Mahson."
  );
  window.open("https://wa.me/919005526734?text=" + msg, "_blank");
}
