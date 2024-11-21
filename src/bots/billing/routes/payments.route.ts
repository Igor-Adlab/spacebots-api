import { Bot } from 'grammy';
import { IBillingBotContext } from '../context.interface';

import { paymentMessage } from '../messages';

export function paymentsRoutes(bot: Bot<IBillingBotContext>) {
  bot.on(':successful_payment', (ctx) => paymentMessage(ctx));
  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
}
