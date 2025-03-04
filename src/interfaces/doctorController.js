const express = require("express");
const {
  getDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../application/doctorService");
const logger = require("../config/logger");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id } = req.user;
    const doctors = await getDoctor(id);
    logger.info(`Doutor com id ${id} encontrado`);
    res.json(doctors);
  } catch (err) {
    logger.error(`Erro ao obter doutor`);
    res.status(400).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const { id } = req.user;
    const doctor = await updateDoctor(id, req.body);
    logger.info(`Doutor ${id} atualizado`);
    res.json({ id: doctor.id, name: doctor.name, email: doctor.email });
  } catch (err) {
    logger.error(`Erro ao atualizar doutor: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id } = req.user;
    const response = await deleteDoctor(id);
    logger.info(`Doutor #${id} excluido`);
    res.json(response);
  } catch (err) {
    logger.error(`Erro ao excluir doutor: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
