import bcrypt from "bcryptjs";
import DefineTenantAssociations from "../models/associations.js";  // Asegúrate de importar correctamente las asociaciones

export const createDefaultRolesAndAdminUser = async (tenantSequelize, name_tenant, tenant_id) => {
  const { User, Role } = DefineTenantAssociations(tenantSequelize, name_tenant);

  try {
    // 1. Crear roles por defecto solo si no existen
    const [adminRole, clientRole] = await Promise.all([
      Role.findOrCreate({ where: { name_role: "admin" } }),
      Role.findOrCreate({ where: { name_role: "cliente" } }),
    ]);

    // 2. Crear usuario admin inicial si no existe
    const hashedAdminPassword = await bcrypt.hash("123", 10);
    await User.findOrCreate({
      where: { email: `admin@${name_tenant.toLowerCase()}.com` },
      defaults: {
        name_user: "admin",
        cellPhoneNumber: "123",
        email: `admin@${name_tenant.toLowerCase()}.com`,
        password: hashedAdminPassword,
        role_id: adminRole[0].id,
        tenant_id: tenant_id,  // Asociamos el tenant_id al usuario admin
      },
    });

    console.log("Roles y usuario admin creados correctamente.");
  } catch (error) {
    console.error("Error al crear roles y usuario admin:", error);
  }
};
