import { IBillingBotContext } from '../../context.interface';

export function subscriptionThanksMessage(ctx: IBillingBotContext) {
  return ctx.reply(ctx.t('billing_subscription_thanks'));
}
