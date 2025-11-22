import pino from 'pino';
import "dotenv/config";
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: ['req.headers.authorization', 'body.passcode', 'passcodeEncrypted'],
        censor: '[REDACTED]'
    }
});
