import { Bot } from 'grammy';
import { linkInfoMessage } from '../messages';
import { IDownloaderBotContext } from '../context.interface';
import { env } from '../../../env';
import { usageMiddleware } from '../../shared';

export function urlRoute(bot: Bot<IDownloaderBotContext>) {
  bot.on(
    '::url',
    usageMiddleware(env.DOWNLOADER_BOT_FREE_DAILY_LIMIT),
    async (ctx) => {
      const preview = ctx.message.link_preview_options || {};
      const [url] = /https?:\/\/[^\s/$.?#].[^\s]*/gi.exec(ctx.message.text);
      if (!url && !preview?.url) {
        return ctx.reply(ctx.t('downloader_incorrect_social_link'));
      }

      const info = await ctx.diContainerScope
        .resolve('downloader')
        .getInfo(url || preview?.url)
        .catch(() => {});

      if (!info) {
        return ctx.reply(ctx.t('downloader_incorrect_social_link'));
      }

      await ctx.diContainerScope.resolve('usage').increase();
      return linkInfoMessage(ctx, info);
    }
  );

  bot.callbackQuery(/delete_(\d+)_(\d+)$/, (ctx) => {
    ctx.answerCallbackQuery();
    const [_, chatId, messageId] = ctx.match;
    return ctx.api
      .deleteMessage(+chatId, +messageId)
      .catch((err) => console.log('Error: ', err));
  });
  bot.callbackQuery('delete_current', (ctx) => ctx.deleteMessage());
}
