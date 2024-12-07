const dotenv = require("dotenv");
const { connection } = require("../config.bd");
const axios = require("axios"); // Importar axios

// Cargar las variables de entorno
dotenv.config();

// Función para restar del inventario
const restarInventario = async (req, res) => {
    const {producto_id, Receta_id, Cantidad, TipoVenta} = req.body; // Asegúrate de que 'otros_datos' contenga la información que necesitas enviar

    // Consultar la cantidad actual del inventario
    connection.query("SELECT cantidad_disponible FROM galletasStock WHERE receta_id = ?", [producto_id], async (error, results) => {
        if (error) {
            console.error("Error al obtener el inventario:", error);
            return res.status(500).json({ error: "Error al obtener el inventario." });
        }

        // Verificar si el producto existe
        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        // Obtener la cantidad actual
        let cantidad_actual = results[0].cantidad;

        try {
            // Consumir el servicio externo y enviar datos en el cuerpo de la solicitud
            const response = await axios.post('https://dongalleto-validacion.vercel.app/api/validarExistencia', {
                Receta_id, Cantidad, TipoVenta// Aquí envías los datos adicionales que necesites
            });

            if (response.status === 200) {
                const cantidad_a_restar = response.data.cantidad; // Suponiendo que el JSON tiene un campo 'cantidad'

                // Calcular la nueva cantidad
                let nueva_cantidad = cantidad_actual - cantidad_a_restar;

                // Verificar que la nueva cantidad no sea negativa
                if (nueva_cantidad < 0) {
                    return res.status(400).json({ error: "No se puede restar más de lo que hay en inventario." });
                }

                // Actualizar la cantidad en la base de datos
                connection.query(
                    "UPDATE inventario SET cantidad = ? WHERE producto_id = ?",
                    [nueva_cantidad, producto_id],
                    (updateError) => {
                        if (updateError) {
                            console.error("Error al actualizar el inventario:", updateError);
                            return res.status(500).json({ error: "Error al actualizar el inventario." });
                        }

                        // Devolver una respuesta exitosa
                        res.status(200).json({ message: "Inventario actualizado correctamente." });
                    }
                );
            } else {
                // Manejar el caso donde el servicio devuelve un estatus diferente a 200
                return res.status(response.status).json({ error: "Error al consumir el servicio externo." });
            }
        } catch (err) {
            console.error("Error al consumir el servicio externo:", err);
            return res.status(500).json({ error: "Error al consumir el servicio externo." });
        }
    });
};

// Exportar como función serverless
module.exports = (req, res) => {
    // Configurar los encabezados CORS
    res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todos los orígenes
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Métodos permitidos
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Encabezados permitidos

    // Verificar el método de la solicitud
    if (req.method === "OPTIONS") {
        // Si es una solicitud OPTIONS, devolver un 204 No Content
        res.status(204).end();
        return;
    }

    if (req.method === "POST") {
        restarInventario(req, res); // Llamar a la función para manejar la solicitud POST
    } else {
        // Si el método no es permitido, devolver un error 405
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
};