import { FastifyInstance } from 'fastify';
import { tiktok } from '../../bots';
import { env } from '../../env';
import { getWebhookHandler } from '../../bots/shared';
import {
  ErrorWebhooksPayload,
  ProgressWebhooksPayload,
  SuccessWebhooksPayload,
} from '../../bots/tiktok-videos/interfaces';
import { I18n } from '@grammyjs/i18n';
import { ServiceId } from '../../services-id.enum';
import { InlineKeyboard } from 'grammy';
import { emoji } from '@grammyjs/emoji';
import { logger } from '../../logger';
import { InvoicesService } from '../../services';
import { calculatePrice } from '../../bots/tiktok-videos/utils';
import { invoiceMessage } from '../../bots/tiktok-videos/messages';

const TIKTOK_VIDEOS_BOT_URI = `/${ServiceId.TikTokVideos}/bot`;
export default async function (fastify: FastifyInstance) {
  fastify.post(
    TIKTOK_VIDEOS_BOT_URI,
    await getWebhookHandler(tiktok, {
      enabled: env.isProd,
      uri: TIKTOK_VIDEOS_BOT_URI,
      secret: env.TIKTOK_VIDEOS_BOT_SECRET,
    })
  );

  // Main route
  fastify.get<{
    Querystring: { language?: string };
  }>(`/${ServiceId.TikTokVideos}`, async function (req) {
    return {
      message: 'Hello World',
      serviceId: req.diScope.resolve<string>('serviceId'),
    };
  });

  // Webhooks
  fastify.post<{
    Body: ErrorWebhooksPayload;
  }>(
    `/${ServiceId.TikTokVideos}/webhooks/error`,
    {
      preHandler: fastify.auth([fastify.verifyBearerAuth]),
    },
    async function (req, res) {
      const dto = req.body;
      await tiktok.api.editMessageText(
        dto.chatId,
        dto.messageId,
        req.diScope
          .resolve<I18n>('i18n')
          .t(dto.language, 'tiktok_videos_message_video_processing_error')
      );

      return { ok: true };
    }
  );

  fastify.post<{
    Body: ProgressWebhooksPayload;
  }>(
    `/${ServiceId.TikTokVideos}/webhooks/progress`,
    {
      preHandler: fastify.auth([fastify.verifyBearerAuth]),
    },
    async function (req) {
      const dto = req.body;
      await tiktok.api.editMessageText(
        dto.chatId,
        dto.messageId,
        req.diScope
          .resolve<I18n>('i18n')
          .t(dto.language, 'tiktok_videos_message_video_processing_progress', {
            progress: dto.progress,
          })
      );
      return { ok: true };
    }
  );

  fastify.post<{
    Body: SuccessWebhooksPayload;
  }>(
    `/${ServiceId.TikTokVideos}/webhooks/success`,
    {
      preHandler: fastify.auth([fastify.verifyBearerAuth]),
    },
    async function (req) {
      try {
        const dto = req.body;
        if (dto.isPaid) {
          const invoice = await req.diScope
            .resolve<InvoicesService>('invoices')
            .createInvoice({
              description: 'Video processing',
              payload: { videoUrl: dto.resultVideoUrl },
              amount: calculatePrice(dto.duration),
            });

          if (!invoice) {
            await tiktok.api.editMessageText(
              dto.chatId,
              dto.messageId,
              req.diScope
                .resolve<I18n>('i18n')
                .t(
                  dto.language,
                  'tiktok_videos_message_invoice_creation_error',
                  {
                    videoUrl: dto.resultVideoUrl,
                  }
                )
            );
            return { ok: false };
          }

          await invoiceMessage(tiktok, invoice, dto.language);
        } else {
          await tiktok.api.editMessageText(
            dto.chatId,
            dto.messageId,
            req.diScope
              .resolve<I18n>('i18n')
              .t(
                dto.language,
                'tiktok_videos_message_video_processing_success',
                {
                  tiktokVideosBotLimit: env.TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT,
                }
              ),
            {
              reply_markup: new InlineKeyboard().url(
                `${emoji('film_frames')} ${req.diScope
                  .resolve<I18n>('i18n')
                  .t(dto.language, 'tiktok_videos_button_open_result_video')}`,
                dto.resultVideoUrl
              ),
            }
          );
        }
        return { ok: true };
      } catch (err) {
        logger.error(`Error: ${err.message}: `, JSON.stringify(err));
      }
    }
  );
}
