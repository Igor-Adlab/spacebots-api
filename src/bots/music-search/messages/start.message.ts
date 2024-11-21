import { IMusicSearchBotContext } from '../interfaces';
import { getMusicSearchKeyboard } from '../keyboards';

export function startMessage(ctx: IMusicSearchBotContext, initial = false) {
  const keyboard = getMusicSearchKeyboard(ctx);
  const text = ctx.t('music_search_message_start');

  if (initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
