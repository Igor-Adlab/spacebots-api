import { IBillingBotContext } from '../context.interface';
import { donationThanksMessage } from './donation';
import { subscriptionThanksMessage } from './subscription';

export async function paymentMessage(ctx: IBillingBotContext) {
  let data: { isDonation?: boolean; invoiceId?: string } = {};
  try {
    data = JSON.parse(ctx.message?.successful_payment?.invoice_payload!);
  } catch {}

  if (data.isDonation) {
    return donationThanksMessage(ctx);
  }

  if (data.invoiceId) {
    await ctx.diContainerScope.resolve('subsciptions').createSubscription();
    await ctx.diContainerScope.resolve('invoices').payInvoice(data.invoiceId);
    return subscriptionThanksMessage(ctx);
  }

  return ctx.reply(ctx.t('billing_error_unknown_payment'));
}
