import { IBillingBotContext } from '../../context.interface';

export function donationThanksMessage(ctx: IBillingBotContext) {
  return ctx.reply(ctx.t('billing_donation_thanks'));
}
