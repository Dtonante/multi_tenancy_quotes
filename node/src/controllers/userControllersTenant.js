import DefineUserModelTenant from "../models/UserModelTenant.js";
import DefineRoleModelTenant from "../models/RoleModelTenant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import paginate from "../middlewares/paginate.js";
import generateFilters from "../middlewares/filter.js";
import { getDbNameByTenantId } from "../services/nameTenantForID.js";
import getTenantConnection from "../config/tenantConnection.js";
import TenantModel from "../models/TenantModel.js";

dotenv.config();


// Obtener todos los usuarios con paginado y filtros
export const getUsers = (req, res) => {
    const allowedFilters = ["name", "email", "cellPhoneNumber"]; // Campos permitidos para filtrar
    const filters = generateFilters(req.query, allowedFilters);

    paginate(DefineUserModelTenant, req, res, filters);
};

// Obtener un usuario espesifico por id
export const getUser = async (req, res) => {
    const usuario = await DefineUserModelTenant.findByPk(req.params.id_userPK);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
};


// Crear un usuario con encriptacion de contraseña
export const createUser = async (req, res) => {
    const { name_user, cellPhoneNumber, email, password, role_id, tenant_id } = req.body;

    if (!name_user || !cellPhoneNumber || !password || !tenant_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // 1. Obtener el nombre de la base de datos y el nombre del tenant
        const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

        // 2. Crear la conexión a esa base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 3. Obtener los modelos definidos para ese tenant
        const UserModel = DefineUserModelTenant(sequelizeTenant, nameTenant);
        const RoleModel = DefineRoleModelTenant(sequelizeTenant, nameTenant);

        // 4. Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Construir automáticamente el email basado en el nombre del usuario y del tenant
        const email = `${name_user.toLowerCase().replace(/\s+/g, '')}@${nameTenant.toLowerCase()}.com`;


        // 6. Si no se proporciona un role_id, asigna automáticamente el rol de "cliente"
        const assignedRoleId = role_id || (await RoleModel.findOne({ where: { name_role: "cliente" } })).id;

        // 7. Crear el usuario
        const user = await UserModel.create({
            name_user,
            cellPhoneNumber,
            email,
            password: hashedPassword,
            role_id: assignedRoleId,
            tenant_id,
        });

        res.status(201).json({ message: "Usuario creado", user });
    } catch (error) {
        console.error("❌ Error al crear usuario:", error.message);
        res.status(500).json({
            success: false,
            message: "Error al crear el usuario",
            error: error.message,
        });
    }
};


// Login y generación de JWT
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const usuario = await DefineUserModelTenant.findOne({ where: { email } });

//         if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
//             return res.status(401).json({ error: "Credenciales inválidas" });
//         }

//         // Generar token con id, email y rol
//         const token = jwt.sign(
//             {
//                 id: usuario.id_userPK,
//                 email: usuario.email,
//                 role_id: usuario.id_roleFK
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         // Eliminar contraseña antes de enviar al cliente
//         const { password: _, ...userWithoutPassword } = usuario.toJSON();

//         res.json({
//             token,
//             user: userWithoutPassword
//         });

//     } catch (error) {
//         console.error("Error al iniciar sesión:", error);
//         res.status(500).json({ error: "Error en el servidor" });
//     }
// };

// Login y generación de JWT
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Separar usuario y dominio
        const parts = email.split('@');
        if (parts.length !== 2) {
            return res.status(400).json({ error: "Formato de correo inválido" });
        }

        const [username, domain] = parts; // aunque username no lo uses, lo declaras bien
        if (!domain) {
            return res.status(400).json({ error: "Dominio de correo inválido" });
        }

        // 2. El nombre del tenant viene del dominio (antes del ".com")
        const nameTenant = domain.split('.')[0];

        // 3. Buscar el tenant en la tabla de tenants
        const tenant = await TenantModel.findOne({ where: { name_tenant: nameTenant } });

        if (!tenant) {
            return res.status(404).json({ error: "Tenant no encontrado" });
        }

        const dbName = tenant.name_db_tenant; // obtienes el nombre de la base de datos

        // 4. Conectar a la base de datos del tenant
        const sequelizeTenant = getTenantConnection(dbName);

        // 5. Definir el modelo User para este tenant
        const UserModel = DefineUserModelTenant(sequelizeTenant, nameTenant);

        // 6. Buscar el usuario en su tabla de users
        const usuario = await UserModel.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // 7. Comparar contraseñas
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // 8. Generar el JWT token
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                role_id: usuario.role_id,
                tenant_id: usuario.tenant_id, // opcional
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 9. Eliminar la contraseña antes de devolver los datos
        const { password: _, ...userWithoutPassword } = usuario.toJSON();

        // 10. Devolver respuesta
        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



