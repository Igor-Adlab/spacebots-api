import { Api, Bot, RawApi } from 'grammy';
import { i18n } from '../../../i18n';
import { Invoice } from '@prisma/client';
import { ITikTokVideosBotContext } from '../interfaces';

export function invoiceMessage(
  bot: Bot<ITikTokVideosBotContext, Api<RawApi>>,
  invoice: Invoice,
  language: string
) {
  return bot.api.sendInvoice(
    invoice.subscriberId.toString(),
    i18n.t(language, 'tiktok_videos_invoice_title'),
    i18n.t(language, 'tiktok_videos_invoice_description'),
    JSON.stringify({ invoiceId: invoice.id }),
    'XTR',
    [
      {
        amount: invoice.amount,
        label: i18n.t(language, 'tiktok_videos_invoice_product_label'),
      },
    ]
  );
}

export function ctxInvoiceMessage(
  ctx: ITikTokVideosBotContext,
  invoice: Invoice
) {
  return ctx.replyWithInvoice(
    ctx.t('tiktok_videos_invoice_title'),
    ctx.t('tiktok_videos_invoice_description'),
    JSON.stringify({ invoiceId: invoice.id }),
    'XTR',
    [
      {
        amount: invoice.amount,
        label: ctx.t('tiktok_videos_invoice_product_label'),
      },
    ]
  );
}
