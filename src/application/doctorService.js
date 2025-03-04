const { Doctor } = require("../domain");
const bcrypt = require("bcryptjs");

const createDoctor = async (data) => {
  return await Doctor.create(data);
};

const getDoctor = async (id) => {
  return await Doctor.findOne({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    where: { id },
  });
};

const updateDoctor = async (id, data) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw new Error("Doutor não encontrado");
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await doctor.update(data);
};

const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw new Error("Doutor não encontrado");
  }

  await doctor.destroy();
  return { message: "Doutor excluído com sucesso" };
};

module.exports = { createDoctor, getDoctor, updateDoctor, deleteDoctor };
