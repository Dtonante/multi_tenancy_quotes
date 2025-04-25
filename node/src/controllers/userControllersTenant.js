import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import paginate from "../middlewares/paginate.js";
import generateFilters from "../middlewares/filter.js";

dotenv.config();


// Obtener todos los usuarios con paginado y filtros
export const getUsers = (req, res) => {
    const allowedFilters = ["name", "email", "cellPhoneNumber"]; // Campos permitidos para filtrar
    const filters = generateFilters(req.query, allowedFilters);

    paginate(UserModel, req, res, filters);
};

// Obtener un usuario espesifico por id
export const getUser = async (req, res) => {
    const usuario = await UserModel.findByPk(req.params.id_userPK);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
};

// Crear un usuario con encriptacion de contraseña
export const createUser = async (req, res) => {
    const { name, id_roleFK, email, cellPhoneNumber, password } = req.body;
    if (!name || !id_roleFK || !email || !cellPhoneNumber || !password) return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await UserModel.create({ name, id_roleFK, email, cellPhoneNumber, password: hashedPassword });

    res.status(201).json({ message: "Usuario creado", usuario });
};

// Actualizar un usuario por ID
export const updateUser = async (req, res) => {
    try {
        const { id_userPK } = req.params;
        const { name, id_roleFK, email, cellPhoneNumber, password } = req.body;

        const usuario = await UserModel.findByPk(id_userPK);
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
        const usuario = await UserModel.findOne({ where: { email } });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Generar token con id, email y rol
        const token = jwt.sign(
            { 
                id: usuario.id_userPK, 
                email: usuario.email, 
                id_roleFK: usuario.id_roleFK 
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
    const usuario = await UserModel.findByPk(req.params.id_userPK);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado" });
};


