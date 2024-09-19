const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const pgp = require("pg-promise")({});  
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors())

// Segurança para login
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

app.use(
	session({
		secret: 'Segredo_mt_secreto',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	}),
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

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const saltRounds = 10;

  // Valida entradas (Para caso de uso de proxy)
  if (!nome || !email || !senha) {
    console.log("Nome, email e senha são obrigatórios");
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }
  if (nome.length < 3 || nome.length >= 50 || senha.length < 8 || senha.length > 30){
    console.log("Tamanho inválido de senha ou nome");
    return res.status(400).json({ error: "Tamanho inválido de senha ou nome" });
  }
  if (!emailPattern.test(email)){
    console.log("Formato de email inválido");
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  // Criptografa a senha e insere no banco
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

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const user = await db.oneOrNone(
      "SELECT senha FROM pessoa WHERE email = $1",
      [email]
    );

    if (!user) {
      // Se o usuário não for encontrado
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    // Compara a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (isMatch) {
      // Se as senhas coincidirem, o usuário é autenticado com sucesso
      console.log("Usuário autenticado com sucesso");
      return res.status(200).json({ message: "Usuário autenticado com sucesso" });
    } else {
      // Se a senha estiver incorreta
      return res.status(400).json({ error: "Senha incorreta." });
    }

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Erro no servidor." });
  }
});
