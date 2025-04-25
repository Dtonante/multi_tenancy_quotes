import { DataTypes } from "sequelize";

function DefineUserModelTenant(sequelize, name_tenant) {
    return sequelize.define(`tbl_${name_tenant}_users`, {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name_user: { type: DataTypes.STRING, allowNull: false },
        cellPhoneNumber: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        timestamps: false,
    });
}

export default DefineUserModelTenant
