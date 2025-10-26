import { prisma } from '../db/prisma';
import { encrypt } from '../utils/crypto.util';
import { SwitchBotService } from './switchbot.service';
import { logger } from '../utils/logger';

const ENC_KEY = process.env.ENCRYPTION_KEY!;

export class CodeManager {
    switchbot: SwitchBotService;
    constructor(sw: SwitchBotService) { this.switchbot = sw; }

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
        const existing = await prisma.accessCode.findUnique({ where: { bookingId: booking.bookingId }});
        if (existing) return existing;

        // Génère un code sécurisé entre 6 et 12 chiffres

        const passcode = Array.from({ length: Math.floor(Math.random() * 7) + 6 }, () => Math.floor(Math.random() * 10)).join('');

        const enc = encrypt(passcode, ENC_KEY);

        const rec = await prisma.accessCode.create({
            data: {
                bookingId: booking.bookingId,
                propertyId: booking.propertyId,
                guestName: booking.guestName,
                guestEmail: booking.guestEmail,
                passcodeEncrypted: enc,
                keypadDeviceId: booking.keypadDeviceId,
                startDate: new Date(booking.checkIn),
                endDate: new Date(booking.checkOut),
                status: 'CREATED'
            }
        });

        // push job to queue or call switchbot here (we will use worker)
        return { rec, passcode }; // return passcode so caller can email guest or enqueue job
    }

    // update status helper
    async updateStatus(id: string, status: string, audit?: any) {
        return prisma.accessCode.update({ where: { id }, data: { status, audit }});
    }
}
