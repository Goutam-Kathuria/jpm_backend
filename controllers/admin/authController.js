const jwt = require("jsonwebtoken");
const Setting = require("../../models/Setting");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Setting.findOne();

    if (admin.email !== email) {
      return res.status(401).json({ message: "Invalid email." });
    }

    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
    );

    return res.json({
      token,
      user: admin,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
