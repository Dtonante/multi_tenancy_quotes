import bcrypt from "bcryptjs";
import { createDatabaseTenant } from "../config/createTenantDB.js";
import { getTenantConnection } from "../config/tenantConnection.js";
import TenantModel from "../models/tenantModel.js";
import DefineTenantModels from "../models/RegisterTenantModels.js";
import { DefineTenantAssociations } from "../models/associations.js";
import { createDefaultRolesAndAdminUser } from "../services/tenantService.js";

export const registerTenant = async (req, res) => {
    const { name_tenant, email_tenant_admin, tenant_password } = req.body;

    // Verificar que todos los campos necesarios estén presentes
    if (!name_tenant || !email_tenant_admin || !tenant_password) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son requeridos",
        });
    }

    const name_db_tenant = `db_${name_tenant.toLowerCase()}`;

    try {
        // 1. Verificar si el tenant ya existe
        const existing = await TenantModel.findOne({ where: { name_tenant } });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "El tenant ya existe",
            });
        }

        // 2. Crear la base de datos para el tenant
        await createDatabaseTenant(name_db_tenant);

        // 3. Obtener la conexión a la base de datos del tenant
        const tenantSequelize = getTenantConnection(name_db_tenant);

        // 4. Registrar los modelos de usuario y rol
        const models = DefineTenantModels(tenantSequelize, name_tenant);

        // 5. Definir las relaciones entre los modelos
        DefineTenantAssociations(tenantSequelize, name_tenant);

        // 6. Sincronizar la base de datos y crear las tablas
        await tenantSequelize.sync();

        // 7. Crear los roles por defecto y el usuario admin
        await createDefaultRolesAndAdminUser(tenantSequelize, name_tenant);

        // 8. Crear el tenant en la base de datos principal
        const hashedPassword = await bcrypt.hash(tenant_password, 10);
        const newTenant = await TenantModel.create({
            name_tenant,
            name_db_tenant,
            email_tenant_admin,
            tenant_password: hashedPassword,
        });

        // 9. Responder con éxito
        return res.status(201).json({
            success: true,
            message: "Tenant creado correctamente.",
            tenant: {
                id: newTenant.id,
                name_tenant,
                database: name_db_tenant,
                email_tenant_admin: `admin@${name_tenant.toLowerCase()}.com`,
                default_admin_user: `admin@${name_tenant.toLowerCase()}.com`,
            },
            requestData: {  // Datos que se enviaron para registrar el tenant
                name_tenant,
                email_tenant_admin,
                tenant_password,
            }
        });
    } catch (error) {
        console.error("❌ Error al registrar tenant:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error interno al registrar el tenant",
            error: error.message,
        });
    }
};

