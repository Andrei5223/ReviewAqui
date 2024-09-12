import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from "axios";

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
      <Card component="section" sx={{ p: 2, border: '1px grey', maxWidth: 800 }}>
        <CardContent>
        <Typography variant="h4" component="h2">
            Crie Sua Conta
        </Typography>

          <Stack spacing={2} direction="column">
            <TextField 
              id="filled-basic" 
              label="Nome" 
              variant="filled"
              onChange={(e) => setNome(e.target.value)}
              value={nome}
            />
            <TextField 
              id="filled-basic" 
              label="E-Mail" 
              variant="filled" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField 
              id="filled-basic" 
              label="Senha" 
              variant="filled"
              onChange={(e) => setSenha(e.target.value)}
              value={senha}
            />
          </Stack>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Cadastrar</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
