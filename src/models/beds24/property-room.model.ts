import {DataTypes, Model} from "sequelize";
import {Keypad} from "../keypad.model";
import {sequelize} from "../../db";

export class PropertyRoom extends Model {
    declare id: string;
    declare name: string;
    declare keypad:Keypad;
}
/*
PropertyRoom.init({
    id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
    name: {type: DataTypes.STRING, allowNull: false}
},{
    sequelize, tableName: "property_room", schema: "beds24"
})
PropertyRoom.hasOne(Keypad)*/
