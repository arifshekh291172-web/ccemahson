function validateForm() {
  if (document.getElementById("name").value === "") {
    alert("Name required");
    return false;
  }
  alert("Form submitted (backend later)");
  return false;
}
