import express from 'express';
import router from './api/controller';
import { logger } from './utils/logger';

const app = express();
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Server listening on ${port}`));
