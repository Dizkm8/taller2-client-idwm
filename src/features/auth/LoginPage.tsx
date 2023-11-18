import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const stringEmpty: string = "";
const usernameRegex: RegExp = /^[a-zA-Z0-9]{3,30}$/;
const pwdRegex: RegExp = /^[a-zA-Z0-9]{8,16}$/;

const usernameErrorMsg: string =
  "El nombre de usuario debe tener al menos 3 caracteres y máximo 30";
const pwdErrorMsg: string =
  "La contraseña debe tener al menos 8 caracteres y máximo 16";

const LoginPage = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if(token){
      setAuthenticated(true);
      navigate("/");
    }
  }, [navigate, setAuthenticated]);

  const [username, setUsername] = useState<string>(stringEmpty);
  const [pwd, setPwd] = useState<string>(stringEmpty);

  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [pwdError, setPwdError] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(true);

  // useState para manejar la animación de cargando del formulario
  const [loading, setLoading] = useState<boolean>(false);

  // useState para manejar mensaje de error cuando las credenciales sean inválidas
  const [credentialsError, setCredentialsError] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username: string = data.get("username")?.toString() ?? stringEmpty;
    const password: string = data.get("password")?.toString() ?? stringEmpty;
    sendData(username, password);
  };

  const sendData = (username: string, password: string) => {
    setLoading(true);
    agent.Auth.login({ username, password })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setAuthenticated(true);
        navigate("/");
      })
      .catch((err) => {
        setCredentialsError(true);
      })
      .finally(() => {
        setLoading(false);
        setUsername(stringEmpty);
        setPwd(stringEmpty);
      });
  };

  

  useEffect(() => {
    const hasUsernameError = usernameError || username === stringEmpty;
    const hasPwdError = pwdError || pwd === stringEmpty;

    setDisabled(hasPwdError || hasUsernameError);
  }, [pwd, pwdError, username, usernameError]);

  const handleFieldChange = (event: any) => {
    const { name, value } = event.target;
    setCredentialsError(false);
    if (name === "username") {
      setUsername(value);
      const isValid = usernameRegex.test(value);
      setUsernameError(!isValid);
    } else if (name === "password") {
      setPwd(value);
      const isValid = pwdRegex.test(value);
      setPwdError(!isValid);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Iniciar Sesión
        </Typography>
      </Box>
      <Box component="form" sx={{ mt: 1 }} noValidate onSubmit={handleSubmit}>
        {credentialsError && (
          <Alert severity="error">¡Credenciales Inválidas!</Alert>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de usuario"
          name="username"
          value={username}
          onChange={handleFieldChange}
          error={usernameError}
          helperText={usernameError ? usernameErrorMsg : stringEmpty}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Contraseña"
          name="password"
          type="password"
          value={pwd}
          onChange={handleFieldChange}
          error={pwdError}
          helperText={pwdError ? pwdErrorMsg : stringEmpty}
        />
        <LoadingButton
          loading={loading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={disabled}
        >
          Iniciar sesión
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default LoginPage;
