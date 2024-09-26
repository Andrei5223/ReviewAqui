import { Box, Button } from "@mui/material";
import { useState } from "react";
import Cadastro from "./Cadastro";
import Login from "./Login";

export default function Inicial(){
    const [openCadastro, setOpenCadastro] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    const handleOpenCadastro = () => setOpenCadastro(true);
    const handleCloseCadastro = () => setOpenCadastro(false);
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    return (
        <Box>
            <Button variant="outlined" onClick={handleOpenLogin}>
                Fazer Login
            </Button>

            <Cadastro
                handleCloseCadastro = {handleCloseCadastro}
                openCadastro = {openCadastro}
            />

            <Login
                handleCloseLogin = {handleCloseCadastro}
                openLogin = {openLogin}
                handleOpenCadastro = {handleOpenCadastro}
            />

        </Box>
    )
}