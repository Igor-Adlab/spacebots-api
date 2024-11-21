import { FastifyInstance } from 'fastify';
import { downloader } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';

const DOWNLOADER_BOT_URI = '/downloader/bot';
export default async function (fastify: FastifyInstance) {
  fastify.post(
    DOWNLOADER_BOT_URI,
    await getWebhookHandler(downloader, {
      enabled: env.isProd,
      uri: DOWNLOADER_BOT_URI,
      secret: env.DOWNLOADER_BOT_SECRET,
    })
  );

  fastify.get('/downloader', async function () {
    return { message: 'Hello API' };
  });
}
