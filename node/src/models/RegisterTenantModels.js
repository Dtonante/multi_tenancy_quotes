import DefineUserModelTenant from "./UserModelTenant.js";
import DefineRoleModelTenant from "./RoleModelTenant.js";
import DefineScheduleConfigModelTenant from "./ScheduleConfigModelTenant.js";
import DefineQuoteModelTenant from "./QuoteModelTenant.js";

function DefineTenantModels(sequelize, name_tenant) {
    const Role = DefineRoleModelTenant(sequelize, name_tenant);
    const User = DefineUserModelTenant(sequelize, name_tenant);
    const ScheduleConfig = DefineScheduleConfigModelTenant(sequelize, name_tenant);
    const Quote = DefineQuoteModelTenant(sequelize, name_tenant);
    return { Role, User, ScheduleConfig, Quote };
}

export default DefineTenantModels
