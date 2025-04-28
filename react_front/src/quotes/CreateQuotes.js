import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import "../css/quotes/CreateQuoteCss.css";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Typography, TextField, Button, Paper, Grid, Alert, IconButton } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const URI_CREATE_QUOTE = "http://localhost:3000/api/v1/Tenant/quotes";

const CreateQuotes = () => {
  const [dateAndTimeQuote, setDateAndTimeQuote] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [availableHours, setAvailableHours] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  const navigate = useNavigate();
  const id_userFK = localStorage.getItem("user");
  const name_user = localStorage.getItem("name_user");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (!dateAndTimeQuote) return;

      const formattedDate = new Date(dateAndTimeQuote).toISOString().split("T")[0];

      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/Tenant/quotes/disponibles/horas?fecha=${formattedDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAvailableHours(Array.isArray(res.data.horasDisponibles) ? res.data.horasDisponibles : []);
        setFetchError("");
      } catch (err) {
        console.error("Error al obtener horas disponibles", err);
        setAvailableHours([]);
        setFetchError("Error al obtener horas disponibles.");
      }
    };

    fetchAvailableHours();
  }, [dateAndTimeQuote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!id_userFK) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    try {
      // Convertir la fecha seleccionada a un formato que respete la zona horaria local
      const fechaFormateada = dateAndTimeQuote.toLocaleString("sv-SE").replace(" ", "T");
      console.log("Fecha enviada sin UTC:", fechaFormateada);

      await axios.post(
        URI_CREATE_QUOTE,
        { id_userFK, dateAndTimeQuote: fechaFormateada },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Cita creada con éxito.");
      setDateAndTimeQuote("");
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const mensajeServidor = err.response.data?.message;

        if ((status === 400 || status === 409) && mensajeServidor) {
          setError(mensajeServidor);
        } else {
          setError("Error al crear la cita.");
        }
      } else {
        setError("Error de conexión con el servidor.");
      }
    }
  };



  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          marginLeft: sidebarAbierto ? "200px" : "-5px",
          transition: "margin-left 0.3s",
          padding: 2,
          width: "100%",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 700,
            margin: "auto",
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
            Crear Cita
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {mensaje && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mensaje}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Usuario"
              value={name_user}
              fullWidth
              disabled
              variant="outlined"
            />

            <TextField
              label="Fecha y Hora"
              value={
                dateAndTimeQuote
                  ? dateAndTimeQuote.toLocaleString("es-ES", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                  : ""
              }
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton>
                    <CalendarToday />
                  </IconButton>
                ),
              }}
              variant="outlined"
            />

            <Box sx={{ position: "relative", width: "100%", height: "auto", justifyItems: "center" }}>

              <Calendar
                className="react-calendar"
                locale="es-ES"
                onChange={(date) => {
                  // Mantenemos la hora si ya se había seleccionado
                  if (dateAndTimeQuote) {
                    const selectedDate = new Date(date);
                    selectedDate.setHours(dateAndTimeQuote.getHours());
                    selectedDate.setMinutes(dateAndTimeQuote.getMinutes());
                    selectedDate.setSeconds(0);
                    selectedDate.setMilliseconds(0);
                    setDateAndTimeQuote(selectedDate);
                  } else {
                    setDateAndTimeQuote(new Date(date));
                  }
                }}
                value={dateAndTimeQuote}
                minDate={new Date()}
              />

            </Box>

            <Typography variant="subtitle1" fontWeight="bold" mt={1}>
              Horas disponibles
            </Typography>

            {fetchError && <Alert severity="error">{fetchError}</Alert>}

            {availableHours.length > 0 ? (
              <Grid container spacing={1}>
                {availableHours.map((hora, index) => (
                  <Grid item key={index}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (dateAndTimeQuote) {
                          const [hour, minute] = hora.split(":");
                          const nuevaFecha = new Date(dateAndTimeQuote);
                          nuevaFecha.setHours(Number(hour));
                          nuevaFecha.setMinutes(Number(minute));
                          nuevaFecha.setSeconds(0);
                          nuevaFecha.setMilliseconds(0);
                          setDateAndTimeQuote(nuevaFecha);
                        }
                      }}
                    >
                      {hora}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : dateAndTimeQuote && !fetchError ? (
              <Typography>No hay horas disponibles para esta fecha.</Typography>
            ) : null}

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Guardar Cita
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

};

export default CreateQuotes;
