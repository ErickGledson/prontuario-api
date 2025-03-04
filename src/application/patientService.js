const { Patient } = require("../domain");
const redis = require("../config/redis");

const getPatients = async (page = 1, limit = 10) => {
  const cacheKey = `patients:${page}:${limit}`;
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const offset = (page - 1) * limit;
  const { rows, count } = await Patient.findAndCountAll({
    limit,
    offset,
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
  });
  const result = { total: count, page, perPage: limit, patients: rows };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 60 * 5);
  return result;
};

const createPatient = async (data) => {
  return await Patient.create(data);
};

const updatePatient = async (id, data) => {
  const patient = await Patient.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  if (!patient) {
    throw new Error("Paciente não encontrado");
  }
  return await patient.update(data);
};

const deletePatient = async (id) => {
  const patient = await Patient.findByPk(id);
  if (!patient) {
    throw new Error("Paciente não encontrado");
  }

  await Patient.destroy({ where: { id }, individualHooks: true });

  return { message: "Paciente excluído com sucesso" };
};

module.exports = {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
};
