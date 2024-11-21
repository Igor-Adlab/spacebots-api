import { InlineKeyboard } from 'grammy';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';
import { getBackButtonKeyboard } from '../keyboards';
import { Menu } from '@grammyjs/menu';

// TODO: add ability to send photo
export interface ITextInfoMessageOptions {
  initial?: boolean;
  localizationKey: string;
  keyboard?: InlineKeyboard;
  menu?: Menu;
}

export function textInfoMessage(
  ctx: IBotCommonCtx<ISessionDataWithLocalization>,
  options: ITextInfoMessageOptions
) {
  const backButtonKeyboard = getBackButtonKeyboard(ctx);

  const text = ctx.t(options.localizationKey);
  let keyboard: InlineKeyboard | Menu = options.keyboard
    ? options.keyboard.append(backButtonKeyboard)
    : backButtonKeyboard;

  if (options.menu) {
    keyboard = options.menu;
  }

  if (options.initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
