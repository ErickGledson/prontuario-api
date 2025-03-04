const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const redis = require('../config/redis');

describe('Paciente API', () => {
  let token;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Ocorreu um erro ao conectar no banco de dados:', error);
    }

    await request(app).post('/auth/signup').send({
      name: 'Dr. Teste',
      email: 'test@doctor.com',
      password: '123456',
    });

    const resLogin = await request(app).post('/auth/signin').send({
      email: 'test@doctor.com',
      password: '123456',
    });

    token = resLogin.body.token;
  });

  beforeEach(async () => {
    try {
      await redis.flushall();
    } catch (error) {
      console.error('Ocorreu um erro ao limpar o cache:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
    await redis.disconnect();
  });

  it('Deve criar um novo paciente', async () => {
    const res = await request(app)
      .post('/patients')
      .set('x-auth-token', `Bearer ${token}`)
      .send({
        name: 'Teste',
        phone: '999999999',
        email: 'teste@email.com',
        birthdate: '2000-01-01',
        gender: 'M',
        height: 1.8,
        weight: 75,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('Deve listar os pacientes', async () => {
    const res = await request(app)
      .get('/patients')
      .set('x-auth-token', `Bearer ${token}`);

    const expected = {
      page: 1,
      patients: [
        {
          birthdate: '2000-01-01T00:00:00.000Z',
          email: 'teste@email.com',
          gender: 'M',
          height: 1.8,
          id: 1,
          name: 'Teste',
          phone: '999999999',
          weight: 75,
        },
      ],
      perPage: 10,
      total: 1,
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  it('Deve atualizar um paciente', async () => {
    const patient = await request(app)
      .post('/patients')
      .set('x-auth-token', `Bearer ${token}`)
      .send({
        name: 'Teste',
        phone: '999999999',
        email: 'testeUpdate@email.com',
        birthdate: '2000-01-01',
        gender: 'M',
        height: 1.8,
        weight: 75,
      });

    const res = await request(app)
      .put(`/patients/${patient.body.id}`)
      .set('x-auth-token', `Bearer ${token}`)
      .send({
        name: 'Teste Atualizado',
        phone: '888888888',
        email: 'teste@atualizado.com',
        birthdate: '2000-01-01',
        gender: 'M',
        height: 1.8,
        weight: 75,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Teste Atualizado');
  });

  it('Deve excluir um paciente', async () => {
    const patient = await request(app)
      .post('/patients')
      .set('x-auth-token', `Bearer ${token}`)
      .send({
        name: 'Teste',
        phone: '999999999',
        email: 'testeDelete@email.com',
        birthdate: '2000-01-01',
        gender: 'M',
        height: 1.8,
        weight: 75,
      });

    const res = await request(app)
      .delete(`/patients/${patient.body.id}`)
      .set('x-auth-token', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Paciente excluído com sucesso');
  });
});
