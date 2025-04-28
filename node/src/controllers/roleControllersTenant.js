import DefineRoleModelTenant from "../models/RoleModelTenant.js";

// Obtener todos los roles
export const getRoles = async (req, res) => {
    try {
        const roles = await DefineRoleModelTenant.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los roles", error: error.message });
    }
};

// Obtener un rol por ID
export const getRoleForID = async (req, res) => {
    try {
        const { id_rolPK } = req.params;
        const rol = await DefineRoleModelTenant.findByPk(id_rolPK);
        if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el rol", error: error.message });
    }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
    try {
        const { name_role } = req.body;
        if (!name_role) return res.status(400).json({ message: "El nombre del rol es obligatorio" });

        const nuevoRol = await DefineRoleModelTenant.create({ name_role });
        res.status(201).json({ message: "Rol creado con éxito", rol: nuevoRol });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el rol", error: error.message });
    }
};

// Actualizar un rol por su ID
export const updateRole = async (req, res) => {
    try {
        const { id_rolPK } = req.params;
        const rol = await DefineRoleModelTenant.findByPk(id_rolPK);
        if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

        await rol.update(req.body);
        res.status(200).json({ message: "Rol actualizado con éxito", rol });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol", error: error.message });
    }
};

// Eliminar un rol por su ID
export const deleteRole = async (req, res) => {
    try {
        const { id_rolPK } = req.params;
        const rol = await DefineRoleModelTenant.findByPk(id_rolPK);
        if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

        await rol.destroy();
        res.status(200).json({ message: "Rol eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el rol", error: error.message });
    }
};
