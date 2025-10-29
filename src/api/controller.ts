import express from 'express';
import {logger} from '../utils/logger';
import {queue} from '../workers/switchbot.worker';
import {CodeManager} from '../services/code-manager.service';
import {SwitchBotService} from '../services/switchbot.service';
import "dotenv/config";
import {IBooking} from "../interfaces/IBooking";
const router = express.Router();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

router.post('/hooks/beds24/switchbot', express.json(), async (req, res) => {
    try {
        const auth = req.header('authorization') || '';
        if (auth !== `Bearer ${WEBHOOK_SECRET}`) return res.status(401).send({ error: 'unauthorized' });

        const payload = req.body as IBooking;
        // minimal validation
        if (!payload.bookingId || !payload.checkIn || !payload.checkOut || !payload.keypadDeviceId || !payload.guestName || !payload.guestEmail) {
            return res.status(400).send({ error: 'invalid payload' });
        }

        const switchbot = new SwitchBotService(
            process.env.SWITCHBOT_TOKEN!,
            process.env.SWITCHBOT_SECRET!
        );
        const cm = new CodeManager(switchbot);

        const result = await cm.createAndPersistAsync(payload);
        if(!result.accessCode){
            return res.status(500).send({ error: 'failed to create access code' });
        }
        // If the service returned rec + passcode, enqueue job to actually create key
        const rec = result.accessCode;
        await queue.add('create', { accessCodeId: rec.id, operation: 'create' });

        // Optionally: send back the generated passcode to your notification service here (email/SMS) using result.passcode
        // But do NOT include the passcode in this HTTP response to Beds24
        res.status(200).json({ status: 'accepted', bookingId: payload.bookingId, accessCode: result.accessCode });
    } catch (err: any) {
        logger.error({ err: err.message }, 'webhook error');
        res.status(500).send({ error: 'internal_error' });
    }
});

router.get('/switchbot/devices', async (req, res) => {
    const switchbot = new SwitchBotService(
        process.env.SWITCHBOT_TOKEN!,
        process.env.SWITCHBOT_SECRET!
    );
    const response = await switchbot.getAllDevicesAsync();
    res.status(200).json(response.data.body);
})

export default router;
