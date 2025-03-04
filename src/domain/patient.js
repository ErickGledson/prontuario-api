const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define(
  'Patient',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    birthdate: { type: DataTypes.DATE, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
  },
  { timestamps: true, paranoid: true }
);

Patient.beforeDestroy(async (patient, options) => {
    patient.name = 'Anônimo';
    patient.phone = '***';
    patient.email = '***';
    patient.birthdate = '1999-01-01';
    patient.gender = '*';
    patient.height = 0;
    patient.weight = 0;

    await patient.save({ hooks: false, transaction: options.transaction });
});

module.exports = Patient;
