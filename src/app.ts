import express from 'express';
import router from './api/controller';
import {logger} from './utils/logger';
import {sequelize} from "./db";
import "dotenv/config";
const app = express();
app.use(router);

const port = process.env.PORT || 3000;
(async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database connection established");
        await sequelize.sync({alter: true})
        logger.info("Database synchronized");
        app.listen(port, () => logger.info(`Server listening on ${port}`));
    } catch (err) {
        logger.error({err}, "Failed to start server");
        process.exit(1);
    }
})();
