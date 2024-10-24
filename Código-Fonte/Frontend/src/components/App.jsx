import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Cadastro from "./Cadastro";
import Login from "./Login";
import Inicial from "./Inicial";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Product from "./Product";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Função que verifica se o usuário já está logado
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(parsedUser.nome);
      // Atualiza o nome do usuário
    }
  };

  // useEffect para verificar o login ao carregar a página
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="App">
      <Router>
        <Box>
          <Routes>
            <Route
              path="/"
              element={<Inicial isLoggedIn={isLoggedIn} userName={userName} />}
            />
            <Route
              path="/teste"
              element={<Product isLoggedIn={isLoggedIn} userName={userName} />}
            />
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

export default App;
