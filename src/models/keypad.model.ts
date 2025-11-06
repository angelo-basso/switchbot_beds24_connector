import {DataTypes, Model} from "sequelize";
import {sequelize} from "../db";

export class Keypad extends Model {
    declare uuid: string;
    declare deviceId: string
    declare deviceName: string
}

Keypad.init({
    uuid: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
    deviceId: {type: DataTypes.STRING, allowNull: false},
    deviceName: {type: DataTypes.STRING, allowNull: false},
}, {sequelize, tableName: "keypad"})