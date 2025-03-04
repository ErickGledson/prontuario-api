const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./patient');

const Appointment = sequelize.define(
  'Appointment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Patient, key: 'id' },
    },
    date: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: true }
);

module.exports = Appointment;
