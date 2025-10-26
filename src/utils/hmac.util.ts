import crypto from 'crypto';

export function generateSwitchbotSign(token: string, secret: string, t: string, nonce: string) {
    const data = token + t + nonce;
    return crypto.createHmac('sha256', secret).update(data).digest('base64');
}
