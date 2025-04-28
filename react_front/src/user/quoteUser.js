import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import CancelButtonQuote from "../components/cancelButtonQuote/CancelButtonQuote";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    useMediaQuery,
    useTheme,
} from "@mui/material";

const CompShowCitasUsuario = () => {
    const [citas, setCitas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);
    const id_userFK = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const fetchCitas = async (page = 1) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/Tenant/quotes/all/${id_userFK}?page=${page}&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCitas(response.data.data);
            console.log(response.data.data)
            setTotalPaginas(response.data.totalPaginas);
            setPaginaActual(response.data.pagina);
        } catch (error) {
            console.error("Error al obtener las citas:", error);
        }
    };

    useEffect(() => {
        if (id_userFK && token) {
            fetchCitas(paginaActual);
        }
    }, [id_userFK, token, paginaActual]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    const handleAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const handleSiguiente = () => {
        if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
            <Box
                sx={{
                    flexGrow: 1,
                    ml: sidebarAbierto
                        ? isMobile
                            ? "200px"  // separación mínima en móvil
                            : "250px"  // separación mayor en PC
                        : "0px",
                    transition: "margin-left 0.3s",
                    p: 1,
                }}
            >
                <Card elevation={3} sx={{ p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                            Mis Citas
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell><strong>Fecha y Hora</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {citas.length > 0 ? (
                                        citas.map((cita) => (
                                            <TableRow key={cita.id_quotePK}>
                                                <TableCell>{formatDate(cita.dateAndTimeQuote)}</TableCell>
                                                <TableCell>{cita.status}</TableCell>
                                                <TableCell>
                                                    {cita.status === "activa" && (
                                                        <CancelButtonQuote
                                                            idQuote={cita.id_quotePK}
                                                            onCancelSuccess={() => fetchCitas(paginaActual)}
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3}>No hay citas registradas.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleAnterior}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </Button>
                            <Typography sx={{ alignSelf: "center" }}>
                                Página {paginaActual} de {totalPaginas}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleSiguiente}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );

    // return (
    //     <div style={{ display: "flex" }}>
    //         <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />

    //         <div
    //             style={{
    //                 marginLeft: sidebarAbierto ? "200px" : "-5px",
    //                 transition: "margin-left 0.3s",
    //                 padding: "20px",
    //                 width: "100%",
    //             }}
    //         >
    //             <h2>Mis Citas</h2>
    //             <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
    //                 <thead>
    //                     <tr>

    //                         <th>Fecha y Hora</th>
    //                         <th>Estado</th>
    //                         <th>Acciones</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {citas.length > 0 ? (
    //                         citas.map((cita) => (
    //                             <tr key={cita.id_quotePK}>
    //                                 <td>{formatDate(cita.dateAndTimeQuote)}</td>
    //                                 <td>{cita.status}</td>
    //                                 <td>
    //                                     {cita.status === "activa" && (
    //                                         <CancelButtonQuote
    //                                             idQuote={cita.id_quotePK}
    //                                             onCancelSuccess={() => fetchCitas(paginaActual)}
    //                                         />
    //                                     )}
    //                                 </td>
    //                             </tr>
    //                         ))
    //                     ) : (
    //                         <tr>
    //                             <td colSpan="2">No hay citas registradas.</td>
    //                         </tr>
    //                     )}
    //                 </tbody>
    //             </table>

    //             {/* Controles de paginación */}
    //             <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
    //                 <button onClick={handleAnterior} disabled={paginaActual === 1}>
    //                     Anterior
    //                 </button>
    //                 <span>Página {paginaActual} de {totalPaginas}</span>
    //                 <button onClick={handleSiguiente} disabled={paginaActual === totalPaginas}>
    //                     Siguiente
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default CompShowCitasUsuario;
