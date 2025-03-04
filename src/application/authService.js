const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Doctor } = require("../domain");

const login = async (email, password) => {
  const doctor = await Doctor.findOne({ where: { email } });
  if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
    throw new Error("Credenciais inválidas");
  }

  return jwt.sign(
    { id: doctor.id, email: doctor.email },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );
};

module.exports = { login };
