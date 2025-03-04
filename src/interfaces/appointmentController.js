const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  addNotesToAppointment,
} = require("../application/appointmentService");
const logger = require("../config/logger");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { patientId, date } = req.body;
    const appointment = await createAppointment(patientId, date);
    logger.info(
      `Consulta agendada: id ${appointment.id} para o paciente ${patientId} em ${date}`,
    );
    res.status(201).json(appointment);
  } catch (err) {
    logger.error(`Erro ao agendar consulta: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const appointments = await getAppointments(parseInt(page), parseInt(limit));
    logger.info(
      `Listagem de consultas realizada, total: ${appointments.total}`,
    );
    res.json(appointments);
  } catch (err) {
    logger.error(`Erro ao listar consultas: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const appointment = await updateAppointment(req.params.id, req.body.date);
    logger.info(
      `Consulta ${appointment.id} atualizada para novo horário: ${req.body.date}`,
    );
    res.json(appointment);
  } catch (err) {
    logger.error(`Erro ao atualizar consulta: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await deleteAppointment(req.params.id);
    logger.info(`Consulta ${req.params.id} excluída`);
    res.json(response);
  } catch (err) {
    logger.error(`Erro ao excluir consulta: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/notes", async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await addNotesToAppointment(req.params.id, notes);
    logger.info(`Anotações atualizadas para a consulta ${req.params.id}`);
    res.json(appointment);
  } catch (err) {
    logger.error(`Erro ao atualizar anotações: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
