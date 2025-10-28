import {DataTypes, Model} from "sequelize";
import {sequelize} from "../db";

export class AccessCode extends Model {
    declare id: string;
    declare bookingId: string;
    declare codeEncrypted: string;
    declare propertyId?: string
    declare guestName: string
    declare guestEmail: string
    declare keypadDeviceId: string
    declare validFrom: Date;
    declare validUntil: Date;
    declare status: string;
}

AccessCode.init(
    {
        id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
        bookingId: {type: DataTypes.STRING, allowNull: false},
        guestName: {type: DataTypes.STRING, allowNull: false},
        guestEmail: {type: DataTypes.STRING, allowNull: false},
        propertyId: {type: DataTypes.STRING, allowNull: true},
        keypadDeviceId: {type: DataTypes.STRING, allowNull: false},
        codeEncrypted: {type: DataTypes.STRING, allowNull: false},
        validFrom: {type: DataTypes.DATE, allowNull: false},
        validUntil: {type: DataTypes.DATE, allowNull: false},
        status: {type: DataTypes.STRING, allowNull: false},
    },
    {sequelize, tableName: "access_codes"}
);