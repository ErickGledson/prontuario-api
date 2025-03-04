const Appointment = require('./appointment');
const Doctor = require('./doctor');
const Patient = require('./patient');

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = { Appointment, Doctor, Patient };
