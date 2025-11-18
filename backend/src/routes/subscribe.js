const express = require("express");
const router = express.Router();
const db = require("../db");

function isValidEmail(email) {
  console.log("[isValidEmail] Validando email:", email);
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}
router.post("/subscribe", (req, res) => {
  console.log("[/subscribe] Requisição recebida:", req.body);
  const email = (req.body.email || "").trim().toLowerCase();
  console.log("[/subscribe] Email normalizado:", email);

  if (!isValidEmail(email)) {
    console.log("[/subscribe] Email inválido:", email);
    return res.status(400).json({ success: false, message: "Email inválido" });
  }
  console.log("[/subscribe] Verificando se o email já existe...");
  db.get("SELECT email FROM subscribers WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error("[/subscribe] Erro SELECT:", err);
      return res.status(500).json({ message: "Erro interno ao validar email" });
    }
    if (row) {
      console.log("[/subscribe] Email já cadastrado:", email);
      return res.status(409).json({ message: "Email já cadastrado" });
    }
    console.log("[/subscribe] Inserindo email no banco:", email);
    db.run("INSERT INTO subscribers (email) VALUES (?)", [email], (err) => {
      if (err) {
        console.error("[/subscribe] Erro INSERT:", err);
        return res.status(500).json({ message: "Erro ao salvar email" });
      }
      console.log("[/subscribe] Email cadastrado com sucesso:", email);
      res.status(201).json({ success: true, message: "Inscrição realizada com sucesso!", email });
    });
  });
});
router.post("/unsubscribe", (req, res) => {
  console.log("[/unsubscribe] Requisição recebida:", req.body);
  const email = (req.body.email || "").trim().toLowerCase();
  console.log("[/unsubscribe] Email normalizado:", email);

  if (!isValidEmail(email)) {
    console.log("[/unsubscribe] Email inválido:", email);
    return res.status(400).json({ success: false, message: "Email inválido" });
  }
  console.log("[/unsubscribe] Tentando excluir email:", email);
  db.run("DELETE FROM subscribers WHERE email = ?", [email], function (err) {
    if (err) {
      console.error("[/unsubscribe] Erro DELETE:", err);
      return res.status(500).json({ success: false, message: "Erro ao excluir email" });
    }
    console.log("[/unsubscribe] Linhas afetadas:", this.changes);
    if (this.changes === 0) {
      console.log("[/unsubscribe] Email não encontrado:", email);
      return res.status(404).json({ success: false, message: "Email não encontrado" });
    }
    console.log("[/unsubscribe] Email removido com sucesso:", email);
    res.json({ success: true, message: "Desinscrito com sucesso", email });
  });
});
router.get("/subscribers", (req, res) => {
  console.log("[/subscribers] Buscando lista de inscritos...");
  db.all(
    "SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        console.error("[/subscribers] Erro LIST:", err);
        return res.status(500).json({ success: false, message: "Erro ao buscar inscritos" });
      }

      console.log("[/subscribers] Lista carregada. Total:", rows.length);
      res.json({ success: true, subscribers: rows });
    }
  );
});

module.exports = router;
