import { DataTypes } from "sequelize";

function DefineRoleModelTenant(sequelize, name_tenant) {
    return sequelize.define(`tbl_${name_tenant}_roles`, {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name_role: { type: DataTypes.STRING, allowNull: false },
    }, {
        timestamps: false,
    });
}

export default DefineRoleModelTenant
