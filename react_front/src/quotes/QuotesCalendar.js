import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import "../css/quotes/QuotesCalendarCss.css";
import {
    Box,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const URI_GET_QUOTES_CALENDAR = "http://localhost:3000/api/v1/Tenant/quotes/all/calendar";

const QuotesCalendar = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedDateQuotes, setSelectedDateQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token no disponible");

                const api = axios.create({
                    baseURL: URI_GET_QUOTES_CALENDAR,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const res = await api.get();
                setQuotes(res.data.data);
            } catch (err) {
                console.error("Error al obtener las citas:", err);
            }
        };

        fetchQuotes();
    }, []);

    const quoteCountsByDate = quotes.reduce((acc, quote) => {
        const date = new Date(quote.dateAndTimeQuote).toLocaleDateString("en-CA");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});



    const handleDateChange = (date) => {
        const selected = new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD

        const filtered = quotes
            .filter((q) => {
                const quoteDate = new Date(q.dateAndTimeQuote).toLocaleDateString("en-CA");
                return quoteDate === selected;
            })
            .sort((a, b) => new Date(a.dateAndTimeQuote) - new Date(b.dateAndTimeQuote));

        setSelectedDateQuotes(filtered);
    };

    return (

        <Box sx={{ maxWidth: 1300, margin: "20px auto", padding: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Calendario de Citas
            </Typography>

            <Box elevation={3} sx={{ padding: 3, borderRadius: 4, justifyItems: "center" }}>
                <Grid container spacing={3}>
                    {/* Calendario */}
                    <Grid item xs={12} md={8}>
                        <Calendar
                            onChange={handleDateChange}
                            tileClassName={({ date, view }) => {
                                if (view === "month") {
                                    const dateStr = date.toLocaleDateString("en-CA");
                                    const count = quoteCountsByDate[dateStr] || 0;

                                    if (count === 0) return "yellow-day";
                                    if (count >= 1 && count <= 5) return "orange-day";
                                    if (count >= 6 && count <= 10) return "pink-day";
                                    if (count >= 11) return "green-day";
                                }
                            }}
                        />
                    </Grid>

                    {/* Leyenda */}
                    
                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Leyenda
                            </Typography>
                            <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {[
                                    { label: "1 a 5 citas", color: "#c4811d" },
                                    { label: "6 a 10 citas", color: "#f48fb1" },
                                    { label: "11 o más citas", color: "#81c784" },
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        component="li"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 1,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                backgroundColor: item.color,
                                                marginRight: 1,
                                            }}
                                        />
                                        {item.label}
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Lista de citas del día */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Citas del día
                </Typography>
                {selectedDateQuotes.length > 0 ? (
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
                        <List>
                            {selectedDateQuotes.map((quote) => (
                                <ListItem key={quote.id_quotePK}>
                                    <ListItemText
                                        primary={`👤 ${quote.tbl_user?.name}`}
                                        secondary={`🕒 ${new Date(quote.dateAndTimeQuote).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ) : (
                    <Typography variant="body1">No hay citas para este día.</Typography>
                )}
            </Box>
        </Box>
    );


};

export default QuotesCalendar;
