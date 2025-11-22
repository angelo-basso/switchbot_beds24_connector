import {Sequelize} from 'sequelize';
import "dotenv/config";
import IORedis from "ioredis";
export const sequelize = new Sequelize(process.env.DATABASE_URL!)
export const ioRedisConnection = new IORedis(process.env.REDIS_URL!,{maxRetriesPerRequest: null})