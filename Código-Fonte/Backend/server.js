const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const pgp = require("pg-promise")({});
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');
const { appendFile } = require('fs/promises');
const { join } = require('path');

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

// Configuração da sessão
app.use(
  session({
    secret: "Segredo_mt_secreto",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Mude para true em produção com HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

const requireJWTAuth = passport.authenticate("jwt", { session: false });

const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/reviewaki`);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Endpoint de teste
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Cadastro de usuário
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const saltRounds = 10;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }
  if (
    nome.length < 3 ||
    nome.length > 50 ||
    senha.length < 8 ||
    senha.length > 20
  ) {
    return res.status(400).json({ error: "Tamanho inválido de senha ou nome" });
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(senha, salt);
    await db.none(
      "INSERT INTO pessoa (nome, email, senha) VALUES ($1, $2, $3);",
      [nome, email, hash]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(400);
  }
});

// Login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const user = await db.oneOrNone(
      "SELECT nome, senha FROM pessoa WHERE email = $1",
      [email]
    );

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    // Compara a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (isMatch) {
      // Gera o token JWT
      const token = jwt.sign({ role: email }, "Segredo_mt_secreto", {
        expiresIn: "1h",
      });
      return res.status(200).json({
        message: "Usuário autenticado com sucesso",
        token,
        user: {
          email: email,
          nome: user.nome,
        },
      });
    } else {
      return res.status(400).json({ error: "Senha incorreta." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Erro no servidor." });
  }
});

// Get data
app.get("/data", async (req, res) => {
  try {
    const name = req.query.name;
    // console.log("Nome: " + name);

    // Busca o usuário pelo email
    const sources = await db.manyOrNone(
      "SELECT nome, link FROM fonte WHERE idp = (SELECT idp FROM produto WHERE nome = $1);",
      [name]
    );

    // console.log("Sources: " + sources);

    if (sources.length === 0) {
      return res.status(400).json({ error: "Produto não encontrado." });
    }

    let results = {};

    sources.forEach(function(source) {
      console.log(source.nome)
      let pythonProcess;
    
      if (source.nome === 'STEAM') {
        pythonProcess = spawnSync('python3', [
          '../Scripts/web_scrapping.py',
          'web_scrap_steam',
          source.link,
        ]);
      } else if (source.nome === 'AMAZON') {
        pythonProcess = spawnSync('python3', [
          '../Scripts/web_scrapping.py',
          'web_scrap_amazon',
          source.link,
        ]);
      }
    
      result = pythonProcess.stdout?.toString()?.trim();
      error = pythonProcess.stderr?.toString()?.trim();
    
      try {
        if (!error) {
          results[source.nome] = JSON.parse(result); 
        } else {
          console.log(error);
          return res.status(500).send(JSON.stringify({ status: 500, message: 'Server error' }));
        }
      } catch (error) {
          console.log(error);
          res.status(400).json({ error: "Erro no servidor." });
      }
    });
    
    // Envia os resultados acumulados após o loop
    res.send(results);

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Erro no servidor." });
  }
});

app.get("/produto", async (req, res) => {
  try {
    const produtos = await db.any(
      "SELECT p.idp AS id, p.nome, i.link FROM produto p JOIN imagem i ON p.idp = i.idp;"
    );

    console.log("Retornando todos os produtos.");
    res.json(produtos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});