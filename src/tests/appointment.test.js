const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const redis = require("../config/redis");

describe("Agendamento API", () => {
  let patientId;
  let token;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error("Ocorreu um erro ao conectar no banco de dados:", error);
    }
  });

  beforeEach(async () => {
    try {
      await redis.flushall();
    } catch (error) {
      console.error("Ocorreu um erro ao limpar o cache:", error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
    await redis.flushall();
    await redis.disconnect();
  });

  beforeAll(async () => {
    await request(app).post("/auth/signup").send({
      name: "Dr. Teste",
      email: "test@doctor.com",
      password: "123456",
    });

    const resLogin = await request(app).post("/auth/signin").send({
      email: "test@doctor.com",
      password: "123456",
    });

    token = resLogin.body.token;

    const resPatient = await request(app)
      .post("/patients")
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        name: "Paciente Teste",
        phone: "999999999",
        email: "paciente@email.com",
        birthdate: "2000-01-01",
        gender: "M",
        height: 1.8,
        weight: 75,
      });

    patientId = resPatient.body.id;
  });

  it("Deve criar um agendamento", async () => {
    const res = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        patientId,
        date: "2025-03-01T10:00:00.000Z",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("Não deve permitir dois agendamentos no mesmo horário", async () => {
    const res = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        patientId,
        date: "2025-03-01T10:00:00.000Z",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Já existe um agendamento para esse horário.");
  });

  it("Deve listar os agendamentos", async () => {
    const res = await request(app)
      .get("/appointments")
      .set("x-auth-token", `Bearer ${token}`);

    const expected = {
      total: 1,
      page: 1,
      perPage: 10,
      appointments: [
        {
          id: 1,
          patientId: 1,
          date: "2025-03-01T10:00:00.000Z",
          notes: null,
          Patient: {
            name: "Paciente Teste",
            email: "paciente@email.com",
            phone: "999999999",
          },
        },
      ],
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  it("Deve editar um agendamento", async () => {
    const appointment = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        patientId,
        date: "2025-03-02T10:00:00.000Z",
      });

    const res = await request(app)
      .put(`/appointments/${appointment.body.id}`)
      .set("x-auth-token", `Bearer ${token}`)
      .send({ date: "2025-03-02T11:00:00.000Z" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.date).toBe("2025-03-02T11:00:00.000Z");
  });

  it("Deve excluir um agendamento", async () => {
    const appointment = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        patientId,
        date: "2025-03-03T10:00:00.000Z",
      });

    const res = await request(app)
      .delete(`/appointments/${appointment.body.id}`)
      .set("x-auth-token", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Consulta excluída com sucesso");
  });

  it("Não deve permitir dois agendamentos na mesma data e horário", async () => {
    const date = "2025-03-10T14:00:00.000Z";

    // Primeiro agendamento (deve ser criado com sucesso)
    const res1 = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({ patientId, date });

    expect(res1.statusCode).toEqual(201);
    expect(res1.body).toHaveProperty("id");

    // Segundo agendamento no mesmo horário (deve falhar)
    const res2 = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({ patientId, date });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.error).toBe("Já existe um agendamento para esse horário.");
  });

  it("Deve adicionar uma anotação a uma consulta", async () => {
    // Criar uma consulta
    const appointment = await request(app)
      .post("/appointments")
      .set("x-auth-token", `Bearer ${token}`)
      .send({ patientId, date: "2025-03-15T10:00:00.000Z" });

    const appointmentId = appointment.body.id;

    // Adicionar nota
    const res = await request(app)
      .put(`/appointments/${appointmentId}/notes`)
      .set("x-auth-token", `Bearer ${token}`)
      .send({ notes: "Paciente apresentou sintomas de febre e tosse." });

    expect(res.statusCode).toEqual(200);
    expect(res.body.notes).toBe(
      "Paciente apresentou sintomas de febre e tosse.",
    );
  });
});
