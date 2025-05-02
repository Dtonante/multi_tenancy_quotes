// import cron from "node-cron";
// import TenantModel from "../models/TenantModel.js"; // Tu modelo global de tenants
// import DefineQuoteModelTenant from "../models/QuoteModelTenant.js";
// import getTenantConnection from "../config/tenantConnection.js";

// const autoMarkAsCompleted = () => {
//   // Se ejecuta cada 30 minutos
//   cron.schedule("0,30 * * * *", async () => {
//     console.log(`🕒 [Cron Job] Ejecutado a las: ${new Date().toLocaleString()}`);

//     try {
//       // 1. Obtener todos los tenants
//       const tenants = await TenantModel.findAll({
//         attributes: ['name_db_tenant', 'name_tenant']
//       });

//       for (const tenant of tenants) {
//         const { name_db_tenant: dbName, name_tenant: nameTenant } = tenant;

//         try {
//           const sequelizeTenant = getTenantConnection(dbName);
//           const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

//           const ahora = new Date();
//           const citasActivas = await QuoteModel.findAll({ where: { status: "activa" } });

//           console.log(`📌 [${nameTenant}] Citas activas: ${citasActivas.length}`);

//           for (const cita of citasActivas) {
//             const fechaCita = new Date(cita.dateAndTimeQuote);

//             const esHoy =
//               fechaCita.getDate() === ahora.getDate() &&
//               fechaCita.getMonth() === ahora.getMonth() &&
//               fechaCita.getFullYear() === ahora.getFullYear();

//             if (esHoy) {
//               const diferenciaMin = (ahora - fechaCita) / 1000 / 60;

//               if (diferenciaMin >= 30) {
//                 await cita.update({ status: "realizada" });
//                 console.log(`✅ [${nameTenant}] Cita ID ${cita.id} marcada como 'realizada'`);
//               }
//             }
//           }
//         } catch (tenantError) {
//           console.error(`❌ Error procesando tenant ${nameTenant}:`, tenantError.message);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error en el cron job:", error.message);
//     }
//   });
// };

// export default autoMarkAsCompleted

import cron from "node-cron";
import { DateTime } from "luxon";
import TenantModel from "../models/TenantModel.js"; // Tu modelo global de tenants
import DefineQuoteModelTenant from "../models/QuoteModelTenant.js";
import getTenantConnection from "../config/tenantConnection.js";

const autoMarkAsCompleted = () => {
  // Se ejecuta cada 30 minutos
  cron.schedule("0,30 * * * *", async () => {
    console.log(`🕒 [Cron Job] Ejecutado a las: ${new Date().toLocaleString()}`);

    try {
      // 1. Obtener todos los tenants
      const tenants = await TenantModel.findAll({
        attributes: ['name_db_tenant', 'name_tenant']
      });

      for (const tenant of tenants) {
        const { name_db_tenant: dbName, name_tenant: nameTenant } = tenant;

        try {
          const sequelizeTenant = getTenantConnection(dbName);
          const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

          const ahora = DateTime.local(); // Hora local
          const citasActivas = await QuoteModel.findAll({ where: { status: "activa" } });

          console.log(`📌 [${nameTenant}] Citas activas: ${citasActivas.length}`);

          for (const cita of citasActivas) {
            const fechaCita = DateTime.fromJSDate(cita.dateAndTimeQuote, { zone: 'utc' }).toLocal();

            console.log(`🔍 [${nameTenant}] Cita ID ${cita.id}`);
            console.log(`    Fecha cita original (UTC): ${cita.dateAndTimeQuote}`);
            console.log(`    Fecha cita local: ${fechaCita.toFormat("yyyy-MM-dd HH:mm:ss")}`);
            console.log(`    Ahora local: ${ahora.toFormat("yyyy-MM-dd HH:mm:ss")}`);


            const esHoy = fechaCita.hasSame(ahora, 'day');

            if (fechaCita < ahora.minus({ minutes: 30 })) {
              await cita.update({ status: "realizada" });
              console.log(`✅ [${nameTenant}] Cita ID ${cita.id} marcada como 'realizada'`);
            } else {
              const esHoy = fechaCita.hasSame(ahora, 'day');
              if (esHoy) {
                console.log(`⏳ [${nameTenant}] Cita ID ${cita.id} aún no cumple los 30 min`);
              } else {
                console.log(`📅 [${nameTenant}] Cita ID ${cita.id} no es de hoy ni ha pasado 30 min`);
              }
            }

          }
        } catch (tenantError) {
          console.error(`❌ Error procesando tenant ${nameTenant}:`, tenantError.message);
        }
      }
    } catch (error) {
      console.error("❌ Error en el cron job:", error.message);
    }
  });
};

export default autoMarkAsCompleted;

