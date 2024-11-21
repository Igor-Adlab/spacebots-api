import { ITikTokVideosBotContext } from '../interfaces';
import { getTikTokVideosKeyboard } from '../keyboards';

export function startMessage(ctx: ITikTokVideosBotContext, initial = false) {
  const keyboard = getTikTokVideosKeyboard(ctx);
  const text = ctx.t('tiktok_videos_message_start');

  if (initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
