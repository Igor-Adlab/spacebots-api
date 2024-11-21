import { InlineKeyboard } from 'grammy';

import type { ITikTokVideosBotContext } from '../interfaces';
import { textInfoMessage } from '../../shared';

export async function paymentMessage(ctx: ITikTokVideosBotContext) {
  let data: { isDonation?: boolean; invoiceId?: string } = {};
  try {
    data = JSON.parse(ctx.message?.successful_payment?.invoice_payload!);
  } catch {}

  if (data.isDonation) {
    await textInfoMessage(ctx, {
      initial: true,
      localizationKey: 'billing_donation_thanks',
    });
    return;
  }

  if (!!data.invoiceId) {
    const invoiceService = ctx.diContainerScope.resolve('invoices');
    const invoice = await invoiceService.findInvoiceById(data.invoiceId);

    const videoUrl = invoice.payload['videoUrl'];

    if (invoice) {
      return ctx.api
        .sendMessage(
          invoice.subscriberId.toString(),
          ctx.t('tiktok_videos_message_paid_video_result', { videoUrl }),
          {
            reply_markup: new InlineKeyboard().url(
              ctx.t('tiktok_videos_button_open_result_video'),
              videoUrl
            ),
          }
        )
        .finally(async () => {
          await invoiceService.payInvoice(invoice.id);
        });
    }
  }

  return ctx.reply(ctx.t('tiktok_videos_message_payment_unknown'));
}
