import {DataTypes, Model} from "sequelize";
import {sequelize} from "../../db";
import {PropertyRoom} from "./property-room.model";

export class Property extends Model {
    declare id: string;
    declare name: string;
}
/*

Property.init({
    id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, tableName: "property", schema: "beds24"})

Property.hasMany(PropertyRoom)*/
