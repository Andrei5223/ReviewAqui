import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Cadastro from "./Cadastro";
import Login from "./Login";
import Inicial from "./Inicial";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="App">
      <Router>

        <Box>
          {
            isLoggedIn ? (
            <Routes>
              
              <Route path="/Cadastro" element={<Cadastro></Cadastro>}></Route>
              <Route path="/Login" element={<Login></Login>}></Route>
              <Route path="/" element={<Inicial></Inicial>}></Route>
          
            </Routes>
            ):(
              console.log("A")
            )
          }
        </Box>
      </Router>
    </div>
  );
}

export default App;
