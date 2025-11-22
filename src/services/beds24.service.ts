import axios from 'axios';
import {ioRedisConnection} from "../db";

export class Beds24Service {
    private static readonly BASE_URL = 'https://beds24.com/api/v2';

    private static async getTokenAsync() {
        let token = await ioRedisConnection.get('beds24_token');
        if (!token) {
            const res = await axios.get(`${this.BASE_URL}/authentication/token`, {headers: {refreshToken: process.env.BEDS24_REFRESH_TOKEN}});
            if (!res.data || !res.data.token || !res.data.expiresIn) {
                throw new Error("Failed to get Beds24 token");
            }
            token = res.data.token;
            await ioRedisConnection.set('beds24_token', token!, "EX", res.data.expiresIn)
        }
        return token;
    }

    static async setBookingInfoItemAsync(bookingId: string, code: string, text: string) {
        const body = [{id:bookingId, "infoItems": [{"code": code, "text": text}]}];
        const res = await axios.post(`${this.BASE_URL}/bookings`, body, {headers: {token: await this.getTokenAsync()}})
        if(res.status !== 201 || !res.data || res.data.success == false){
            throw new Error(`Error setting booking info item with error: ${res.data?.error}`)
        }
        return;
    }
}