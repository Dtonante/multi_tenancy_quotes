import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, useMediaQuery, ListItemButton, Box } from "@mui/material";
import { FaHome, FaUser, FaCalendarAlt, FaSignOutAlt, FaClipboard, FaClock } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Obtener y decodificar el token cuando el componente se monta
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decodifica el token
                setRole(decodedToken.role_id); // Asume que el token tiene el campo `role_id`
            } catch (err) {
                console.error("Error al decodificar el token:", err);
            }
        }
    }, []);

    const allNavItems = [
        { to: "/homeClients", label: "Inicio", icon: <FaHome /> },
        { to: "/quoteUser", label: "Mis Citas", icon: <FaClipboard /> },
        { to: "/listUsers", label: "Usuarios", icon: <FaUser /> },
        { to: "/scheduleConfig", label: "Cronograma personal", icon: <FaClock /> },
        { to: "/listQuotes", label: "Citas", icon: <FaCalendarAlt /> },
        { to: "/createQuote", label: "Agendar Cita", icon: <FaClipboard /> },
        {
            to: "/",
            label: "Cerrar sesión",
            icon: <FaSignOutAlt />,
            action: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("name_user");
                localStorage.removeItem("rol");
                navigate("/");
            }
        }
    ];

    const [filteredNavItems, setFilteredNavItems] = useState([]);

    // Filtra los elementos de navegación según el rol
    useEffect(() => {
        if (role == "1") {
            setFilteredNavItems(
                allNavItems.filter(
                    (item) => item.label !== "Agendar Cita" && item.label !== "Mis Citas"
                )
            );
        } else if (role == "2") {
            setFilteredNavItems(
                allNavItems.filter(
                    (item) => item.label !== "Usuarios" && item.label !== "Citas" && item.label !== "Cronograma personal"
                )
            );
        } else {
            setFilteredNavItems(allNavItems); // Mostrar todos por defecto
        }
    }, [role]);


    return (
        <>
            {/* Botón hamburguesa visible solo en mobile */}
            {!isOpen && (
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "fixed",
                        top: 16,
                        left: 16,
                        zIndex: 1300,
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        color: "#333"
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            <Drawer
                variant={isMobile ? "temporary" : "persistent"}
                anchor="left"
                open={isOpen}
                onClose={toggleSidebar}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 240,
                        bgcolor: "#f9f9f9",
                        color: "#333",
                        borderRight: "1px solid #ddd"
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1
                    }}
                >
                    <IconButton onClick={toggleSidebar} sx={{ color: "#333" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List>
                    {filteredNavItems.map(({ to, label, icon, action }) => {
                        const isActive = location.pathname === to;
                        const content = (
                            <ListItem
                                disablePadding
                                sx={{
                                    mx: 1,
                                    mb: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: isActive ? "#e0e0ff" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0"
                                    }
                                }}
                            >
                                <ListItemButton
                                    component={Link}
                                    to={to}
                                    onClick={action}
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ListItemIcon sx={{ color: "#555", minWidth: 40 }}>{icon}</ListItemIcon>
                                    <ListItemText primary={label} sx={{ color: "#333" }} />
                                </ListItemButton>
                            </ListItem>
                        );


                        return isMobile ? (
                            <Tooltip key={label} title={label} placement="right">
                                {content}
                            </Tooltip>
                        ) : (
                            <Box key={label}>{content}</Box>
                        );
                    })}
                </List>
            </Drawer>

        </>
    );
};

export default Sidebar;
