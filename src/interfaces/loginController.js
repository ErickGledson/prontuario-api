const express = require("express");
const { login } = require("../application/authService");
const { createDoctor } = require("../application/doctorService");
const logger = require("../config/logger");
const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const doctor = await createDoctor(req.body);
    logger.info(`Doutor criado com id: ${doctor.id}`);
    res
      .status(200)
      .json({ id: doctor.id, name: doctor.name, email: doctor.email });
  } catch (err) {
    logger.error(`Erro ao criar doutor: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
