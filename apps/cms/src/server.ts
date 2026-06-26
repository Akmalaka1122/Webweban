import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

await payload.init({
  secret: process.env.PAYLOAD_SECRET!,
  express: app,
  onInit: async () => {
    payload.logger.info('Payload Admin URL: ' + payload.getAdminURL());
  },
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  payload.logger.info(`CMS running on port ${PORT}`);
});
