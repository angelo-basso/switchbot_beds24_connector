import { AccessCode } from "../models/access-code.model";

export async function createAccessCode(data: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    propertyId?: string;
    keypadDeviceId: string;
    codeEncrypted: string;
    validFrom: Date;
    validUntil: Date;
    status: string;
}) {
    return await AccessCode.create(data);
}

export async function deleteAccessCode(bookingId: string) {
    return await AccessCode.destroy({ where: { bookingId } });
}

export async function getAccessCode(bookingId: string) {
    return await AccessCode.findOne({ where: { bookingId } });
}
