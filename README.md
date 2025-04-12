# README.md

# Registro QR Project

Este proyecto es una aplicación web para el registro de información utilizando códigos QR. Permite a los usuarios registrar datos, visualizar registros y generar documentos PDF con la información almacenada.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de archivos:

```
Registro-QR-main
├── src
│   ├── controllers
│   │   ├── dbController.js        # Lógica para interactuar con Firestore
│   │   ├── pdfController.js       # Generación de documentos PDF
│   │   ├── qrController.js        # Manejo de códigos QR y visualización de registros
│   │   └── registroContrller.js   # Visualización de registros en formato HTML
│   ├── router
│   │   ├── dbRoutes.js            # Rutas para operaciones de la base de datos
│   │   ├── pdfRoutes.js           # Ruta para generar y descargar el PDF
│   │   ├── qrRoutes.js            # Rutas para registrar nuevos datos y obtener registros
│   │   └── registroRoutes.js       # Rutas para manejar la visualización de registros
│   ├── views
│   │   └── index.ejs              # Plantilla de vista para el formulario y lista de registros
│   └── app.js                     # Configuración de la aplicación Express
├── public
│   ├── css                        # Carpeta para estilos CSS
│   ├── js                         # Carpeta para scripts JavaScript
│   └── img                        # Carpeta para imágenes
├── server.js                      # Punto de entrada de la aplicación
└── README.md                      # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```
   cd Registro-QR-main
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

4. Configura las credenciales de Firebase en `src/controllers/dbController.js`.

## Uso

1. Inicia el servidor:
   ```
   node server.js
   ```

2. Abre tu navegador y visita `http://localhost:3000` para acceder a la aplicación.

## Funcionalidades

- Registro de información con generación de códigos QR.
- Visualización de registros en una tabla.
- Generación y descarga de documentos PDF con los registros.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.