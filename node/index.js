import app from "./src/app.js";
import db from "./src/config/db.js"; // ejecuta conexión y crea DB master
import dotenv from "dotenv";
dotenv.config();

import autoMarkAsCompleted from "./src/jobs/autoMarkAsCompleted.js";

await db.sync(); // sincroniza modelos en DB master

autoMarkAsCompleted();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
