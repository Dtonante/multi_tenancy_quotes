// controllers/scheduleConfigController.js
import DefineScheduleConfigModelTenant from "../models/ScheduleConfigModelTenant.js";

// mostrar configuracion par aun dia
// export const getScheduleConfigByDate = async (req, res) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
//     }

//     // Check if there's a custom config for that date
//     let config = await ScheduleConfig.findOne({ where: { date } });

//     // If no config exists, use default config (date = null)
//     if (!config) {
//       config = await ScheduleConfig.findOne({ where: { date: null } });
//     }

//     if (!config) {
//       return res.status(404).json({ message: "No default or custom schedule config found" });
//     }

//     res.status(200).json(config);
//   } catch (error) {
//     console.error("Error fetching schedule config:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getScheduleConfigByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    // Check if there's a custom config for that date
    let config = await DefineScheduleConfigModelTenant.findOne({ where: { date } });

    // If no config exists for the specific date, return an error
    if (config) {
      return res.status(200).json(config);
    }

    // If no custom config exists for the date, return a not found response
    return res.status(404).json({ message: "No schedule config found for the specified date" });
    
  } catch (error) {
    console.error("Error fetching schedule config:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// create schedule Config
export const createScheduleConfig = async (req, res) => {
  try {
    const { date, workStart, workEnd, lunchStart, lunchEnd } = req.body;

    // Validar campos obligatorios
    if (!workStart || !workEnd || !lunchStart || !lunchEnd) {
      return res.status(400).json({ message: "Todos los campos de horario son obligatorios" });
    }

    // Verificar si ya existe una configuración para esa fecha (incluso si es null)
    const existingConfig = await DefineScheduleConfigModelTenant.findOne({ where: { date } });

    if (existingConfig) {
      return res.status(400).json({ message: "Ya existe una configuración para esa fecha" });
    }

    // Crear nueva configuración
    const newConfig = await DefineScheduleConfigModelTenant.create({
      date: date || null, // Acepta null explícitamente
      workStart,
      workEnd,
      lunchStart,
      lunchEnd,
    });

    res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error al crear configuración:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// delete schedule Config
export const deleteScheduleConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await DefineScheduleConfigModelTenant.findByPk(id);
    if (!config) return res.status(404).json({ message: "Configuración no encontrada" });

    await config.destroy();
    res.status(200).json({ message: "Configuración eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar configuración:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

