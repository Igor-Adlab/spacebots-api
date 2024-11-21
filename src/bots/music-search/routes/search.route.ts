import { Bot } from 'grammy';
import { tracksListMenu } from '../menus';
import { IMusicSearchBotContext } from '../interfaces';
import { usageMiddleware } from '../../shared';
import { env } from '../../../env';

export function searchRoute(bot: Bot<IMusicSearchBotContext>) {
  bot.use(tracksListMenu);

  bot.on(
    'message:text',
    usageMiddleware(env.MUSIC_SEARCH_BOT_FREE_DAILY_LIMIT),
    async (ctx, next) => {
      if (ctx.session.menuMessageId) {
        ctx.session.page = 0;
        ctx.session.songs = [];
        await ctx.deleteMessages([ctx.session.menuMessageId]);
      }

      const spinner = await ctx.reply(ctx.t(`music_search_bot_start_search`));

      const { text } = ctx.message;
      if (text.includes('/')) {
        return next();
      }
      ctx.session.songs = await ctx.diContainerScope
        .resolve('musicSearch')
        .find(text);

      await spinner.delete();

      if (!ctx.session.songs?.length) {
        return ctx.reply(
          ctx.t('music_search_message_tracks_not_found', { text })
        );
      }

      const msg = await ctx.reply(
        ctx.t('music_search_message_tracks_result', { text }),
        {
          reply_markup: tracksListMenu,
        }
      );

      ctx.session.menuMessageId = msg.message_id;
      await ctx.diContainerScope.resolve('usage').increase();
    }
  );
}
