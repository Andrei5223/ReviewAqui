import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Snackbar, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cadastro from "./Cadastro";
import Login from "./Login";
import Product from "./Product";


export default function Inicial({ isLoggedIn, userName }) {
  const navigate = useNavigate();
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);
  const [Produtos, setProdutos] = useState([]);

  const handleOpenCadastro = () => setOpenCadastro(true);
  const handleCloseCadastro = () => setOpenCadastro(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Função para mostrar o componente Product ao clicar em "Ver produto"
  const handleViewProduct = (produto) => {
    setSelectedProduct(produto);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedInState(false);
    navigate("/");
    window.location.reload();
  };

  const SessionExpired = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedInState(false);
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

        if (decodedToken.exp < currentTime) {
          handleSessionExpired();
        } else {
          setIsLoggedInState(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        handleSessionExpired();
      }
    }
  }, []);



  const fetchProdutosList = async () => {
    try {
      const response = await axios.get("http://localhost:3010/produto");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar a lista de produtos", error);
    }
  };

  useEffect(() => {
    fetchProdutosList();
  }, []);

  return (
    <div>
      <header>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <img src={'/img/logo.png'} style={{ maxWidth: 70, maxHeight: 70, position: "absolute" }}/>
          <Typography variant="h4" style={{ color: "white", marginRight: "20px", marginLeft: "80px" }}>
            ReviewAki!
          </Typography>

          {isLoggedInState ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "red", padding: 2 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button variant="contained" onClick={handleOpenLogin} sx={{ backgroundColor: 'hsl(162, 98%, 36%)', padding: 2 }}>
              Fazer Login
            </Button>
          )}
        </Box>

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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            "& .MuiSnackbarContent-root": {
              display: "flex",
              justifyContent: "center",
            },
          }}
        />
      </header>
      <body>
      {selectedProduct ? (
        // Renderiza o componente Product com o produto selecionado como parâmetro
        <Product nome={selectedProduct.nome} handleViewProduct={handleViewProduct} />
      ) : (
        <Grid style={{ marginTop: "20px" }} container spacing={5}>
          {Produtos.map((produto) => (
            <Grid item key={produto.idp} xs={12} sm={6} md={3}>
              <Card style={{ margin: "10px" }}>
                <CardMedia
                  component="img"
                  alt={produto.nome}
                  height="250"
                  image={produto.link}
                />
                <CardContent>
                  <Typography variant="h6">{produto.nome}</Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'hsl(162, 98%, 36%)',
                    }}
                    onClick={() => handleViewProduct(produto)}
                  >
                    Ver produto
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </body>
    </div>
  );
}
