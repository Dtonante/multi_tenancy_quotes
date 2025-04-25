import { DataTypes } from "sequelize";

function DefineQuoteModelTenant(sequelize, name_tenant) {
    return sequelize.define(`tbl_${name_tenant}_quotes`, {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.STRING, allowNull: false },
        dateAndTimeQuote: { type: DataTypes.STRING, allowNull: false },
        status: { 
            type: DataTypes.ENUM("activa", "realizada", "cancelada"),
            allowNull: false,
            defaultValue: "activa"
        }
    }, {
        timestamps: false,
    });
}

export default DefineQuoteModelTenant
