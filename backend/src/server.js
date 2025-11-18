require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 MindTech IoT API rodando na porta ${PORT}`);
  console.log(`→ POST http://localhost:${PORT}/api/mindtechiot/subscribe`);
});
