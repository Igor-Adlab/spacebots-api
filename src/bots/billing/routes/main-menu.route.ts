import { Bot } from 'grammy';
import {
  donationInvoiceMessage,
  startMessage,
  subscriptionInvoiceMessage,
} from '../messages';
import { IBillingBotContext } from '../context.interface';
import {
  createLanguageSelectionMenu,
  languageSettingsMessage,
  SharedCallbackQuery,
  textInfoMessage,
} from '../../shared';
import { getAskPaymentKeyboard } from '../keyboards';
import { BillingBotCallbackQuery } from '../callback-query.enum';
import { env } from '../../../env';

export function mainMenuRoute(bot: Bot<IBillingBotContext>) {
  const languageSelectionMenu = createLanguageSelectionMenu((ctx) =>
    startMessage(ctx)
  );

  bot.use(languageSelectionMenu);

  // Commands
  bot.command('start', (ctx) => startMessage(ctx, true));

  // Shared callback queries
  bot.callbackQuery(SharedCallbackQuery.MainMenu, (ctx) => startMessage(ctx));
  bot.callbackQuery(SharedCallbackQuery.LanguageSettings, (ctx) =>
    languageSettingsMessage(ctx, languageSelectionMenu)
  );

  bot.callbackQuery(SharedCallbackQuery.Faq, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'billing_message_faq' })
  );

  bot.callbackQuery(SharedCallbackQuery.Donation, (ctx) =>
    textInfoMessage(ctx, {
      localizationKey: 'billing_message_donation',
      keyboard: getAskPaymentKeyboard(ctx, BillingBotCallbackQuery.AskDonation),
    })
  );

  bot.callbackQuery(SharedCallbackQuery.Subscription, (ctx) =>
    textInfoMessage(ctx, {
      localizationKey: 'billing_message_subscription',
      keyboard: getAskPaymentKeyboard(
        ctx,
        BillingBotCallbackQuery.AskSubscription
      ),
    })
  );

  // Bot specific callback queries
  bot.callbackQuery(
    BillingBotCallbackQuery.AskDonation,
    donationInvoiceMessage
  );

  bot.callbackQuery(BillingBotCallbackQuery.AskSubscription, async (ctx) => {
    const invoice = await ctx.diContainerScope
      .resolve('invoices')
      .createInvoice({
        payload: {},
        description: 'Full-pack subscription',
        amount: env.BILLING_BOT_SUBSCRIPTION_PRICE,
      });

    return subscriptionInvoiceMessage(invoice, ctx);
  });
}
