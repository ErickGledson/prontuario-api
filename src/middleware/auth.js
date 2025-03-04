const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-auth-token']?.split(' ')[1];
  if (!token) {
    logger.error('Token não encontrado na requisição');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    logger.error('Token fornecido é inválido');
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
