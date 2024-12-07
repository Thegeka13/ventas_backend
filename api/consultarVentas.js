const dotenv = require("dotenv");
const { connection } = require("../config.db");

// Cargar las variables de entorno
dotenv.config();

// Función para obtener todo el inventario
const obtenerTodoElInventario = (req, res) => {
    // Realizar la consulta a la base de datos
    connection.query("SELECT producto.*, inventario.* FROM inventario INNER JOIN producto ON producto.producto_id = inventario.producto_id;", (error, results) => {
        if (error) {
            console.error("Error al consultar inventario:", error);
            return res.status(500).json({ error: "Error al obtener el inventario." });
        }

        // Devolver los resultados en formato JSON
        res.status(200).json(results);
    });
};

// Exportar como función serverless
module.exports = (req, res) => {
    // Configurar los encabezados CORS
    res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todos los orígenes
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS"); // Métodos permitidos
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Encabezados permitidos

    // Verificar el método de la solicitud
    if (req.method === "OPTIONS") {
        // Si es una solicitud OPTIONS, devolver un 204 No Content
        res.status(204).end();
        return;
    }

    if (req.method === "GET") {
        obtenerTodoElInventario(req, res); // Llamar a la función para manejar la solicitud GET
    } else {
        // Si el método no es permitido, devolver un error 405
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};