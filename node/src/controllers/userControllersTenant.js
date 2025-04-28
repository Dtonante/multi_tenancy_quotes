import DefineUserModelTenant from "../models/UserModelTenant.js";
import DefineRoleModelTenant from "../models/RoleModelTenant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import paginate from "../middlewares/paginate.js";
import generateFilters from "../middlewares/filter.js";
import { getDbNameByTenantId } from "../services/nameTenantForID.js";
import getTenantConnection from "../config/tenantConnection.js";

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
// export const createUser = async (req, res) => {
//     const { name_user, cellPhoneNumber, email, password, role_id, tenant_id } = req.body;

//     if (!name_user || !cellPhoneNumber || !email || !password || !role_id || !tenant_id) {
//         return res.status(400).json({ error: "Todos los campos son obligatorios" });
//     }

//     try {
//         // 1. Buscar el nombre de la base de datos y el nombre del tenant
//         const { dbName, nameTenant } = await getDbNameByTenantId(tenant_id);

//         // 2. Crear la conexión a esa base de datos
//         const sequelizeTenant = getTenantConnection(dbName);

//         // 3. Definir el modelo para esa conexión y ese tenant
//         const UserModel = DefineUserModelTenant(sequelizeTenant, nameTenant);

//         // 4. Encriptar la contraseña
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 5. Crear el usuario
//         const user = await UserModel.create({
//             name_user,
//             cellPhoneNumber,
//             email,
//             password: hashedPassword,
//             role_id,
//             tenant_id,
//         });

//         res.status(201).json({ message: "Usuario creado", user });
//     } catch (error) {
//         console.error("❌ Error al crear usuario:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error al crear el usuario",
//             error: error.message,
//         });
//     }
// };

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




// Actualizar un usuario por ID
export const updateUser = async (req, res) => {
    try {
        const { id_userPK } = req.params;
        const { name, id_roleFK, email, cellPhoneNumber, password } = req.body;

        const usuario = await DefineUserModelTenant.findByPk(id_userPK);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        // Si se envía una nueva contraseña, la encripta antes de actualizar
        let hashedPassword = usuario.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await usuario.update({
            name,
            id_roleFK,
            email,
            cellPhoneNumber,
            password: hashedPassword
        });

        res.status(200).json({ message: "Usuario actualizado", usuario });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario", detalle: error.message });
    }
};


// Login y generación de JWT
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await DefineUserModelTenant.findOne({ where: { email } });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Generar token con id, email y rol
        const token = jwt.sign(
            {
                id: usuario.id_userPK,
                email: usuario.email,
                role_id: usuario.id_roleFK
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Eliminar contraseña antes de enviar al cliente
        const { password: _, ...userWithoutPassword } = usuario.toJSON();

        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



// Eliminar usuario
export const deleteUser = async (req, res) => {
    const usuario = await DefineUserModelTenant.findByPk(req.params.id_userPK);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado" });
};


