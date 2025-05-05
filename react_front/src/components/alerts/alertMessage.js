import React from 'react';
import Swal from 'sweetalert2';

// Componente que recibe el tipo (success, error) y el mensaje
const AlertMessage = ({ tipo, mensaje }) => {
  React.useEffect(() => {
    if (mensaje) {
      Swal.fire({
        icon: tipo,
        title: tipo === 'success' ? 'Éxito' : 'Error',
        text: mensaje,
        confirmButtonText: 'Aceptar',
      });
    }
  }, [mensaje, tipo]); // Se ejecuta cuando el mensaje o tipo cambian

  return null; // Este componente no renderiza nada, solo maneja las alertas
};

export default AlertMessage;
