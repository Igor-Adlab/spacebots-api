import { InlineKeyboard } from 'grammy';
import { BillingBotCallbackQuery } from '../callback-query.enum';
import { IBillingBotContext } from '../context.interface';

export function getAskPaymentKeyboard(
  ctx: IBillingBotContext,
  type:
    | BillingBotCallbackQuery.AskDonation
    | BillingBotCallbackQuery.AskSubscription
) {
  let text;
  switch (type) {
    case BillingBotCallbackQuery.AskDonation:
      text = ctx.t('billing_button_ask_donation');
      break;
    default:
      text = ctx.t('billing_button_ask_subscription');
  }

  return new InlineKeyboard().text(text, type);
}
