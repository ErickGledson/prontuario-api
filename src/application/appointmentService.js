const Appointment = require('../domain/appointment');
const { Patient } = require('../domain');
const redis = require('../config/redis');
const { Op } = require('sequelize');

const createAppointment = async (patientId, date) => {
  const patient = await Patient.findByPk(patientId);
  if (!patient) {
    throw new Error('Paciente não encontrado');
  }

  const existingAppointment = await Appointment.findOne({
    where: { date, patientId },
  });

  if (existingAppointment) {
    throw new Error('Já existe um agendamento para esse horário.');
  }

  return await Appointment.create({ patientId, date });
};

const getAppointments = async (page = 1, limit = 10) => {
  const cacheKey = `appointments:${page}:${limit}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const offset = (page - 1) * limit;
  const { rows, count } = await Appointment.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['updatedAt', 'createdAt'] },
    include: [
      {
        model: Patient,
        attributes: ['name', 'email', 'phone'],
      },
    ],
  });
  const result = { total: count, page, perPage: limit, appointments: rows };
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 5);
  return result;
};

const updateAppointment = async (id, newDate) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new Error('Consulta não encontrada');
  }

  const conflict = await Appointment.findOne({
    where: { date: newDate, id: { [Op.ne]: id } },
  });

  if (conflict) {
    throw new Error('Já existe uma consulta nesse horário.');
  }

  return await appointment.update({ date: newDate });
};

const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error('Consulta não encontrada');
  }

  await appointment.destroy();
  return { message: 'Consulta excluída com sucesso' };
};

const addNotesToAppointment = async (id, notes) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new Error('Consulta não encontrada');
  }

  appointment.notes = notes;
  await appointment.save();
  return appointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  addNotesToAppointment,
};
