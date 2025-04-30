import DefineQuoteModelTenant from "../models/QuoteModelTenant.js";
import DefineUserModelTenant from "../models/UserModelTenant.js";
import paginate from "../middlewares/paginate.js";
import generateFilters from "../middlewares/filter.js";
import { Op } from "sequelize";
import { toMinutes, validateScheduleForDate } from "./utils/scheduleValidatorTenant.js";
import { DateTime } from 'luxon';
import DefineScheduleConfigModelTenant from "../models/ScheduleConfigModelTenant.js";
import getTenantConnection from "../config/tenantConnection.js";
import getDbNameByTenantId from "../services/nameTenantForID.js";
import DefineTenantAssociations from "../models/associations.js";






// Obtener todas las citas con paginación y filtros
export const getQuotes = (req, res) => {
    const allowedFilters = ["id_userFK", "dateAndTimeQuote"];
    const filters = generateFilters(req.query, allowedFilters);

    const userWhere = req.query.name
        ? { name: { [Op.like]: `%${req.query.name}%` } }
        : undefined;

    paginate(DefineQuoteModelTenant, req, res, filters, {
        include: [{
            model: DefineUserModelTenant,
            attributes: ["name", "email"],
            where: userWhere
        }]
    });
};

// trae los datos del token 
// Crear quote
export const createQuote = async (req, res) => {
    try {
        const { dateAndTimeQuote } = req.body;
        const { id: user_id, tenant_id } = req.usuario;

        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

        // 2. Crear la conexión a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 3. Definimos el modelo de quote para es
        const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

        if (!user_id || !dateAndTimeQuote) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Validar si el usuario ya tiene una cita activa
        const citaActiva = await QuoteModel.findOne({
            where: {
                user_id,
                status: "activa"
            }
        });

        if (citaActiva) {
            return res.status(400).json({
                message: "Ya tienes una cita activa. No puedes agendar otra hasta que se complete o cancele."
            });
        }

        // Convertir la fecha y hora a objeto Date
        const fechaHora = new Date(dateAndTimeQuote);
        const fechaActual = new Date();
        fechaActual.setSeconds(0, 0);
        fechaHora.setSeconds(0, 0);

        // Validar que no se pueda crear una cita en el pasado
        if (fechaHora < fechaActual) {
            return res.status(400).json({ message: "No se puede agendar una cita en el pasado" });
        }

        // 🔄 Validación dinámica usando la configuración de horarios
        try {
            await validateScheduleForDate(fechaHora, sequelizeTenant, nameTenant);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Verificar si ya existe una cita para esa fecha y hora
        const citaExistente = await QuoteModel.findOne({
            where: { dateAndTimeQuote }
        });

        if (citaExistente && citaExistente.status !== "cancelada") {
            return res.status(409).json({
                message: "Ya hay una cita agendada para esta fecha y hora"
            });
        }

        // Crear la nueva cita
        const nuevaCita = await QuoteModel.create({
            user_id,
            dateAndTimeQuote,
            status: "activa"
        });

        const citaLocal = {
            ...nuevaCita.toJSON(),
            dateAndTimeQuote: new Date(nuevaCita.dateAndTimeQuote).toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        res.status(201).json({ message: "Cita creada con éxito", cita: citaLocal });


    } catch (error) {
        res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
};

// obtener todas las citas sin paginado y filtros para el calendario
export const getAllQuotes = async (req, res) => {
    try {
        const { tenant_id } = req.usuario;

        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

        // 2. Crear la conexión a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 3. Definir modelos y asociaciones del tenant
        const { User: UserModel, Quote: QuoteModel } = DefineTenantAssociations(sequelizeTenant, nameTenant);

        // Obtener la fecha y hora actual en formato JS Date
        const now = DateTime.now().toJSDate();

        const quotes = await QuoteModel.findAll({
            where: {
                dateAndTimeQuote: {
                    [Op.gte]: now // solo citas futuras desde el momento actual
                },
                status: 'activa' // solo citas activas
            },
            include: [{
                model: UserModel,
                attributes: ["name_user", "email"],
                as: "user" 

            }],
            order: [['dateAndTimeQuote', 'ASC']]
        });

        res.status(200).json({ data: quotes });
    } catch (error) {
        console.error("Error al obtener todas las citas:", error);
        res.status(500).json({ message: "Error al obtener las citas" });
    }
};

// Actualizar una cita por su ID
export const updateQuote = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await DefineQuoteModelTenant.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        await quote.update(req.body);
        res.status(200).json({ message: "Cita actualizado con éxito", quote });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la cita", error: error.message });
    }
};

// Eliminar una cita por su ID
export const deleteQuote = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await DefineQuoteModelTenant.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        await quote.destroy();
        res.status(200).json({ message: "Cita eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la cita", error: error.message });
    }
};

// trae los datos del token 
// Traer horas validadas por fecha
export const getAvailableHoursByDate = async (req, res) => {
    try {
        const { fecha } = req.query;
        const { tenant_id } = req.usuario;
        console.log("Fecha recibida:", fecha);
        console.log("Tenant ID recibido:", tenant_id);

        if (!fecha || !tenant_id) {
            console.log("Faltan parámetros");
            return res.status(400).json({ message: "La fecha y tenant_id son requeridos" });
        }

        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);
        console.log("Nombre DB:", dbName, "| Nombre Tenant:", nameTenant);

        const sequelizeTenant = getTenantConnection(dbName);

        const ScheduleConfigModel = DefineScheduleConfigModelTenant(sequelizeTenant, nameTenant);
        const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

        let config = await ScheduleConfigModel.findOne({ where: { date: fecha } });
        console.log("Configuración específica:", config?.dataValues || "No hay configuración específica");

        if (!config) {
            config = await ScheduleConfigModel.findOne({ where: { date: null } });
            console.log("Configuración por defecto:", config?.dataValues || "No hay configuración por defecto");
        }

        if (!config) {
            return res.status(400).json({ message: "No hay configuración de horario para ese día" });
        }

        const { workStart, workEnd, lunchStart, lunchEnd } = config;
        const timeZone = 'America/Bogota';

        const horaInicio = workStart;
        const horaFin = workEnd;

        console.log("Horario laboral:", horaInicio, "-", horaFin);
        console.log("Horario almuerzo:", lunchStart, "-", lunchEnd);

        const startOfDay = DateTime.fromISO(`${fecha}T${horaInicio}:00`, { zone: timeZone }).toJSDate();
        const endOfDay = DateTime.fromISO(`${fecha}T${horaFin}:59`, { zone: timeZone }).toJSDate();

        const citasDelDia = await QuoteModel.findAll({
            where: {
                dateAndTimeQuote: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                status: {
                    [Op.in]: ['activa']
                }
            }
        });

        console.log("Citas encontradas para el día:", citasDelDia.length);

        const horasOcupadas = citasDelDia.map(cita => {
            const fechaUtc = DateTime.fromJSDate(cita.dateAndTimeQuote, { zone: 'utc' });
            const fechaLocal = fechaUtc.setZone(timeZone);
            const horaFormateada = fechaLocal.toFormat('HH:mm');
            console.log("Hora ocupada:", horaFormateada);
            return horaFormateada;
        });

        const toMinutes = (horaStr) => {
            const [h, m] = horaStr.split(":").map(Number);
            return h * 60 + m;
        };

        const generarHoras = (inicio, fin, intervalo = 30) => {
            const horas = [];
            let [h, m] = inicio.split(":").map(Number);
            const [hFin, mFin] = fin.split(":").map(Number);

            const lunchStartMin = toMinutes(lunchStart);
            const lunchEndMin = toMinutes(lunchEnd);

            while (h < hFin || (h === hFin && m < mFin)) {
                const totalMin = h * 60 + m;
                if (!(totalMin >= lunchStartMin && totalMin < lunchEndMin)) {
                    const horaGenerada = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                    horas.push(horaGenerada);
                }
                m += intervalo;
                if (m >= 60) {
                    h++;
                    m -= 60;
                }
            }

            return horas;
        };

        const todasLasHoras = generarHoras(horaInicio, horaFin);
        console.log("Todas las horas generadas:", todasLasHoras);

        const horasDisponibles = todasLasHoras.filter(horaGenerada => {
            const horaGeneradaDate = DateTime.fromISO(`${fecha}T${horaGenerada}:00`, { zone: timeZone });
            const horaFormateada = horaGeneradaDate.toFormat('HH:mm');
            const disponible = !horasOcupadas.includes(horaFormateada);
            console.log(`¿Hora ${horaFormateada} disponible?`, disponible);
            return disponible;
        });

        console.log("Horas disponibles:", horasDisponibles);

        res.status(200).json({ fecha, horasDisponibles });

    } catch (error) {
        console.error("Error al obtener horas disponibles:", error);
        res.status(500).json({ message: "Error al obtener horas disponibles" });
    }
};

// trae los datos del token 
// Cancelar cita
export const cancelQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.usuario;

        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

        // 2. Crear la conexión a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 3. Definimos el modelo de quote para es
        const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

        const cita = await QuoteModel.findByPk(id);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        if (cita.status !== "activa") {
            return res.status(400).json({ message: "Solo se pueden cancelar citas activas" });
        }

        cita.status = "cancelada";
        await cita.save();

        res.json({ message: "Cita cancelada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar la cita", error: error.message });
    }
};

// quotes for id_userFK con paginado y filtros
export const getQuotesByUser = async (req, res) => {
    try {
        const { user_id, tenant_id } = req.params;

        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

        // 2. Crear la conexión a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 3. Definimos el modelo de quote para es
        const QuoteModel = DefineQuoteModelTenant(sequelizeTenant, nameTenant);

        // Incluimos el filtro de estado y cualquier otro campo permitido
        const allowedFilters = ["status", "dateAndTimeQuote"];
        const filters = generateFilters(req.query, allowedFilters);

        // Aseguramos que solo se traigan las citas de ese usuario
        filters.user_id = user_id;

        // Usamos la función de paginación
        await paginate(QuoteModel, req, res, filters, {
            order: [["dateAndTimeQuote", "DESC"]]
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las citas del usuario",
            error: error.message,
        });
    }
};

// Obtener una cita por ID
export const getQuotesForID = async (req, res) => {
    try {
        const { id_quotePK } = req.params;
        const quote = await QuoteModel.findByPk(id_quotePK);
        if (!quote) return res.status(404).json({ message: "Cita no encontrado" });

        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la cita", error: error.message });
    }
};

// // trae los datos del token 
// Obtener citas futuras con paginación y filtros
export const getUpcomingQuotes = async (req, res) => {
    try {
        const { tenant_id } = req.usuario;
        console.log("Tenant ID:", tenant_id);

        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);
        console.log("Base de datos del tenant:", dbName, "Nombre del tenant:", nameTenant);

        // 2. Crear la conexión a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);
        console.log("Conexión al tenant establecida");

        // 3. Definir modelos y asociaciones del tenant
        const { User: UserModel, Quote: QuoteModel } = DefineTenantAssociations(sequelizeTenant, nameTenant);
        console.log("Modelos definidos");

        // 4. Filtros
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - 20);

        const allowedFilters = ["user_id"];
        const filters = generateFilters(req.query, allowedFilters);

        filters.dateAndTimeQuote = { [Op.gte]: ahora };
        filters.status = "activa";
        console.log("Filtros aplicados:", filters);

        const userWhere = req.query.name_user
            ? { name_user: { [Op.like]: `%${req.query.name_user}%` } }
            : undefined;

        if (userWhere) console.log("Filtro adicional por nombre:", userWhere);

        // 5. Ejecutar paginación
        await paginate(QuoteModel, req, res, filters, {
            include: [
                {
                    model: UserModel,
                    attributes: ["name_user", "email"],
                    where: userWhere,
                    as: "user" 
                }
            ],
            order: [["dateAndTimeQuote", "ASC"]]
        });

    } catch (error) {
        console.error("❌ Error en getUpcomingQuotes:", error);
        res.status(500).json({
            message: "Error al obtener las citas",
            error: error.message,
        });
    }
};

