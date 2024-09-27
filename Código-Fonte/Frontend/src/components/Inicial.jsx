import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Snackbar } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cadastro from "./Cadastro";
import Login from "./Login";

export default function Inicial({ isLoggedIn, userName }) {
  const navigate = useNavigate();
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);

  const handleOpenCadastro = () => setOpenCadastro(true);
  const handleCloseCadastro = () => setOpenCadastro(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedInState(false); // Atualiza o estado do login
    navigate("/");
    window.location.reload();
  };

  const SessionExpired = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedInState(false); // Atualiza o estado do login
    navigate("/");
   
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSessionExpired = () => {
    SessionExpired();
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Verifica se o token está expirado
        if (decodedToken.exp < currentTime) {
          handleSessionExpired();
        } else {
          // Token válido, manter o usuário logado
          setIsLoggedInState(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        handleSessionExpired(); // Remove token inválido
      }
    }
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo à Página Inicial{userName ? `, ${userName}` : ""}!
      </Typography>

      {isLoggedInState ? (
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "red", color: "white" }}
          onClick={handleLogout}
          
        >
          Logout
        </Button>
      ) : (
        <Button variant="outlined" onClick={handleOpenLogin}>
          Fazer Login
        </Button>
      )}

      <Cadastro
        handleCloseCadastro={handleCloseCadastro}
        openCadastro={openCadastro}
        handleOpenLogin={handleOpenLogin}
      />

      <Login
        handleCloseLogin={handleCloseLogin}
        openLogin={openLogin}
        handleOpenCadastro={handleOpenCadastro}
      />

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Sessão expirada. Faça login novamente."
        action={
          <Button
            color="inherit"
            onClick={() => {
              handleCloseLogin();
              handleOpenLogin();
              handleSnackbarClose();
            }}
          >
            Continuar
          </Button>
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centraliza horizontalmente
        sx={{
          // Adiciona margem para centralizar verticalmente
          "& .MuiSnackbarContent-root": {
            display: "flex",
            justifyContent: "center",
          },
        }}
      />
    </Box>
  );
}
