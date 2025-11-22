import {Queue, Worker} from 'bullmq';
import {SwitchBotService} from '../services/switchbot.service';
import {decrypt} from '../utils/crypto.util';
import {logger} from '../utils/logger';
import {AccessCode} from "../models/access-code.model";
import {ioRedisConnection} from "../db";

const queueName = 'switchbot-jobs';
export const queue = new Queue(queueName, {connection: ioRedisConnection});

const sw = new SwitchBotService(process.env.SWITCHBOT_TOKEN!, process.env.SWITCHBOT_SECRET!);

const worker = new Worker(queueName, async job => {
    const {accessCodeId, operation} = job.data as any;
    const accessCodeRecord = await AccessCode.findOne({where: {id: accessCodeId}});
    if (!accessCodeRecord) throw new Error('access code not found');

    const passcode = decrypt(accessCodeRecord.encryptedPassword, process.env.ENCRYPTION_KEY!);
    const deviceId = accessCodeRecord.keypadDeviceId;

    if (operation === 'create') {
        const payload = {
            command: 'createKey',
            parameter: {
                name: `Booking_${accessCodeRecord.guestName}`,
                password: passcode,
                startTime: Math.floor(accessCodeRecord.validFrom.getTime() / 1000),
                endTime: Math.floor(accessCodeRecord.validUntil.getTime() / 1000),
                type: 'timeLimit'
            },
            commandType: 'command'
        };
        const res = await sw.createKeyAsync(deviceId, payload);
        accessCodeRecord.status = 'PENDING';
        await accessCodeRecord.save();
        return res;
    } else if (operation === 'delete') {
        const payload = {command: 'deleteKey', parameter: {password: passcode}, commandType: 'command'};
        const res = await sw.deleteKeyAsync(deviceId, payload);
        accessCodeRecord.status = 'REVOKED';
        await accessCodeRecord.save();
        return res;
    } else {
        throw new Error('unknown operation');
    }
}, {connection: ioRedisConnection, concurrency: 5});

worker.on('failed', (job, err) => {
    logger.error({jobId: job?.id, err: err.message}, 'Job failed');
});

export default worker;
