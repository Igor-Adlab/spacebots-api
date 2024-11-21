import { Bot } from 'grammy';
import { ITikTokVideosBotContext } from '../interfaces';

import { paymentMessage } from '../messages';

export function paymentsRoutes(bot: Bot<ITikTokVideosBotContext>) {
  bot.on(':successful_payment', (ctx) => paymentMessage(ctx));
  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
}
