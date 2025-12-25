const courses = {
  dca: {
    title: "DCA – Diploma in Computer Application",
    duration: "6 Months",
    fees: "₹6,000",
    details: "Computer Fundamentals, MS Office, Internet, Basics of Programming"
  },
  adca: {
    title: "ADCA – Advance Diploma",
    duration: "12 Months",
    fees: "₹10,000",
    details: "Advanced Computer, Tally, GST, Internet Technology"
  },
  tally: {
    title: "TALLY with GST",
    duration: "3 Months",
    fees: "₹5,000",
    details: "Accounting, GST Practical, Reports"
  }
};

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");

if (courses[courseId]) {
  document.getElementById("courseTitle").innerText = courses[courseId].title;
  document.getElementById("courseDuration").innerText = courses[courseId].duration;
  document.getElementById("courseFees").innerText = courses[courseId].fees;
  document.getElementById("courseDetails").innerText = courses[courseId].details;

  document.getElementById("applyBtn").href =
    `admission.html?course=${courseId}`;
}
