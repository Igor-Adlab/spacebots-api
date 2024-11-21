import { getBillingKeyboard } from '../keyboards';
import { IBillingBotContext } from '../context.interface';

export function startMessage(ctx: IBillingBotContext, initial = false) {
  const keyboard = getBillingKeyboard(ctx);
  const text = ctx.t('billing_message_start');

  if (initial) {
    return ctx.reply(text, { reply_markup: keyboard });
  }

  return ctx.editMessageText(text, { reply_markup: keyboard });
}
