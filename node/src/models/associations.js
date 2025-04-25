import DefineUserModelTenant from "./UserModelTenant.js";
import DefineRoleModelTenant from "./RoleModelTenant.js";
import DefineQuoteModelTenant from "./QuoteModelTenant.js";

// Aquí se definen las relaciones
export function DefineTenantAssociations(sequelize, name_tenant) {
    const User = DefineUserModelTenant(sequelize, name_tenant);
    const Role = DefineRoleModelTenant(sequelize, name_tenant);
    const Quote = DefineQuoteModelTenant(sequelize, name_tenant);

    // Relaciones
    // Un rol puede tener muchos usuarios
    Role.hasMany(User, { foreignKey: "role_id" });
    // Un usuario pertenece a un rol
    User.belongsTo(Role, { foreignKey: "role_id" });
    // Un usuario puede tener muchas citas
    User.hasMany(Quote, { foreignKey: "user_id" });
    // Una cita pertenece a un usuario
    Quote.belongsTo(User, { foreignKey: "user_id" })


    // Sincronizar asociaciones
    sequelize.sync().then(() => {
        console.log("Tablas y relaciones sincronizadas.");
    }).catch(error => {
        console.error("Error al sincronizar las relaciones:", error);
    });

    return { User, Role };
}

export default DefineTenantAssociations;
