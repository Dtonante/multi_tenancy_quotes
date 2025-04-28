// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import "../css/sidebar/SidebarCss.css";
// import { FaHome, FaUser, FaCalendarAlt, FaSignOutAlt, FaClipboard, FaClock  } from "react-icons/fa";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const role = localStorage.getItem("rol");

//     // Todos los ítems posibles
//     const allNavItems = [
//         { to: "/homeClients", label: "Inicio", icon: <FaHome /> },
//         { to: "/quoteUser", label: "Mis Citas", icon: <FaClipboard /> },
//         { to: "/listUsers", label: "Usuarios", icon: <FaUser /> },
//         { to: "/scheduleConfig", label: "Cronograma personal", icon: <FaClock /> },
//         { to: "/listQuotes", label: "Citas", icon: <FaCalendarAlt /> },
//         { to: "/createQuote", label: "Agendar Cita", icon: <FaClipboard /> },
//         {
//             to: "/",
//             label: "Cerrar sesión",
//             icon: <FaSignOutAlt />,
//             action: () => {
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user");
//                 localStorage.removeItem("name_user");
//                 localStorage.removeItem("rol");
//                 navigate("/");
//             },
//         },
//     ];

//     let filteredNavItems = [];

//     if (role === "1") {
//         filteredNavItems = allNavItems.filter(item => item.label !== "Agendar Cita" && item.label !== "Mis Citas");
//     } else if (role === "2") {
//         filteredNavItems = allNavItems.filter(item => item.label !== "Usuarios" && item.label !== "Citas");
//     } else {
//         filteredNavItems = []; // mostrar todos por defecto
//     }


//     return (
//         <>
//             {/* Solo mostrar el botón fuera cuando el sidebar está cerrado */}
//             {!isOpen && (
//                 <button className="toggle-btn" onClick={toggleSidebar}>
//                     ☰
//                 </button>
//             )}

//             <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
//                 {/* Mostrar la X dentro del sidebar cuando está abierto */}
//                 {isOpen && (
//                     <button className="toggle-btn close-btn" onClick={toggleSidebar}>
//                         ❌
//                     </button>

//                 )}
//                 <nav className="nav-links"><br/><br/>
//                     {filteredNavItems.map(({ to, label, icon, action }) => (
//                         <Link
//                             key={label}
//                             to={to}
//                             className={`nav-item ${location.pathname === to ? "active" : ""}`}
//                             onClick={action}
//                             title={!isOpen ? label : undefined}
//                         >
//                             <span className="icon">{icon}</span>
//                             {isOpen && <span className="label">{label}</span>}
//                         </Link>
//                     ))}
//                 </nav>
//             </div>
//         </>
//     );


// };

// export default Sidebar;




import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useMediaQuery,
    Box
} from "@mui/material";
import {
    FaHome,
    FaUser,
    FaCalendarAlt,
    FaSignOutAlt,
    FaClipboard,
    FaClock
} from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = localStorage.getItem("rol");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

    let filteredNavItems = [];

    if (role === "1") {
        filteredNavItems = allNavItems.filter(
            (item) => item.label !== "Agendar Cita" && item.label !== "Mis Citas"
        );
    } else if (role === "2") {
        filteredNavItems = allNavItems.filter(
            (item) => item.label !== "Usuarios" && item.label !== "Citas" && item.label !== "Cronograma personal"
        );
    } else {
        filteredNavItems = []; // Mostrar todos por defecto
    }

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
                                button
                                component={Link}
                                to={to}
                                onClick={action}
                                sx={{
                                    backgroundColor: isActive ? "#e0e0ff" : "transparent",
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0"
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: "#555", minWidth: 40 }}>{icon}</ListItemIcon>
                                <ListItemText primary={label} sx={{ color: "#333" }} />
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
