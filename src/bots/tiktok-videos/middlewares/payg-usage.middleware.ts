import { MiddlewareFn } from 'grammy';
import {
  IBotCommonCtx,
  ISessionDataWithLocalization,
} from '../../shared/interfaces';
import { ctxInvoiceMessage } from '../messages';

// Usage middleware based on usage and unpaid invoices
export function payAsYouGoUsageMiddleware(
  limit: number
): MiddlewareFn<IBotCommonCtx<ISessionDataWithLocalization>> {
  return async (ctx, next) => {
    const invoicesService = ctx.diContainerScope.resolve('invoices');

    const currentUsage = await ctx.diContainerScope
      .resolve('usage')
      .getUsageCount();

    const unpaidInvoice = await invoicesService.findPendingInvoice();
    if (currentUsage <= limit || !unpaidInvoice) {
      return next();
    }

    await ctx.reply(ctx.t('tiktok_videos_unpaid_invoice_found'));
    await ctxInvoiceMessage(ctx, unpaidInvoice);
  };
}
