const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./interfaces/doctorController');
const patientRoutes = require('./interfaces/patientController');
const appointmentRoutes = require('./interfaces/appointmentController');
const authMiddleware = require('./middleware/auth');
const loginRoute = require('./interfaces/loginController');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', loginRoute);
app.use('/doctors', authMiddleware, doctorRoutes);
app.use('/patients', authMiddleware, patientRoutes);
app.use('/appointments', authMiddleware, appointmentRoutes);

module.exports = app;
