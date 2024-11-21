import { IVideoToTextBotContext } from '../context.interface';
import { getVttKeyboard } from '../keyboards';

export function startMessage(ctx: IVideoToTextBotContext, initial = false) {
  const keyboard = getVttKeyboard(ctx);
  const text = ctx.t('vtt_message_start');

  if (initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
