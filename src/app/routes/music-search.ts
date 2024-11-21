import { FastifyInstance } from 'fastify';
import { music } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';
import { type MusicSearchService } from '../../services';

const MUSIC_SEARCH_BOT_URI = '/music-search/bot';
export default async function (fastify: FastifyInstance) {
  fastify.post(
    MUSIC_SEARCH_BOT_URI,
    await getWebhookHandler(music, {
      enabled: env.isProd,
      uri: MUSIC_SEARCH_BOT_URI,
      secret: env.MUSIC_SEARCH_BOT_SECRET,
    })
  );

  fastify.get<{
    Querystring: { q: string; page: string };
  }>('/music-search', async function (req) {
    let page = +(req.query?.page || 1);

    if (!req.query.q) {
      return { ok: false, message: '"q" parameter is required' };
    }

    return req.diScope
      .resolve<MusicSearchService>('musicSearch')
      .find(req.query.q, page);
  });
}
