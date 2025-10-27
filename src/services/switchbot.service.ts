import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { generateSwitchbotSign } from '../utils/hmac.util';
import { logger } from '../utils/logger';

const API_BASE = 'https://api.switch-bot.com/v1.1';

export class SwitchBotService {
    token: string;
    secret: string;

    constructor(token: string, secret: string) {
        this.token = token;
        this.secret = secret;
    }

    private headers() {
        const nonce = uuidv4();
        const t = Date.now().toString();
        const sign = generateSwitchbotSign(this.token, this.secret, t, nonce);
        return {
            Authorization: this.token,
            sign,
            t,
            nonce,
            'Content-Type': 'application/json'
        };
    }

    async getAllDevicesAsync() {
        const url = `${API_BASE}/devices`;
        try{
            const res = await axios.get(url, { headers: this.headers(), timeout: 10000 });
            console.table(res)

        }catch(err: any) {
            logger.error({ err: err?.response?.data || err?.message }, 'SwitchBot getAllDevices error');
            throw err;
        }
    }


    async createKeyAsync(deviceId: string, payload: any) {
        const url = `${API_BASE}/devices/${deviceId}/commands`;
        try {
            const res = await axios.post(url, payload, { headers: this.headers(), timeout: 10000 });
            return res.data;
        } catch (err: any) {
            logger.error({ err: err?.response?.data || err?.message }, 'SwitchBot createKey error');
            throw err;
        }
    }

    async deleteKeyAsync(deviceId: string, payload: any) {
        const url = `${API_BASE}/devices/${deviceId}/commands`;
        try {
            const res = await axios.post(url, payload, { headers: this.headers(), timeout: 10000 });
            return res.data;
        } catch (err: any) {
            logger.error({ err: err?.response?.data || err?.message }, 'SwitchBot deleteKey error');
            throw err;
        }
    }
}
