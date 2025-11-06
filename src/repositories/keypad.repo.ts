import {Keypad} from "../models/keypad.model";

export async function createKeypad(data: {
    deviceId: string;
    deviceName: string;
}) {
    return await Keypad.create(data);
}

export async function deleteAccessCode(bookingId: string) {
    return await Keypad.destroy({where: {bookingId}});
}

export async function getAccessCode(bookingId: string) {
    return await Keypad.findOne({where: {bookingId}});
}
