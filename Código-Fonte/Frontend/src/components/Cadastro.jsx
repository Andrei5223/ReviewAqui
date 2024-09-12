import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3010/";

export default function Cadastro() {

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  function clearForm() {
    setNome("");
    setEmail("");
    setSenha("");
  }

  async function handleSubmit() {

    if (nome !== "" && email !== "" && senha !== "") {
      try {
          await axios.post("/cadastro", {
              nome: nome,
              email: email,
              senha: senha,
          });
          console.log(`Nome: ${nome} - Email: ${email}`);
          clearForm(); // limpa o formulário apenas se cadastrado com sucesso
      } catch (error) {
          console.log(error);
      }
    }
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
              />
            <TextField 
              id="filled-basic" 
              label="E-Mail" 
              required 
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField 
              id="filled-basic" 
              label="Senha" 
              type='password'
              required
              variant="filled"
              onChange={(e) => setSenha(e.target.value)}
              value={senha}
            />
          <Button variant="contained" sx={{ mt: 2, backgroundColor: '#68fcad', color: 'black', maxWidth: '100px'}} onClick={handleSubmit}>Cadastrar</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
    </Box>
  );
}
