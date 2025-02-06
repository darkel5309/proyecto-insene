const express = require("express");
const cors = require("cors");
const contactoRoutes = require("./routes/contactoRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const sesionRoutes = require("./routes/sesionRoutes");

const app = express();

// permite que el frontend en localhost:3000 haga solicitudes al backend
app.use(cors({ origin: "http://localhost:3000" }));
// convierte las peticiones en formato .json
app.use(express.json());

app.use("/api", contactoRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", sesionRoutes);


// verificamos que el backend esta funcionando correctamente y escuchando en el puerto 3001
app.listen(3001, () => {
    console.log("Servidor funcionando correctamente en el puerto 3001.");
});