import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Cadastro from "./Cadastro";
import Login from "./Login";
import Inicial from "./Inicial";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Router>

        <Box>
          {
  
            <Routes>
              
              <Route path="/cadastro" element={<Cadastro></Cadastro>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/" element={<Inicial></Inicial>}></Route>
          
            </Routes>

          }
        </Box>
      </Router>
    </div>
  );
}

export default App;
