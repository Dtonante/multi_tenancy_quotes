import Swal from "sweetalert2";

export const showCancelConfirmation = async () => {
  const result = await Swal.fire({
    title: "¿Cancelar la cita?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No",
  });

  return result.isConfirmed;
};

export const showCancelSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Cita cancelada",
    text: "La cita fue cancelada exitosamente.",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showCancelError = () => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Ocurrió un error al cancelar la cita.",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};
