import { getDownloaderKeyboard } from '../keyboards';
import { IDownloaderBotContext } from '../context.interface';

export function startMessage(ctx: IDownloaderBotContext, initial = false) {
  const keyboard = getDownloaderKeyboard(ctx);
  const text = ctx.t('downloader_message_start');

  if (initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
