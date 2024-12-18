# API DE INVENTARIO Y VENTAS

Descripción General


Este módulo implementa un servicio para la gestión del inventario de productos y el registro de ventas en una base de datos MySQL. 

Permite:

1.-Actualizar las existencias en el inventario.

2.- Registrar ventas en la tabla correspondiente.

3.- Consultar servicios externos para validar la disponibilidad de inventario.

3.- Consultar todas las ventas.


El servicio está construido utilizando Node.js y Express.js, y aprovecha dependencias como dotenv, axios, y mysql para manejar las conexiones y solicitudes externas.

Dependencias


Las principales dependencias utilizadas son:


dotenv: Carga variables de entorno desde un archivo .env.

axios: Cliente HTTP para realizar solicitudes a servicios externos.

mysql: Cliente para interactuar con la base de datos MySQL.


Variables de Entorno

Este módulo utiliza un archivo .env para almacenar credenciales y configuraciones sensibles. Estas se cargan al inicio del programa usando dotenv.config().


Conexión a la Base de Datos


La conexión a la base de datos se gestiona mediante un archivo de configuración externo (config.bd), que exporta un objeto de conexión llamado connection. Esto permite ejecutar consultas SQL en las tablas galletasStock, Recetas, y ModuloVentas.

Funcionalidades


1.- Agregar una venta por galleta suelta

Ruta: https://ventas-backend-two.vercel.app/api/agregarVenta

Método: POST

Descripción:

Resta una cantidad específica del inventario y registra los detalles de la venta en la tabla ModuloVentas. Además, utiliza un servicio externo para validar la existencia de productos antes de completar la transacción.

Ejemplo de cuerpo POST:

{
"producto_id":1,
 "Receta_id": 1,
 "Cantidad": 10,
 "TipoVenta": "sueltas",
  "PrecioUnitario": 15.50,
  "TotalVenta": 155.00,
  "Descuento": 10.00,
  "ClientePago": 200.00
}

2.- GetAll Ventas


Ruta Principal: https://ventas-backend-two.vercel.app/api/consultarVentas


Método: GET


Descripción:
Obtiene todos los registros almacenados en la tabla ModuloVentas. Devuelve el resultado en formato JSON.

link a la aplicación: https://ventas-backend-two.vercel.app/

Link al Repositorio: https://github.com/Thegeka13/ventas_backend