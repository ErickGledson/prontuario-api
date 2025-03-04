const sequelize = require("./config/database");
const redis = require("./config/redis");
const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const waitForRedis = () => {
  return new Promise((resolve, reject) => {
    if (redis.status === "ready") {
      return resolve();
    }

    redis.once("ready", resolve);
    redis.once("error", reject);
  });
};

Promise.all([sequelize.sync(), waitForRedis()])
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Ocorreu um erro ao subir a aplicação:", err);
    process.exit(1);
  });
