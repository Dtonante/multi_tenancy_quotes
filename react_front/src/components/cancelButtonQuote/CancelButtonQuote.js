// import React from "react";
// import axios from "axios";

// const CancelButtonQuote = ({ idQuote, onCancelSuccess }) => {
//     const token = localStorage.getItem("token");

//     const handleCancel = async () => {
//         const confirm = window.confirm("Are you sure you want to cancel this appointment?");
//         if (!confirm) return;

//         try {
//             await axios.put(
//                 `http://localhost:3000/api/v1/quotes/cancel/cancelCustomerQuote/${idQuote}`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             alert("Quote cancelled successfully.");
//             if (onCancelSuccess) onCancelSuccess();
//         } catch (error) {
//             console.error("Error cancelling the quote:", error);
//             alert("An error occurred while cancelling the quote.");
//         }
//     };

//     return <button onClick={handleCancel}>Cancel</button>;
// };

// export default CancelButtonQuote;


import React from "react";
import axios from "axios";
import { Button } from "@mui/material"; // Importar Button de Material-UI

const CancelButtonQuote = ({ idQuote, onCancelSuccess }) => {
    const token = localStorage.getItem("token");

    const handleCancel = async () => {
        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            await axios.put(
                `http://localhost:3000/api/v1/quotes/cancel/cancelCustomerQuote/${idQuote}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Quote cancelled successfully.");
            if (onCancelSuccess) onCancelSuccess();
        } catch (error) {
            console.error("Error cancelling the quote:", error);
            alert("An error occurred while cancelling the quote.");
        }
    };

    return (
        <Button
            onClick={handleCancel}
            variant="contained" // Tipo de botón
            sx={{
                backgroundColor: "error.main", // Color rojo para el botón de cancelar
                color: "common.white", // Texto blanco
                "&:hover": {
                    backgroundColor: "error.dark", // Color oscuro cuando el mouse pasa por encima
                },
                padding: "8px 16px", // Ajustar el padding del botón
                fontSize: "12.5px", // Tamaño de la fuente
                fontWeight: "bold", // Hacer el texto en negrita
                borderRadius: "8px", // Bordes redondeados
            
            }}
        >
            Cancel
        </Button>
    );
};

export default CancelButtonQuote;
