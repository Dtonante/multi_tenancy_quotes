import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material"

const URI_LOGIN = "http://localhost:3000/api/v1/Tenant/users/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para mostrar carga
  const navigate = useNavigate();
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Limpiar el token cuando el usuario entra al login
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(URI_LOGIN, { email, password });

      if (response.data?.token) {
        const rol = response.data.user.id_roleFK;
      
        localStorage.setItem("token", response.data.token); // Guardar token
        localStorage.setItem("rol", rol); // Guardar el id_rolFK
        localStorage.setItem("user", response.data.user.id_userPK); // Guardar el id_userPK
        localStorage.setItem("name_user", response.data.user.name); // Guardar el name_user
        
      
        // Redirección según el rol
        if (rol == 1) {
          navigate("/homeClients");
        } else if (rol == 2) {
          navigate("/homeClients");
        } else {
          setError("Rol no reconocido.");
        }
      }


    } catch (err) {
      console.error("Error al iniciar sesión:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#2c2c2c",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: isMobile ? 400 : 900,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Lado del formulario */}
        <CardContent
          sx={{
            flex: 1,
            padding: isMobile ? 3 : 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: isMobile ? "100%" : "60%",
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
            Iniciar sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar sesión"}
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => navigate("/createUser")}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Crear Usuario
            </Button>
          </Box>
        </CardContent>

        {/* Lado de la imagen */}
        <CardMedia
          component="img"
          image="/fondo_barber.jpg"
          alt="Barbería fondo"
          sx={{
            flex: 1,
            objectFit: "cover",
            minHeight: isMobile ? 200 : 500,
            order: isMobile ? -1 : 1,
            width: isMobile ? "100%" : 450,
          }}
        />
      </Card>
    </Box>
  )

  // return (
  //   <div className="login-background">
  //     <div className="login-card">
  //       <div className="login-avatar">

  //       </div>


  //       <h2 className="login-title">Iniciar sesión</h2>

  //       {error && <div className="login-error">{error}</div>}

  //       <form onSubmit={handleLogin}>
  //         <input
  //           className="login-input"
  //           type="email"
  //           placeholder="Correo electrónico"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //         />
  //         <input
  //           className="login-input"
  //           type="password"
  //           placeholder="Contraseña"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           required
  //         />

  //         {/* Botón para iniciar sesion */}
  //         <button
  //           className="login-button"
  //           type="submit"
  //           disabled={loading}
  //         >
  //           {loading ? "Cargando..." : "Iniciar sesión"}
  //         </button>

  //        {/* Botón para crear usuario */}
  //         <button
  //           className="login-button"
  //           type="button"
  //           onClick={() => navigate("/createUser")}
  //           disabled={loading}
  //         >
  //           Crear Usuario
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );


};

export default Login;
