import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../db/prisma';
import { SwitchBotService } from '../services/switchbot.service';
import { decrypt } from '../utils/crypto.util';
import { logger } from '../utils/logger';

const connection = new IORedis(process.env.REDIS_URL!);
const queueName = 'switchbot-jobs';
export const queue = new Queue(queueName, { connection });

const sw = new SwitchBotService(process.env.SWITCHBOT_TOKEN!, process.env.SWITCHBOT_SECRET!);

const worker = new Worker(queueName, async job => {
    const { accessCodeId, operation } = job.data as any;
    const ac = await prisma.accessCode.findUnique({ where: { id: accessCodeId }});
    if (!ac) throw new Error('access code not found');

    const passcode = decrypt(ac.passcodeEncrypted, process.env.ENCRYPTION_KEY!);
    const deviceId = ac.keypadDeviceId;

    if (operation === 'create') {
        const payload = {
            command: 'createKey',
            parameter: {
                name: `Booking_${ac.bookingId}`,
                password: passcode,
                startDate: ac.startDate.toISOString(),
                endDate: ac.endDate.toISOString(),
                type: 'TimeLimitPasscode'
            },
            commandType: 'command'
        };
        const res = await sw.createKeyAsync(deviceId, payload);
        await prisma.accessCode.update({ where: { id: accessCodeId }, data: { status: 'PENDING', switchbotCommandId: res.commandId ?? res.body?.commandId, audit: res }});
        return res;
    } else if (operation === 'delete') {
        const payload = { command: 'deleteKey', parameter: { password: passcode }, commandType: 'command' };
        const res = await sw.deleteKeyAsync(deviceId, payload);
        await prisma.accessCode.update({ where: { id: accessCodeId }, data: { status: 'REVOKED', audit: res }});
        return res;
    } else {
        throw new Error('unknown operation');
    }
}, { connection, concurrency: 5 });

worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err: err.message }, 'Job failed');
});

export default worker;
