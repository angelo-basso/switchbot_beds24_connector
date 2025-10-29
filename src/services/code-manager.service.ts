import {decrypt, encrypt} from '../utils/crypto.util';
import {SwitchBotService} from './switchbot.service';
import {logger} from '../utils/logger';
import {AccessCode} from "../models/access-code.model";
import {IBooking} from "../interfaces/IBooking";

const ENC_KEY = process.env.ENCRYPTION_KEY!;

export class CodeManager {
    switchbot: SwitchBotService;

    constructor(sw: SwitchBotService) {
        this.switchbot = sw;
    }

    async createAndPersistAsync(booking: {
        bookingId: string;
        propertyId?: string;
        guestName?: string;
        guestEmail?: string;
        checkIn: string;
        checkOut: string;
        keypadDeviceId: string;
    }) {
        // Idempotence : si bookingId existe, return existing
        const accessCodeRecord = await AccessCode.findOne({where: {bookingId: booking.bookingId}})
        if (accessCodeRecord) {
            logger.warn({bookingId: booking.bookingId}, 'Access code already exists for bookingId, returning existing');
            return {accessCodeRecord, passcode: decrypt(accessCodeRecord.codeEncrypted, ENC_KEY) };
        }

        // Génère un code sécurisé entre 6 et 12 chiffres

        const passcode = Array.from({length: Math.floor(Math.random() * 7) + 6}, () => Math.floor(Math.random() * 10)).join('');

        const enc = encrypt(passcode, ENC_KEY);
        const accessCode = await AccessCode.create({
            bookingId: booking.bookingId,
            propertyId: booking.propertyId,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            keypadDeviceId: booking.keypadDeviceId,
            codeEncrypted: enc,
            validFrom: new Date(booking.checkIn),
            validUntil: new Date(booking.checkOut),
            status: 'CREATED'
        })
        logger.info({accessCodeId: accessCode.id, bookingId: booking.bookingId}, 'Created access code record');
        // push job to queue or call switchbot here (we will use worker)
        return {accessCode, passcode}; // return passcode so caller can email guest or enqueue job
    }
}
