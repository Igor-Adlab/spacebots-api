import { FastifyInstance } from 'fastify';
import { captions } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';

const VIDEO_CAPTIONS_BOT_URI = '/video-captions/bot';
export default async function (fastify: FastifyInstance) {
  fastify.post(
    VIDEO_CAPTIONS_BOT_URI,
    await getWebhookHandler(captions, {
      enabled: env.isProd,
      uri: VIDEO_CAPTIONS_BOT_URI,
      secret: env.VIDEO_CAPTIONS_BOT_SECRET,
    })
  );

  fastify.get('/video-captions', async function () {
    return { message: 'Hello API' };
  });
}
