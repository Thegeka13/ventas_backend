const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.DBPORT || 3307 // Por defecto, MySQL usa el puerto 3306
});

function connectDatabase() {
    connection.connect((err) => {
        if (err) {
            console.error("Error al conectar con la base de datos:", err);
            setTimeout(connectDatabase, 5000); // Reintentar la conexión después de 5 segundos
        } else {
            console.log("Conexión a la base de datos exitosa");
        }
    });

    connection.on('error', (err) => {
        console.error("Error en la conexión a la base de datos:", err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log("Reconectando a la base de datos...");
            connectDatabase(); // Reconexión automática
        } else {
            throw err;
        }
    });
}

connectDatabase();

module.exports = { connection };