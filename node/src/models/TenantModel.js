import { DataTypes } from "sequelize";
import db from "../config/db.js";

const TenantModel = db.define("tbl_tenants", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_tenant: { type: DataTypes.STRING, allowNull: false },
    name_db_tenant: { type: DataTypes.STRING, allowNull: false },
    email_tenant_admin: { type: DataTypes.STRING, allowNull: false },
    tenant_password: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    tableName: "tbl_tenants"
})

export default TenantModel;