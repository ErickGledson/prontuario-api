const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const redis = require("../config/redis");

describe("Doutores API", () => {
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
    await redis.disconnect();
  });

  it("Deve criar um novo médico", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Dr. João",
      email: "joao@email.com",
      password: "123456",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");

    const resLogin = await request(app).post("/auth/signin").send({
      email: "joao@email.com",
      password: "123456",
    });

    token = resLogin.body.token;
  });

  it("Deve obter os dados do médico", async () => {
    const res = await request(app)
      .get("/doctors")
      .set("x-auth-token", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      id: 1,
      name: "Dr. João",
      email: "joao@email.com",
    });
  });

  it("Deve atualizar os dados de um médico", async () => {
    const res = await request(app)
      .put(`/doctors`)
      .set("x-auth-token", `Bearer ${token}`)
      .send({
        name: "Dr. João Atualizado",
        email: "joao@email.com",
        password: "novaSenha123",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Dr. João Atualizado");
  });

  it("Deve excluir um médico", async () => {
    const res = await request(app)
      .delete(`/doctors`)
      .set("x-auth-token", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Doutor excluído com sucesso");
  });

  it("Deve retornar erro ao excluir um médico inexistente", async () => {
    const res = await request(app)
      .delete(`/doctors`)
      .set("x-auth-token", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("Doutor não encontrado");
  });
});
