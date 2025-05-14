import Swal from 'sweetalert2';

export const erroresSweetAlert2 = (error) => {
    if (error.response) {
        const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo.";
        return Swal.fire({
            icon: "warning",
            title: "Error",
            text: mensajeError,
            confirmButtonText: "OK"
        });
    }

    if (error.message.includes("Network Error") || error.message.includes("ERR_CONNECTION_REFUSED")) {
        return Swal.fire({
            icon: "question",
            title: "Error de Conexión",
            text: "Verifica tu conexión a internet e inténtalo de nuevo",
            confirmButtonText: "OK"
        });
    }

    return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado. Inténtalo de nuevo",
        confirmButtonText: "OK"
    });
};