import { Bot, MiddlewareFn } from 'grammy';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';

export function usageMiddleware(
  limit: number
): MiddlewareFn<IBotCommonCtx<ISessionDataWithLocalization>> {
  return async (ctx, next) => {
    const currentUsage = await ctx.diContainerScope
      .resolve('usage')
      .getUsageCount();

    const subscription = await ctx.diContainerScope
      .resolve('subsciptions')
      .hasActiveSubscription();

    if (!!subscription || currentUsage < limit) {
      return next();
    }

    return ctx.reply(ctx.t('shared_error_limits_reached'));
  };
}
