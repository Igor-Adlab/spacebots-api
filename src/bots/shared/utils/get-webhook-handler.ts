import { Bot, webhookCallback } from 'grammy';
import { env } from '../../../env';
import { logger } from '../../../logger';

export interface IBindBotWebhookOptions {
  uri: string;
  secret: string;
  enabled?: boolean;
}

export async function getWebhookHandler(
  bot: Bot,
  options: IBindBotWebhookOptions
) {
  if (options.enabled) {
    logger.info(`Bot ${(await bot.api.getMe()).username} registered webhook`);

    await bot.api.setWebhook(`https://${env.API_HOST}/${options.uri}`, {
      drop_pending_updates: true,
      secret_token: options.secret,
    });
  }

  return webhookCallback(bot, 'fastify', {
    secretToken: options.secret,
  });
}
