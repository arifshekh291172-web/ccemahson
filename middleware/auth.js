const jwt = require("jsonwebtoken");

/* =====================
   VERIFY TOKEN
===================== */
exports.protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token provided" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

/* =====================
   ROLE CHECK
===================== */
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin access only" });
  next();
};

exports.isStudent = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ msg: "Student access only" });
  next();
};
