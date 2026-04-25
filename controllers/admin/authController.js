const jwt = require("jsonwebtoken");
const Setting = require("../../models/Setting");

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured." });
    }

    const admin = await Setting.findOne().sort({ createdAt: 1 });
    if (!admin) {
      return res.status(404).json({ message: "Admin settings are not configured yet." });
    }

    if (!admin.email || admin.email !== email) {
      return res.status(401).json({ message: "Invalid email." });
    }

    if (!admin.password || password !== admin.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
    );

    return res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName || admin.email || "Admin",
      },
      message: "Login successful.",
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
