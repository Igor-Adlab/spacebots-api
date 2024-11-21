import { Bot } from 'grammy';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';
import { SharedCallbackQuery } from '../callback-query.enum';
import { getBackButtonKeyboard } from '../keyboards';

export function supportRoute<
  T extends IBotCommonCtx<ISessionDataWithLocalization>
>(bot: Bot<T>) {
  bot.callbackQuery(SharedCallbackQuery.Support, (ctx) => {
    const keyboard = getBackButtonKeyboard(ctx);

    const text = ctx.t('shared_message_support');
    return ctx.editMessageText(text, { reply_markup: keyboard });
  });

  bot.callbackQuery(SharedCallbackQuery.AboutUs, (ctx) => {
    const keyboard = getBackButtonKeyboard(ctx);

    const text = ctx.t('shared_message_about');
    return ctx.editMessageText(text, { reply_markup: keyboard });
  });
}
