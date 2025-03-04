const express = require('express');
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require('../application/patientService');
const logger = require('../config/logger');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    logger.info(`Paciente criado com id: ${patient.id}`);
    res.status(201).json(patient);
  } catch (err) {
    logger.error(`Erro ao criar paciente: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const patients = await getPatients(parseInt(page), parseInt(limit));
    logger.info(`Listagem de pacientes realizada, total: ${patients.total}`);
    res.json(patients);
  } catch (err) {
    logger.error(`Erro ao listar pacientes: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);
    logger.info(`Paciente ${patient.id} atualizado`);
    res.json(patient);
  } catch (err) {
    logger.error(`Erro ao atualizar paciente: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePatient(id);
    logger.info(`Paciente #${id} anomizado`);
    res.json(result);
  } catch (err) {
    logger.error(`Erro ao deletar paciente: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
