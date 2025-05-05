
import Swal from 'sweetalert2';

const showSuccessAlert = async (email, password) => {
  await Swal.fire({
    icon: 'success',
    title: 'Usuario creado',
    html: `
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contraseña:</strong> ${password}</p>
    `,
    confirmButtonText: 'Aceptar'
  });
};

export default showSuccessAlert;
