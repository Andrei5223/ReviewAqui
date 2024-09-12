const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const pgp = require("pg-promise")({});  
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors())

const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/reviewaki`);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/cadastro", async (req, res) => {
  try {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    console.log(nome);

    db.none(
      "INSERT INTO pessoa (nome, email, senha) VALUES ($1, $2, $3);",
      [nome, email, senha]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});