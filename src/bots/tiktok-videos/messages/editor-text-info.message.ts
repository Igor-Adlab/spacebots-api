import { Menu } from '@grammyjs/menu';
import { ITikTokVideosBotContext } from '../interfaces';
import { InlineKeyboard } from 'grammy';

export interface IEditorTextInfoMessageOptions {
  initial?: boolean;
  localizationKey: string;
  keyboard?: InlineKeyboard;
  menu?: Menu;
}

export async function editorTextInfoMessage(
  ctx: ITikTokVideosBotContext,
  options: IEditorTextInfoMessageOptions
) {
  const replyMarkup = options.menu ?? options.keyboard ?? null;

  const text = ctx.t(options.localizationKey);
  if (options.initial) {
    await ctx.reply(text, { reply_markup: replyMarkup });
  } else {
    await ctx.editMessageText(text, { reply_markup: replyMarkup });
  }
}
