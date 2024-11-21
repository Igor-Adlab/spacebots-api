import { FastifyInstance } from 'fastify';
import { billing } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';

const BILLING_BOT_URI = '/billing/bot';
export default async function (fastify: FastifyInstance) {
  fastify.post(
    BILLING_BOT_URI,
    await getWebhookHandler(billing, {
      enabled: env.isProd,
      uri: BILLING_BOT_URI,
      secret: env.BILLING_BOT_SECRET,
    })
  );

  fastify.get('/billing', async function () {
    return { message: 'Hello API' };
  });
}
