import { FastifyInstance } from 'fastify';
import { vtt } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';

const VIDEO_TO_TEXT_BOT_URI = '/vtt/bot';
export default async function (fastify: FastifyInstance) {
  fastify.post(
    VIDEO_TO_TEXT_BOT_URI,
    await getWebhookHandler(vtt, {
      enabled: env.isProd,
      uri: VIDEO_TO_TEXT_BOT_URI,
      secret: env.VIDEO_TO_TEXT_BOT_SECRET,
    })
  );

  fastify.get('/vtt', async function () {
    return { message: 'Hello API' };
  });
}
