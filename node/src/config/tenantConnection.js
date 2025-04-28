import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


 function getTenantConnection(dbName) {
  const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  });

  sequelize.authenticate()
    .then(() => {
      console.log(`Conexión exitosa a la base de datos ${dbName}`);
    })
    .catch((error) => {
      console.error(`No se pudo conectar a la base de datos ${dbName}:`, error);
    });

  return sequelize;
}

export default getTenantConnection;


