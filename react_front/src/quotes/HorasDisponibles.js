import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import Sidebar from "../sidebar/Sidebar";

const URI_AVAILABLE_HOURS = "http://localhost:3000/api/v1/Tenant/quotes/disponibles/horas";

const HorasDisponibles = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (!selectedDate) return;

      const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd

      try {
        const res = await axios.get(`${URI_AVAILABLE_HOURS}?fecha=${formattedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Asegurar que sea un array
        setAvailableHours(Array.isArray(res.data.horasDisponibles) ? res.data.horasDisponibles : []);
        setError("");
      } catch (err) {
        setAvailableHours([]);
        setError("Error al obtener horas disponibles.");
        console.error(err);
      }
    };

    fetchAvailableHours();
  }, [selectedDate]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />

      <div
        style={{
          marginLeft: sidebarAbierto ? "200px" : "-5px",
          transition: "margin-left 0.3s",
          padding: "20px",
          width: "100%",
        }}
      >
        <h2>Consultar Horas Disponibles</h2>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          locale={es}
          inline
        />

        <h3>Horas disponibles</h3>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {availableHours.length > 0 ? (
          <ul>
            {availableHours.map((hora, index) => (
              <li key={index}>{hora}</li>
            ))}
          </ul>
        ) : selectedDate && !error ? (
          <p>No hay horas disponibles para esta fecha.</p>
        ) : null}
      </div>
    </div>
  );
};

export default HorasDisponibles;
