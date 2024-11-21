import { emojiParser } from '@grammyjs/emoji';
import { hydrateFiles } from '@grammyjs/files';
import { hydrate } from '@grammyjs/hydrate';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { Bot, session } from 'grammy';
import { i18n } from '../../../i18n';
import { logger } from '../../../logger';
import { redis } from '../../../redis';
import { withLogger, awilix } from '../middlewares';
import { env } from '../../../env';
import { run } from '@grammyjs/runner';
import { ISessionDataWithLocalization } from '../interfaces/session-data.interface';
import { IBotCommonCtx } from '../interfaces/bot-common-ctx.interface';
import { diContainer } from '../../../di-container';
import { supportRoute } from '../routes';
import { getSessionKeyGenerator } from './get-session-key-generator';

export interface ICreateBotOptions {
  token: string;
  secret: string;
}

export function createBot<
  T extends IBotCommonCtx<ISessionDataWithLocalization>
>(name: string, options: ICreateBotOptions) {
  const log = logger.child({ bot: `@${name}` });

  const bot = new Bot<T>(options.token);
  bot
    .use(
      session({
        storage: new RedisAdapter({ instance: redis }),
        getSessionKey: getSessionKeyGenerator(name),
        initial: () => ({
          __language_code: 'ru',
        }),
      })
    )
    .use(awilix(diContainer, { serviceId: name }))
    .use(withLogger(log))
    .use(hydrate())
    .use(hydrateReply)
    .use(emojiParser())
    .use(i18n);

  bot.api.config.use(parseMode('HTML')).use(hydrateFiles(options.token));

  // Add support routes to all bots
  supportRoute(bot);

  // Catch and log errors
  bot.catch((err) => log.error(err));

  if (env.isDev && !env.DISABLE_BOTS) {
    log.info('Bot started via @grammy/runner');
    run(bot);
  }

  return bot;
}
