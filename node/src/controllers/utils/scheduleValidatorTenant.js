
import ScheduleConfigModel from "../../models/ScheduleConfigModelTenant.js";

export const toMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};



export const validateScheduleForDate = async (dateTime) => {
  const localDateTime = new Date(dateTime); // ya está en local

  const totalMinutes = localDateTime.getHours() * 60 + localDateTime.getMinutes();

  let config = await ScheduleConfigModel.findOne({
    where: { date: localDateTime.toISOString().split("T")[0] },
  });

  if (!config) {
    config = await ScheduleConfigModel.findOne({ where: { date: null } });
  }

  if (!config) {
    throw new Error("No hay configuración de horario para ese día");
  }

  const workStart = toMinutes(config.workStart);
  const workEnd = toMinutes(config.workEnd);
  const lunchStart = toMinutes(config.lunchStart);
  const lunchEnd = toMinutes(config.lunchEnd);

  if (totalMinutes < workStart || totalMinutes >= workEnd) {
    throw new Error(`La cita debe estar dentro del horario laboral (${config.workStart} - ${config.workEnd})`);
  }

  if (totalMinutes >= lunchStart && totalMinutes < lunchEnd) {
    throw new Error(`No se pueden agendar citas durante el almuerzo (${config.lunchStart} - ${config.lunchEnd})`);
  }
};

