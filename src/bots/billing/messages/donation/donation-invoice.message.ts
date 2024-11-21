import { env } from '../../../../env';
import { IBillingBotContext } from '../../context.interface';

export function donationInvoiceMessage(ctx: IBillingBotContext) {
  return ctx.replyWithInvoice(
    ctx.t('billing_donation_title'),
    ctx.t('billing_donation_description'),
    JSON.stringify({ isDonation: true }),
    'XTR',
    [
      {
        amount: env.BILLING_BOT_DONATION_AMOUNT,
        label: ctx.t('billing_donation_label'),
      },
    ]
  );
}
