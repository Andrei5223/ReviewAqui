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
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:3010/";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");

    // Variáveis para a SnackBar
    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    function clearForm() {
        setEmail("");
        setSenha("");
    }

    

    //   function handleCancelClick() {
    //     if (email !== "") {
    //         setMessageText("Login cancelado!");
    //         setMessageSeverity("warning");
    //         setOpenMessage(true);
    //     }
    //     clearForm();
    // }

    function toggleRegister(){
        navigate("/Cadastro");
    }

    async function handleSubmit() {

        if (email !== "" && senha !== "") {
            try {

                await axios.post("/login", {
                    email: email,
                    senha: senha,
                });
                
                setMessageText("Login com sucesso!");
                setMessageSeverity("success");
                navigate("/");
            } catch (error) {
                console.log(error);
                setMessageText("Falha no Login!");
                setMessageSeverity("error");
                setSenha("");
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
                        backgroundColor: 'white',
                        minWidth: 250,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                        padding: 2,
                    }}
                >
                    <Typography variant="h5" component="h1" gutterBottom>
                        Não possui cadastro?
                    </Typography>

                    <Button
                        variant='contained'
                        sx={{ backgroundColor: '#68fcad', color: 'black' }}
                        onClick={toggleRegister}
                    >
                        Cadastrar
                    </Button>
                </Card>

                <Card component="section" sx={{
                    p: 2, backgroundColor: '#68fcad',
                    border: '1px grey', maxWidth: 800, minWidth: 450,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center', height: '50vh',
                    padding: 2
                }}>
                    <CardContent>

                        <Stack spacing={3} direction="column">
                            <Typography variant="h4" component="h2" fontFamily={'Arial, Helvetica, sans-serif'}>
                                Faça o seu login
                            </Typography>
                            <TextField sx={{ backgroundColor: 'white', borderTopRightRadius: '3px', borderTopLeftRadius: '3px' }}
                                id="filled-basic"
                                label="E-Mail"
                                required
                                variant="filled"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField sx={{ backgroundColor: 'white', borderTopRightRadius: '3px', borderTopLeftRadius: '3px'  }}
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
                                    sx={{
                                        mt: 2,
                                        backgroundColor: 'white',
                                        color: 'black',
                                        maxWidth: '100px'
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Entrar
                                </Button>
                                {/* <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2, 
                      maxWidth: '100px'
                    }} 
                onClick={handleCancelClick}
              >
                  Cancelar
              </Button> */}
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
