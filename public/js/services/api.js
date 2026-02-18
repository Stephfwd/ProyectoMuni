// Base URL for the API
const API_URL = "http://localhost:3002";

// Usuarios
export async function getUsuarios() {
    try {
        const respuestaServidor = await fetch(`${API_URL}/users`, {
            method: "GET"
        });
        if (!respuestaServidor.ok) throw new Error(`HTTP error! status: ${respuestaServidor.status}`);
        const datosUsuarios = await respuestaServidor.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
        throw error;
    }
}

export async function postUsuarios(usuario) {
    try {
        const respuesta = await fetch(`${API_URL}/users`, { // Note: endpoint changed to /users matching previous usage
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
    }
}

export async function putUsuarios(usuario, id) {


    try {
        const respuesta = await fetch(`${API_URL}/users/${id}`, { // endpoint /users/id
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
        throw error;
    }
}

// Reportes
export async function postReporte(reporte) {
    try {
        const response = await fetch(`${API_URL}/reportes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reporte)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Citas
export async function postCita(cita) {
    try {
        const response = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cita)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Login
export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`, {
            method: "GET"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
}

// Check email availability (for registration)
export async function checkEmailAvailability(email) {
    try {
        const response = await fetch(`${API_URL}/users?email=${email}`, {
            method: "GET"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
}

export async function deleteUsuarios(id) {
    try {
        const respuesta = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);

        const datosUsuarios = await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
        throw error;
    }
}
