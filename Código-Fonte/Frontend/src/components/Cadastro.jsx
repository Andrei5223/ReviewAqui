import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3010/";

export default function Cadastro() {

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  // Variáveis para a SnackBar
  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");

  function clearForm() {
    setNome("");
    setEmail("");
    setSenha("");
  }

  function handleCancelClick() {
    if (nome !== "" || email !== "") {
        setMessageText("Cadastro cancelado!");
        setMessageSeverity("warning");
        setOpenMessage(true);
    }
    clearForm();
}

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
  async function handleSubmit() {

    if (nome !== "" && email !== "" && senha !== "") {
      try {

        if (nome.length < 3 ) {
          setMessageText("Minímo de 3 caracteres para nome.");
          setMessageSeverity("warning");
          setOpenMessage(true);
          return;
        }
        if (senha.length < 8) {
          setMessageText("Minímo de 8 caracteres para senha.");
          setMessageSeverity("warning");
          setOpenMessage(true);
          return;
        }

        if (!isEmailValid(email)) {
          setMessageText("E-mail Inválido!");
          setMessageSeverity("error");
          setOpenMessage(true);
          return;
        }
          await axios.post("/cadastro", {
              nome: nome,
              email: email,
              senha: senha,
          });
          console.log(`Nome: ${nome} - Email: ${email}`);
          setMessageText("Cadastrado com sucesso!");
          setMessageSeverity("success");
          clearForm(); // limpa o formulário apenas se cadastrado com sucesso
      } catch (error) {
          console.log(error);
          setMessageText("Falha no cadastro!");
          setMessageSeverity("error");
      } finally {
        setOpenMessage(true);
      }
    } else {
      setMessageText("Dados inválidos!");
      setMessageSeverity("warning");
      setOpenMessage(true);
    }
  }

  //Snackbar
  function handleCloseMessage(_, reason) {
    if (reason === "clickaway") {
        return;
    }
    setOpenMessage(false);
}

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Para centralizar verticalmente, você pode usar a altura da viewport
      }}
    >
      <Stack direction="row">
      <Card
      sx={{
        backgroundColor: '#68fcad',
        minWidth: 250,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        padding: 2 
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Já tem uma conta?
      </Typography>

      <Button
        variant='contained'
        sx={{ backgroundColor: 'white', color: 'black' }}
      >
        Entrar
      </Button>
    </Card>

      <Card component="section" sx={{ p: 2, border: '1px grey', maxWidth: 800, minWidth: 450}}>
        <CardContent>

          <Stack spacing={3} direction="column">
            <Typography variant="h4" component="h2" fontFamily={'Arial, Helvetica, sans-serif'}>
                Crie Sua Conta
            </Typography>
            <TextField 
              id="filled-basic" 
              label="Nome" 
              required
              variant="filled"
              onChange={(e) => setNome(e.target.value)}
              value={nome}
              inputProps={{ maxLength: 50 }}
              />
            <TextField 
              id="filled-basic" 
              label="E-Mail" 
              required 
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              inputProps={{ maxLength: 50 }}
            />
            <TextField 
              id="filled-basic" 
              label="Senha" 
              type='password'
              required
              variant="filled"
              onChange={(e) => setSenha(e.target.value)}
              value={senha}
              inputProps={{ maxLength: 30 }}
            />
            
            <Stack direction="row" spacing={3}>
              <Button
                variant="contained"
                sx={{ mt: 2, 
                      backgroundColor: '#68fcad', 
                      color: 'black', 
                      maxWidth: '100px'
                    }} 
                onClick={handleSubmit}
              >
                  Cadastrar
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2, 
                      maxWidth: '100px'
                    }} 
                onClick={handleCancelClick}
              >
                  Cancelar
              </Button>
            </Stack>

          </Stack>
        </CardContent>
      </Card>
    </Stack>

    <Snackbar
      open={openMessage}
      autoHideDuration={6000}
      onClose={handleCloseMessage}
    >
      <Alert
        severity={messageSeverity}
        onClose={handleCloseMessage}
      >
        {messageText}
      </Alert>
    </Snackbar>

    </Box>
  );
}
