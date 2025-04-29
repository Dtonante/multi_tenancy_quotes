import TenantModel from "../models/TenantModel.js";

 async function getDbNameByTenantId(tenant_id) {
  const tenant = await TenantModel.findOne({ where: { id: tenant_id } });
  if (!tenant) {
    throw new Error("Tenant no encontrado");
  }
  return {
    dbName: tenant.name_db_tenant,   // base de datos
    nameTenant: tenant.name_tenant   // nuevo: nombre del tenant
  };
}
export default getDbNameByTenantId;
