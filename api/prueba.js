const dotenv = require("dotenv");
const { connection } = require("../config.db");

// Cargar las variables de entorno
dotenv.config();

// Función para restar del inventario
const restarInventario = (req, res) => {
    const { cantidad, producto_id} = req.body;

    // Validar la cantidad
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
    }

    // Consultar la cantidad actual del inventario
    connection.query("SELECT cantidad FROM inventario WHERE producto_id = ?", [producto_id], (error, results) => {
        if (error) {
            console.error("Error al obtener el inventario:", error);
            return res.status(500).json({ error: "Error al obtener el inventario." });
        }

        // Verificar si el producto existe
        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        // Calcular la nueva cantidad
        let cantidad_actual = results[0].cantidad;
        let nueva_cantidad = cantidad_actual - cantidad;

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