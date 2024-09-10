const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
app.use(express.static('public'));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Hello world");
  });