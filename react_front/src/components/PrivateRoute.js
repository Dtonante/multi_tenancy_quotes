// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now(); // Si aún no expiró
  } catch (error) {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token"); // Limpia token si no es válido
    alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
