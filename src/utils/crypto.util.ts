import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // nonce length GCM

export function encrypt(text: string, keyBase64: string) {
    const key = Buffer.from(keyBase64, 'base64'); // 32 bytes
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, key, iv, { authTagLength: 16 });
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    // store iv + tag + ciphertext in base64
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(enc: string, keyBase64: string) {
    const key = Buffer.from(keyBase64, 'base64');
    const data = Buffer.from(enc, 'base64');
    const iv = data.slice(0, IV_LENGTH);
    const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
    const ciphertext = data.slice(IV_LENGTH + 16);
    const decipher = crypto.createDecipheriv(ALGO, key, iv, { authTagLength: 16 });
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}
