import { Invoice } from '@prisma/client';
import { IBillingBotContext } from '../../context.interface';

export function subscriptionInvoiceMessage(
  invoice: Invoice,
  ctx: IBillingBotContext
) {
  return ctx.replyWithInvoice(
    ctx.t('billing_subscription_title'),
    ctx.t('billing_subscription_description'),
    JSON.stringify({ invoiceId: invoice.id }),
    'XTR',
    [{ amount: invoice.amount, label: ctx.t('billing_subscription_label') }]
  );
}
