import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import QuotesCalendar from "./QuotesCalendar.js";
import "../css/user/ShowUsersCss.css";
import CancelButtonQuote from "../components/cancelButtonQuote/CancelButtonQuote.js";
import {
    Box,
    Grid,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Pagination
} from "@mui/material";

const URI_QUOTES_UPCOMING_UPDATE = "http://localhost:3000/api/v1/Tenant/quotes/upcoming/update";

const CompShowQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtroCampo, setFiltroCampo] = useState("");
    const [filtroValor, setFiltroValor] = useState("");
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

    useEffect(() => {
        getQuotes();
    }, [pagina, filtroCampo]);

    const getQuotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no disponible");

            const api = axios.create({
                baseURL: URI_QUOTES_UPCOMING_UPDATE,
                headers: { Authorization: `Bearer ${token}` },
            });

            let url = `?page=${pagina}`;
            if (filtroCampo && filtroValor) {
                url += `&${filtroCampo}=${encodeURIComponent(filtroValor)}`;
            }

            const res = await api.get(url);
            if (res.data && Array.isArray(res.data.data)) {
                setQuotes(res.data.data);
                setTotalPaginas(res.data.totalPaginas);
            } else {
                throw new Error("Formato de respuesta incorrecto");
            }
        } catch (err) {
            console.error("Error al obtener citas:", err);
            setError("Error al cargar las citas");
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroCampo("");
        setFiltroValor("");
        setPagina(1);
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
            setPagina(nuevaPagina);
        }
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;


    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
            <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
            <Box
                sx={{
                    marginLeft: sidebarAbierto ? "200px" : "0px", // Ajuste dinámico del espacio
                    transition: "margin-left 0.3s", // Transición suave
                    width: "100%", // Asegura que ocupe el 100% del espacio restante
                    position: "relative", // Posicionamiento relativo para evitar solapamientos
                    zIndex: 1, // Asegura que el contenido esté sobre el sidebar
                    display: "flex",
                    justifyContent: "center", // Centra el contenedor
                    alignItems: "center", // Centra el contenedor verticalmente
                }}
            >
                {/* Contenedor tipo Card para "Citas Próximas", la tabla y el calendario */}
                <Box
                    sx={{
                        width: "100%", // Asegura que el contenedor ocupe todo el ancho disponible
                        maxWidth: "1500px", // Máximo ancho del contenedor
                        padding: 3, // Padding alrededor
                        backgroundColor: "#fff", // Fondo blanco
                        borderRadius: 2, // Bordes redondeados
                        boxShadow: 3, // Sombra para el efecto de card
                        display: "flex",
                        flexDirection: "column", // Acomoda los elementos en columna
                        gap: 3, // Espaciado entre los elementos
                    }}
                >
                    <Typography variant="h4" align="center">
                        Citas Próximas
                    </Typography>

                    {/* Filtros */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3,
                            alignItems: "center",
                        }}
                    >
                        <Select
                            value={filtroCampo}
                            onChange={(e) => setFiltroCampo(e.target.value)}
                            displayEmpty
                            sx={{ minWidth: 180 }}
                        >
                            <MenuItem value="">Selecciona un campo</MenuItem>
                            <MenuItem value="id_userFK">ID Usuario</MenuItem>
                            <MenuItem value="dateAndTimeQuote">Fecha</MenuItem>
                            <MenuItem value="name">Nombre</MenuItem>
                        </Select>

                        <TextField
                            placeholder="Valor a filtrar"
                            value={filtroValor}
                            onChange={(e) => setFiltroValor(e.target.value)}
                            disabled={!filtroCampo}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setPagina(1);
                                getQuotes();
                            }}
                            disabled={!filtroCampo || !filtroValor}
                        >
                            Filtrar
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={limpiarFiltros}
                            disabled={!filtroCampo && !filtroValor}
                        >
                            Limpiar
                        </Button>
                    </Box>

                    {/* Tabla de citas con scroll si es necesario */}
                    <Box sx={{ overflowX: "auto" }}>
                        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                        <TableCell sx={{ fontWeight: "bold" }}>Nombre del Usuario</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Fecha y Hora</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quotes.length > 0 ? (
                                        quotes.map((quote, index) => (
                                            <TableRow
                                                key={quote.id_quotePK}
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                                                    "&:hover": { backgroundColor: "#f0f0f0" },
                                                }}
                                            >
                                                <TableCell>{quote.tbl_user?.name || "Sin nombre"}</TableCell>
                                                <TableCell>
                                                    {new Date(quote.dateAndTimeQuote).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {quote.status === "activa" && (
                                                        <CancelButtonQuote
                                                            idQuote={quote.id_quotePK}
                                                            onCancelSuccess={() => getQuotes()}
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No hay citas registradas
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Paginación */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => cambiarPagina(pagina - 1)}
                            disabled={pagina === 1}
                            startIcon={<span>&larr;</span>}
                        >
                            Anterior
                        </Button>
                        <Typography sx={{ fontWeight: "bold" }}>
                            Página {pagina} de {totalPaginas}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => cambiarPagina(pagina + 1)}
                            disabled={pagina === totalPaginas}
                            endIcon={<span>&rarr;</span>}
                        >
                            Siguiente
                        </Button>
                    </Box>
                    {/* Calendario ajustable */}
                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                        <QuotesCalendar />
                    </Box>
                </Box>
            </Box>
        </Box>
    );


    // return (
    //     <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
    //         <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
    //         <Box
    //             sx={{
    //                 marginLeft: sidebarAbierto ? "200px" : "0px", // Ajuste dinámico del espacio
    //                 transition: "margin-left 0.3s", // Transición suave
    //                 width: "100%", // Asegura que ocupe el 100% del espacio restante
    //                 position: "relative", // Posicionamiento relativo para evitar solapamientos
    //                 zIndex: 1, // Asegura que el contenido esté sobre el sidebar
    //                 display: "flex",
    //                 justifyContent: "center", // Centra el contenedor
    //                 alignItems: "center", // Centra el contenedor verticalmente
    //             }}
    //         >
    //             {/* Contenedor tipo Card para "Citas Próximas", la tabla y el calendario */}
    //             <Box
    //                 sx={{
    //                     width: "80%", // Controla el tamaño del contenedor
    //                     maxWidth: "900px", // Máximo ancho del contenedor
    //                     padding: 3, // Padding alrededor
    //                     backgroundColor: "#fff", // Fondo blanco
    //                     borderRadius: 2, // Bordes redondeados
    //                     boxShadow: 3, // Sombra para el efecto de card
    //                     display: "flex",
    //                     flexDirection: "column", // Acomoda los elementos en columna
    //                     gap: 3, // Espaciado entre los elementos
    //                 }}
    //             >
    //                 <Typography variant="h4" align="center">
    //                     Citas Próximas
    //                 </Typography>

    //                 {/* Filtros */}
    //                 <Box
    //                     sx={{
    //                         display: "flex",
    //                         flexWrap: "wrap",
    //                         gap: 2,
    //                         mb: 3,
    //                         alignItems: "center",
    //                     }}
    //                 >
    //                     <Select
    //                         value={filtroCampo}
    //                         onChange={(e) => setFiltroCampo(e.target.value)}
    //                         displayEmpty
    //                         sx={{ minWidth: 180 }}
    //                     >
    //                         <MenuItem value="">Selecciona un campo</MenuItem>
    //                         <MenuItem value="id_userFK">ID Usuario</MenuItem>
    //                         <MenuItem value="dateAndTimeQuote">Fecha</MenuItem>
    //                         <MenuItem value="name">Nombre</MenuItem>
    //                     </Select>

    //                     <TextField
    //                         placeholder="Valor a filtrar"
    //                         value={filtroValor}
    //                         onChange={(e) => setFiltroValor(e.target.value)}
    //                         disabled={!filtroCampo}
    //                     />

    //                     <Button
    //                         variant="contained"
    //                         color="primary"
    //                         onClick={() => {
    //                             setPagina(1);
    //                             getQuotes();
    //                         }}
    //                         disabled={!filtroCampo || !filtroValor}
    //                     >
    //                         Filtrar
    //                     </Button>

    //                     <Button
    //                         variant="outlined"
    //                         onClick={limpiarFiltros}
    //                         disabled={!filtroCampo && !filtroValor}
    //                     >
    //                         Limpiar
    //                     </Button>
    //                 </Box>

    //                 {/* Tabla de citas */}
    //                 <TableContainer component={Paper} sx={{ mb: 3 }}>
    //                     <Table>
    //                         <TableHead>
    //                             <TableRow>
    //                                 <TableCell>Nombre del Usuario</TableCell>
    //                                 <TableCell>Fecha y Hora</TableCell>
    //                                 <TableCell>Acciones</TableCell>
    //                             </TableRow>
    //                         </TableHead>
    //                         <TableBody>
    //                             {quotes.length > 0 ? (
    //                                 quotes.map((quote) => (
    //                                     <TableRow key={quote.id_quotePK}>
    //                                         <TableCell>{quote.tbl_user?.name || "Sin nombre"}</TableCell>
    //                                         <TableCell>
    //                                             {new Date(quote.dateAndTimeQuote).toLocaleString()}
    //                                         </TableCell>
    //                                         <TableCell>
    //                                             {quote.status === "activa" && (
    //                                                 <CancelButtonQuote
    //                                                     idQuote={quote.id_quotePK}
    //                                                     onCancelSuccess={() => getQuotes()}
    //                                                 />
    //                                             )}
    //                                         </TableCell>
    //                                     </TableRow>
    //                                 ))
    //                             ) : (
    //                                 <TableRow>
    //                                     <TableCell colSpan={3} align="center">
    //                                         No hay citas registradas
    //                                     </TableCell>
    //                                 </TableRow>
    //                             )}
    //                         </TableBody>
    //                     </Table>
    //                 </TableContainer>

    //                 {/* Paginación */}
    //                 <Box
    //                     sx={{
    //                         display: "flex",
    //                         justifyContent: "center",
    //                         alignItems: "center",
    //                         gap: 2,
    //                         mb: 5,
    //                     }}
    //                 >
    //                     <Button
    //                         onClick={() => cambiarPagina(pagina - 1)}
    //                         disabled={pagina === 1}
    //                     >
    //                         Anterior
    //                     </Button>
    //                     <Typography>
    //                         Página {pagina} de {totalPaginas}
    //                     </Typography>
    //                     <Button
    //                         onClick={() => cambiarPagina(pagina + 1)}
    //                         disabled={pagina === totalPaginas}
    //                     >
    //                         Siguiente
    //                     </Button>
    //                 </Box>

    //                 {/* Calendario */}
    //                 <QuotesCalendar />
    //             </Box>
    //         </Box>
    //     </Box>
    // );






    // return (
    //     <Box sx={{ display: "flex" }}>
    //         <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
    //         <Box
    //             sx={{
    //                 marginLeft: sidebarAbierto ? "200px" : "0px",  // Ajuste dinámico del espacio
    //                 transition: "margin-left 0.3s",  // Transición suave
    //                 padding: 3,  // Padding interno para el contenido
    //                 width: "100%",  // Asegura que ocupe el 100% del espacio restante
    //                 position: "relative",  // Posicionamiento relativo para evitar solapamientos
    //                 zIndex: 1,  // Asegura que el contenido esté sobre el sidebar
    //             }}
    //         >
    //             <Typography variant="h4" gutterBottom>
    //                 Citas Próximas
    //             </Typography>

    //             {/* Filtros */}
    //             <Box
    //                 sx={{
    //                     display: "flex",
    //                     flexWrap: "wrap",
    //                     gap: 2,
    //                     mb: 3,
    //                     alignItems: "center",
    //                 }}
    //             >
    //                 <Select
    //                     value={filtroCampo}
    //                     onChange={(e) => setFiltroCampo(e.target.value)}
    //                     displayEmpty
    //                     sx={{ minWidth: 180 }}
    //                 >
    //                     <MenuItem value="">Selecciona un campo</MenuItem>
    //                     <MenuItem value="id_userFK">ID Usuario</MenuItem>
    //                     <MenuItem value="dateAndTimeQuote">Fecha</MenuItem>
    //                     <MenuItem value="name">Nombre</MenuItem>
    //                 </Select>

    //                 <TextField
    //                     placeholder="Valor a filtrar"
    //                     value={filtroValor}
    //                     onChange={(e) => setFiltroValor(e.target.value)}
    //                     disabled={!filtroCampo}
    //                 />

    //                 <Button
    //                     variant="contained"
    //                     color="primary"
    //                     onClick={() => {
    //                         setPagina(1);
    //                         getQuotes();
    //                     }}
    //                     disabled={!filtroCampo || !filtroValor}
    //                 >
    //                     Filtrar
    //                 </Button>

    //                 <Button
    //                     variant="outlined"
    //                     onClick={limpiarFiltros}
    //                     disabled={!filtroCampo && !filtroValor}
    //                 >
    //                     Limpiar
    //                 </Button>
    //             </Box>

    //             {/* Tabla de citas */}
    //             <TableContainer component={Paper} sx={{ mb: 3, padding: 2 }}>
    //                 <Table>
    //                     <TableHead>
    //                         <TableRow>
    //                             <TableCell>Nombre del Usuario</TableCell>
    //                             <TableCell>Fecha y Hora</TableCell>
    //                             <TableCell>Acciones</TableCell>
    //                         </TableRow>
    //                     </TableHead>
    //                     <TableBody>
    //                         {quotes.length > 0 ? (
    //                             quotes.map((quote) => (
    //                                 <TableRow key={quote.id_quotePK}>
    //                                     <TableCell>{quote.tbl_user?.name || "Sin nombre"}</TableCell>
    //                                     <TableCell>
    //                                         {new Date(quote.dateAndTimeQuote).toLocaleString()}
    //                                     </TableCell>
    //                                     <TableCell>
    //                                         {quote.status === "activa" && (
    //                                             <CancelButtonQuote
    //                                                 idQuote={quote.id_quotePK}
    //                                                 onCancelSuccess={() => getQuotes()}
    //                                             />
    //                                         )}
    //                                     </TableCell>
    //                                 </TableRow>
    //                             ))
    //                         ) : (
    //                             <TableRow>
    //                                 <TableCell colSpan={3} align="center">
    //                                     No hay citas registradas
    //                                 </TableCell>
    //                             </TableRow>
    //                         )}
    //                     </TableBody>
    //                 </Table>
    //             </TableContainer>

    //             {/* Paginación */}
    //             <Box
    //                 sx={{
    //                     display: "flex",
    //                     justifyContent: "center",
    //                     alignItems: "center",
    //                     gap: 2,
    //                     mb: 5,
    //                 }}
    //             >
    //                 <Button
    //                     onClick={() => cambiarPagina(pagina - 1)}
    //                     disabled={pagina === 1}
    //                 >
    //                     Anterior
    //                 </Button>
    //                 <Typography>
    //                     Página {pagina} de {totalPaginas}
    //                 </Typography>
    //                 <Button
    //                     onClick={() => cambiarPagina(pagina + 1)}
    //                     disabled={pagina === totalPaginas}
    //                 >
    //                     Siguiente
    //                 </Button>
    //             </Box>

    //             {/* Calendario */}
    //             <QuotesCalendar />
    //         </Box>
    //     </Box>
    // );


    // return (
    //     <div style={{ display: "flex" }} className="je">
    //         <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
    //         <div style={{
    //             marginLeft: sidebarAbierto ? "200px" : "0px",
    //             transition: "margin-left 0.3s",
    //             padding: "20px",
    //             width: "100%"
    //         }}>
    //             <div className="container">
    //                 <div className="row">
    //                     <div className="col">
    //                         {/* Filtros */}
    //                         <div className="filter-container mb-3">
    //                             <select className="form-select" value={filtroCampo} onChange={(e) => setFiltroCampo(e.target.value)}>
    //                                 <option value="">Selecciona un campo</option>
    //                                 <option value="id_userFK">ID Usuario</option>
    //                                 <option value="dateAndTimeQuote">Fecha</option>
    //                                 <option value="name">Nombre</option>
    //                             </select>

    //                             <input
    //                                 type="text"
    //                                 className="form-control"
    //                                 placeholder="Valor a filtrar"
    //                                 value={filtroValor}
    //                                 onChange={(e) => setFiltroValor(e.target.value)}
    //                                 disabled={!filtroCampo}
    //                             />

    //                             <button
    //                                 className="btn btn-primary"
    //                                 onClick={() => {
    //                                     setPagina(1);
    //                                     getQuotes();
    //                                 }}
    //                                 disabled={!filtroCampo || !filtroValor}
    //                             >
    //                                 Filtrar
    //                             </button>

    //                             <button
    //                                 className="btn btn-secondary"
    //                                 onClick={limpiarFiltros}
    //                                 disabled={!filtroCampo && !filtroValor}
    //                             >
    //                                 Limpiar
    //                             </button>
    //                         </div>



    //                         <div className="table-responsive">
    //                             {/* Tabla de citas */}
    //                             <table className="table">
    //                                 <thead>
    //                                     <tr>
    //                                         <th>Fecha y Hora</th>
    //                                         <th>Nombre del Usuario</th>
    //                                         <th>Acciones</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {quotes.length > 0 ? (
    //                                         quotes.map((quote) => (
    //                                             <tr key={quote.id_quotePK}>
    //                                                 <td>{quote.tbl_user?.name || "Sin nombre"}</td>
    //                                                 <td>{new Date(quote.dateAndTimeQuote).toLocaleString()}</td>
    //                                                 <td>
    //                                                     {quote.status === "activa" && (
    //                                                         <CancelButtonQuote
    //                                                             idQuote={quote.id_quotePK}
    //                                                             onCancelSuccess={() => getQuotes()}
    //                                                         />
    //                                                     )}

    //                                                 </td>

    //                                             </tr>
    //                                         ))
    //                                     ) : (
    //                                         <tr>
    //                                             <td colSpan="4">No hay citas registradas</td>
    //                                         </tr>
    //                                     )}
    //                                 </tbody>
    //                             </table>

    //                         </div>

    //                         {/* Paginación */}
    //                         <div className="pagination">
    //                             <button onClick={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>
    //                                 Anterior
    //                             </button>
    //                             <span>
    //                                 Página {pagina} de {totalPaginas}
    //                             </span>
    //                             <button onClick={() => cambiarPagina(pagina + 1)} disabled={pagina === totalPaginas}>
    //                                 Siguiente
    //                             </button>
    //                         </div>
    //                     </div>
    //                     <QuotesCalendar />
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default CompShowQuotes;
