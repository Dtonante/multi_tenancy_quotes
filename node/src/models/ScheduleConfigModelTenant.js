import { DataTypes } from "sequelize";

function DefineScheduleConfigModelTenant(sequelize, name_tenant) {
    return sequelize.define(`tbl_${name_tenant}_schedule_Configs`, {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        date: { type: DataTypes.STRING, allowNull: false },
        workStart: { type: DataTypes.STRING, allowNull: false },
        workEnd: { type: DataTypes.STRING, allowNull: false, unique: true },
        lunchStart: { type: DataTypes.STRING, allowNull: false },
        lunchEnd: { type: DataTypes.STRING, allowNull: false }
    }, {
        timestamps: false,
    });
}

export default DefineScheduleConfigModelTenant
