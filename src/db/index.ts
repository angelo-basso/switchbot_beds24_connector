import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: "postgres",
    logging: (process.env.DB_LOGGING_ENABLED === "true")
})